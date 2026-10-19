/* Blessed Stars Football Academy
   Site behaviour: menu, smooth anchors, form validation and WhatsApp submit. */

/* WhatsApp contact number. Digits only, include country code. Replace before going live. */
const WHATSAPP_NUMBER = "0000000000";

(function () {
  "use strict";

  /* ----- Mobile hamburger menu ----- */
  const hamburger = document.getElementById("hamburger");
  const nav = document.getElementById("nav");

  if (hamburger && nav) {
    const setMenu = (open) => {
      nav.classList.toggle("open", open);
      hamburger.classList.toggle("open", open);
      hamburger.setAttribute("aria-expanded", String(open));
    };

    hamburger.addEventListener("click", () => {
      setMenu(!nav.classList.contains("open"));
    });

    /* Close menu when any nav link is clicked */
    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => setMenu(false));
    });

    /* Close menu on outside click */
    document.addEventListener("click", (e) => {
      if (
        nav.classList.contains("open") &&
        !nav.contains(e.target) &&
        !hamburger.contains(e.target)
      ) {
        setMenu(false);
      }
    });

    /* Close on Escape */
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && nav.classList.contains("open")) {
        setMenu(false);
        hamburger.focus();
      }
    });
  }

  /* ----- Smooth scroll with offset for sticky header ----- */
  const headerH = 72;

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");
      if (!href || href.length < 2) return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const y = target.getBoundingClientRect().top + window.pageYOffset - headerH;
      window.scrollTo({ top: y, behavior: "smooth" });
    });
  });

  /* ----- Register form validation + WhatsApp prefill ----- */
  const form = document.getElementById("regForm");
  if (!form) return;

  const requiredFields = ["guardian", "player", "age", "group", "phone"];

  const setError = (id, on) => {
    const el = document.getElementById(id);
    if (!el) return;
    const field = el.closest(".field");
    if (field) field.classList.toggle("error", on);
  };

  const validPhone = (v) => /^[\d\s+()\-]{7,}$/.test(v);

  const validate = () => {
    let ok = true;

    requiredFields.forEach((id) => {
      const el = document.getElementById(id);
      const v = (el.value || "").trim();
      let fieldOk = v.length > 0;
      if (id === "age") fieldOk = v !== "" && +v >= 11 && +v <= 18;
      if (id === "phone") fieldOk = validPhone(v);
      setError(id, !fieldOk);
      if (!fieldOk) ok = false;
    });

    const consent = document.getElementById("consent");
    const consentOk = consent && consent.checked;
    if (consent && consent.closest(".field")) {
      consent.closest(".field").classList.toggle("error", !consentOk);
    }
    if (!consentOk) ok = false;

    return ok;
  };

  /* Clear error state on input */
  form.querySelectorAll("input, select, textarea").forEach((el) => {
    const clear = () => {
      const field = el.closest(".field");
      if (field) field.classList.remove("error");
    };
    el.addEventListener("input", clear);
    el.addEventListener("change", clear);
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!validate()) {
      /* Focus the first field in error */
      const firstErr = form.querySelector(".field.error input, .field.error select, .field.error textarea");
      if (firstErr) firstErr.focus();
      return;
    }

    const data = {
      guardian: document.getElementById("guardian").value.trim(),
      player: document.getElementById("player").value.trim(),
      age: document.getElementById("age").value.trim(),
      group: document.getElementById("group").value,
      phone: document.getElementById("phone").value.trim(),
      message: document.getElementById("message").value.trim(),
    };

    const lines = [
      "Blessed Stars Football Academy, new registration.",
      "Guardian: " + data.guardian,
      "Player: " + data.player,
      "Age: " + data.age,
      "Age group: " + data.group,
      "Phone: " + data.phone,
    ];
    if (data.message) lines.push("Message: " + data.message);

    const text = encodeURIComponent(lines.join("\n"));
    const url = "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + text;

    /* Open in new tab so the user can review the message */
    window.open(url, "_blank", "noopener");
  });
})();
