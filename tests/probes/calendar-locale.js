// Browser probe for /__test-calendar-locale.html, read by scripts/serve.js and
// injected into the deployed index.html. Runs in the page, not in Node.

const calendarLocaleProbe = setInterval(() => {
  if (
    !document.getElementById("ctrmg") ||
    typeof isDay !== "function" ||
    typeof getDay !== "function"
  )
    return;
  clearInterval(calendarLocaleProbe);
  const previousDay = time.day;
  time.day = 6;
  document.documentElement.dataset.calendarLocaleSafe = String(
    isDay(6) && getDay(1) === "Pazar" && getDay(2) === "Paz.",
  );
  time.day = previousDay;
}, 10);
