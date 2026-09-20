(function () {
  var root = document.documentElement;

  // ---------- 테마 토글 ----------
  var toggle = document.getElementById("theme-toggle");
  if (toggle) {
    toggle.addEventListener("click", function () {
      var prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      var current = root.dataset.theme;
      if (current !== "light" && current !== "dark") current = prefersDark ? "dark" : "light";
      var next = current === "dark" ? "light" : "dark";
      root.dataset.theme = next;
      try { localStorage.setItem("theme", next); } catch (e) {}
    });
  }

  // ---------- 인쇄 ----------
  var print = document.getElementById("print");
  if (print) print.addEventListener("click", function () { window.print(); });

  // ---------- 언어: 선택 기억 + 첫 방문 시 자동 전환 ----------
  var links = document.querySelectorAll(".lang-switch a[data-lang]");
  var current = root.lang;
  links.forEach(function (a) {
    a.addEventListener("click", function () {
      try {
        localStorage.setItem("lang", a.dataset.lang);
        sessionStorage.setItem("lang-switched", "1");
      } catch (e) {}
    });
  });
  try {
    var pref = localStorage.getItem("lang");
    var internal = document.referrer && document.referrer.indexOf(location.origin) === 0;
    if (pref && pref !== current && !internal && !sessionStorage.getItem("lang-switched")) {
      var target = document.querySelector('.lang-switch a[data-lang="' + pref + '"]');
      if (target) {
        sessionStorage.setItem("lang-switched", "1");
        location.replace(target.href);
      }
    }
  } catch (e) {}
})();
