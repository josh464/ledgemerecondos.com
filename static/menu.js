// Mobile menu toggle and drop-down submenus. Without JavaScript the menu is shown expanded.
// The submenu buttons report their real state (aria-expanded) whether a menu was opened by click, hover or keyboard focus.
(function () {
  document.documentElement.classList.add("js");
  var mq = window.matchMedia("(max-width: 899.98px)");
  var toggle = document.querySelector(".nav-toggle");
  var subs = Array.prototype.slice.call(document.querySelectorAll(".has-sub"));
  var pinned = null, hovered = null, focused = null, dismissed = null;

  function sub(node) { return node && node.closest ? node.closest(".has-sub") : null; }
  function isOpen(li) { return !mq.matches && li !== dismissed && (li === pinned || li === hovered || li === focused); }

  function refresh() {
    if (dismissed && dismissed !== hovered && dismissed !== focused) dismissed = null;
    subs.forEach(function (li) {
      var btn = li.firstElementChild;
      li.classList.toggle("is-dismissed", li === dismissed);
      if (mq.matches) {
        // On a narrow screen every submenu is already listed, so its heading is not a control.
        btn.setAttribute("aria-expanded", "true");
        btn.tabIndex = -1;
      } else {
        btn.removeAttribute("tabindex");
        btn.setAttribute("aria-expanded", isOpen(li) ? "true" : "false");
      }
    });
  }

  function closeMobileMenu() {
    if (toggle && toggle.getAttribute("aria-expanded") === "true") {
      toggle.setAttribute("aria-expanded", "false");
      document.body.classList.remove("menu-open");
      return true;
    }
    return false;
  }

  document.addEventListener("click", function (e) {
    var t = e.target.closest(".nav-toggle");
    if (t) {
      var open = t.getAttribute("aria-expanded") !== "true";
      t.setAttribute("aria-expanded", open ? "true" : "false");
      document.body.classList.toggle("menu-open", open);
      return;
    }
    var btn = e.target.closest(".has-sub > button");
    if (btn) {
      var li = btn.parentNode;
      pinned = pinned === li ? null : li;
      if (dismissed === li) dismissed = null;
    } else {
      pinned = null;
    }
    refresh();
  });
  function setHovered(next) {
    if (next !== hovered && next === dismissed) dismissed = null; // pointer came back after Escape: open again
    hovered = next;
    refresh();
  }
  document.addEventListener("mouseover", function (e) { setHovered(sub(e.target)); });
  document.addEventListener("mouseout", function (e) { setHovered(sub(e.relatedTarget)); });
  document.addEventListener("focusin", function (e) { focused = sub(e.target); refresh(); });
  document.addEventListener("focusout", function (e) { focused = sub(e.relatedTarget); refresh(); });
  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") return;
    var open = subs.filter(isOpen)[0];
    if (open) {
      dismissed = open;
      pinned = null;
      if (open.contains(document.activeElement)) open.firstElementChild.focus();
    } else if (closeMobileMenu() && toggle) {
      toggle.focus();
    }
    refresh();
  });
  if (mq.addEventListener) mq.addEventListener("change", refresh); else mq.addListener(refresh);
  refresh();
})();
