(function bootstrapInternationalization() {
  const storageKey = "proto23.locale";
  const loaderUrl = new URL(document.currentScript.src, window.location.href);
  const assetVersion = loaderUrl.searchParams.get("v");
  const localeRoot = new URL("../locales/", loaderUrl);

  function versioned(url) {
    if (assetVersion) url.searchParams.set("v", assetVersion);
    return url;
  }

  const gameBundleUrl = versioned(new URL("game.js", loaderUrl));

  function getPath(source, path) {
    return path.split(".").reduce((value, key) => value?.[key], source);
  }

  function interpolate(value, replacements = {}) {
    if (typeof value !== "string") return value;
    return value.replace(/\{([\w.-]+)\}/g, (match, key) =>
      Object.hasOwn(replacements, key) ? replacements[key] : match,
    );
  }

  async function getJson(url) {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Unable to load ${url}: HTTP ${response.status}`);
    }
    return response.json();
  }

  function showLoadError(error) {
    console.error(error);
    const message = document.createElement("div");
    message.className = "i18n-load-error";
    message.textContent =
      "The language files could not be loaded. Run the game through a web server and reload the page.";
    document.body.append(message);
  }

  async function start() {
    const manifest = await getJson(
      versioned(new URL("manifest.json", localeRoot)),
    );
    const defaultDefinition = manifest.locales.find(
      ({ code }) => code === manifest.defaultLocale,
    );
    if (!defaultDefinition) {
      throw new Error(
        "The default locale is missing from locales/manifest.json",
      );
    }

    const requestedLocale = new URL(window.location.href).searchParams.get(
      "lang",
    );
    const storedLocale = window.localStorage.getItem(storageKey);
    const selectedDefinition =
      manifest.locales.find(({ code }) => code === requestedLocale) ??
      manifest.locales.find(({ code }) => code === storedLocale) ??
      defaultDefinition;
    const fallbackMessages = await getJson(
      versioned(new URL(defaultDefinition.file, localeRoot)),
    );
    const selectedMessages =
      selectedDefinition.code === defaultDefinition.code
        ? fallbackMessages
        : await getJson(
            versioned(new URL(selectedDefinition.file, localeRoot)),
          );

    window.i18n = {
      availableLocales: manifest.locales.map(({ code, name }) => ({
        code,
        name,
      })),
      currentLocale: selectedDefinition.code,
      defaultLocale: defaultDefinition.code,
      format(value, replacements) {
        return interpolate(value, replacements);
      },
      get(key) {
        return getPath(selectedMessages, key) ?? getPath(fallbackMessages, key);
      },
      setLocale(code) {
        if (!manifest.locales.some((locale) => locale.code === code)) return;
        window.localStorage.setItem(storageKey, code);
        window.location.reload();
      },
      t(key, replacements) {
        const value = this.get(key);
        return interpolate(
          typeof value === "string" ? value : key,
          replacements,
        );
      },
    };

    document.documentElement.lang = selectedDefinition.code;
    const gameScript = document.createElement("script");
    gameScript.src = gameBundleUrl.href;
    gameScript.onerror = () =>
      showLoadError(new Error(`Unable to load ${gameBundleUrl.href}`));
    document.body.append(gameScript);
  }

  start().catch(showLoadError);
})();
