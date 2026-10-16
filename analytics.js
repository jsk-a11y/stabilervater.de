(function () {
  "use strict";

  var CONSENT_KEY = "sv_cookie_consent_v1";
  var CONSENT_VERSION = "cookie-consent-v2-2026-10-16";
  var MATOMO_BASE = "https://analytics.kim-con.com/";
  var SITE_ID = "3";
  var loaded = false;

  function readConsent() {
    try {
      return JSON.parse(window.localStorage.getItem(CONSENT_KEY));
    } catch (error) {
      return null;
    }
  }

  function isAllowed(consent) {
    return Boolean(consent && consent.version === CONSENT_VERSION && consent.analytics);
  }

  function activate() {
    window._paq = window._paq || [];

    if (loaded) {
      window._paq.push(["forgetUserOptOut"]);
      window._paq.push(["setConsentGiven"]);
      window._paq.push(["trackPageView"]);
      return;
    }

    loaded = true;
    window._paq.push(["setTrackerUrl", MATOMO_BASE + "matomo.php"]);
    window._paq.push(["setSiteId", SITE_ID]);
    window._paq.push(["setDoNotTrack", true]);
    window._paq.push(["requireConsent"]);
    window._paq.push(["forgetUserOptOut"]);
    window._paq.push(["setConsentGiven"]);
    window._paq.push(["enableLinkTracking"]);
    window._paq.push(["trackPageView"]);

    var script = document.createElement("script");
    script.async = true;
    script.src = MATOMO_BASE + "matomo.js";
    script.dataset.consentCategory = "analytics";
    document.head.appendChild(script);
  }

  function deactivate() {
    if (!window._paq) return;
    window._paq.push(["forgetConsentGiven"]);
    window._paq.push(["deleteCookies"]);
    window._paq.push(["optUserOut"]);
  }

  var storedConsent = readConsent();
  if (isAllowed(storedConsent)) activate();

  window.addEventListener("sv:consent-updated", function (event) {
    if (isAllowed(event.detail)) activate();
    else deactivate();
  });
}());
