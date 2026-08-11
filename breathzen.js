(function () {
  var LANGS = ["en", "zh-Hans"];

  function normalise(tag) {
    if (!tag) return null;
    tag = tag.toLowerCase();
    if (tag.indexOf("zh") === 0) return "zh-Hans";
    return tag.split("-")[0] === "en" ? "en" : null;
  }

  function preferred() {
    var query = normalise(new URLSearchParams(location.search).get("lang"));
    if (query) return query;

    try {
      var saved = localStorage.getItem("breathzen.lang");
      if (LANGS.indexOf(saved) >= 0) return saved;
    } catch (error) { /* Private browsing: continue with browser language. */ }

    var list = navigator.languages || [navigator.language];
    for (var i = 0; i < list.length; i += 1) {
      var match = normalise(list[i]);
      if (match) return match;
    }
    return "en";
  }

  function show(lang) {
    document.querySelectorAll("article[lang]").forEach(function (article) {
      article.classList.toggle("active", article.getAttribute("lang") === lang);
    });
    document.querySelectorAll(".languages button").forEach(function (button) {
      button.setAttribute("aria-pressed", String(button.dataset.lang === lang));
    });
    document.documentElement.setAttribute("lang", lang);
    try { localStorage.setItem("breathzen.lang", lang); } catch (error) {}
  }

  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".languages button").forEach(function (button) {
      button.addEventListener("click", function () { show(button.dataset.lang); });
    });
    show(preferred());
  });
})();

