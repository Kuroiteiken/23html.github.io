// Locale bootstrap. Loads the locale manifest and message files, exposes the
// global `i18n` helper, then injects the game bundle. It must run before the
// bundle because modules call `i18n.t()` while defining their content. The
// deploy asset version is read from this script's own URL and forwarded to every
// request it makes, so a release cannot mix cached files from an older build.

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

  // index.html is the one file in the deploy that carries no version of its own, so
  // it is the one a browser will keep. When it is stale it asks for the ?v= of the
  // build it came from, and every asset that follows is stale too -- the player can
  // refresh all day and never see the update. So the running page asks the server
  // what the current build is and, if it disagrees, replaces itself with a URL that
  // carries the new version, which is a different resource and therefore fetched
  // fresh rather than served from the cache.
  //
  // Guarded three ways so it can never loop: it only runs for a deploy that stamped a
  // version, it records the version it has already tried in sessionStorage, and it
  // does nothing at all if the check itself fails.
  async function reloadIfStale() {
    if (!assetVersion) return false;
    let current;
    try {
      const response = await fetch(
        versioned(new URL("version.json", loaderUrl)),
        {
          cache: "no-store",
        },
      );
      if (!response.ok) return false;
      current = (await response.json()).assetVersion;
    } catch (error) {
      return false;
    }
    if (!current || current === assetVersion) return false;
    try {
      const key = "proto23.staleindex";
      if (window.sessionStorage.getItem(key) === current) return false;
      window.sessionStorage.setItem(key, current);
    } catch (error) {
      // Storage blocked. Better to reload once too often than to strand the player
      // on a build the server has replaced.
    }
    const fresh = new URL(window.location.href);
    fresh.searchParams.set("v", current);
    window.location.replace(fresh.href);
    return true;
  }

  async function start() {
    if (await reloadIfStale()) return;
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
