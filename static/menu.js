// Mobile menu toggle and click-to-open submenus. Without JS the menu is shown expanded.
document.documentElement.classList.add("js");
document.addEventListener("click", function (e) {
  var toggle = e.target.closest(".nav-toggle");
  if (toggle) {
    var open = toggle.getAttribute("aria-expanded") !== "true";
    toggle.setAttribute("aria-expanded", open);
    document.body.classList.toggle("menu-open", open);
    return;
  }
  var btn = e.target.closest(".has-sub > button");
  document.querySelectorAll(".has-sub > button[aria-expanded=true]").forEach(function (b) {
    if (b !== btn) b.setAttribute("aria-expanded", "false");
  });
  if (btn) btn.setAttribute("aria-expanded", btn.getAttribute("aria-expanded") !== "true");
});
document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") {
    document.querySelectorAll(".has-sub > button[aria-expanded=true]").forEach(function (b) {
      b.setAttribute("aria-expanded", "false");
    });
  }
});
