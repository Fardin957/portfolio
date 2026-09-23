(function () {
  "use strict";

  const config = window.PORTFOLIO_CONFIG || {};

  /* ---- Theme switcher ---- */
  (function initThemeSwitcher() {
    var THEMES = ["dark", "light", "warm"];
    var dots = Array.prototype.slice.call(
      document.querySelectorAll("[data-set-theme]")
    );
    if (!dots.length) return;

    function applyTheme(theme, persist) {
      if (THEMES.indexOf(theme) === -1) theme = "light";
      document.documentElement.setAttribute("data-theme", theme);
      if (persist !== false) {
        try {
          localStorage.setItem("theme", theme);
        } catch (e) {}
      }
      dots.forEach(function (dot) {
        var on = dot.getAttribute("data-set-theme") === theme;
        dot.classList.toggle("is-active", on);
        dot.setAttribute("aria-checked", on ? "true" : "false");
        dot.tabIndex = on ? 0 : -1;
      });
    }

    var current = document.documentElement.getAttribute("data-theme") || "light";
    applyTheme(current, false);

    dots.forEach(function (dot) {
      dot.addEventListener("click", function () {
        applyTheme(dot.getAttribute("data-set-theme"), true);
      });
      dot.addEventListener("keydown", function (event) {
        var idx = THEMES.indexOf(dot.getAttribute("data-set-theme"));
        var next = idx;
        if (event.key === "ArrowDown" || event.key === "ArrowRight") {
          next = (idx + 1) % THEMES.length;
        } else if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
          next = (idx - 1 + THEMES.length) % THEMES.length;
        } else if (event.key === "Home") {
          next = 0;
        } else if (event.key === "End") {
          next = THEMES.length - 1;
        } else {
          return;
        }
        event.preventDefault();
        applyTheme(THEMES[next], true);
        var target = document.querySelector(
          '[data-set-theme="' + THEMES[next] + '"]'
        );
        if (target) target.focus();
      });
    });
  })();

  /* ---- Year ---- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ---- Apply social / contact links from config ---- */
  function setHref(id, url, fallback) {
    const el = document.getElementById(id);
    if (!el) return;
    const href = url && url !== "#" ? url : fallback || "#";
    el.setAttribute("href", href);
    if (!href || href === "#") {
      el.setAttribute("aria-disabled", "true");
      el.addEventListener("click", function (e) {
        if (href === "#") e.preventDefault();
      });
    }
  }

  setHref("social-facebook", config.FACEBOOK_URL, "#");
  setHref("social-linkedin", config.LINKEDIN_URL, "https://www.linkedin.com/in/fardin-faruk-6341a4392/");
  setHref("social-github", config.GITHUB_URL, "https://github.com/Fardin957");

  const emailEl = document.getElementById("contact-email");
  if (emailEl && config.EMAIL) {
    emailEl.href = "mailto:" + config.EMAIL;
    emailEl.textContent = config.EMAIL;
  }

  const phoneEl = document.getElementById("contact-phone");
  if (phoneEl && config.PHONE) phoneEl.textContent = config.PHONE;

  /* ---- Hero typewriter ---- */
  (function initTypewriter() {
    var el = document.getElementById("typewriter-text");
    var cursor = document.querySelector(".typewriter-cursor");
    if (!el) return;

    var roles = [
      "Jr. SQA Engineer",
      "Test Automation Engineer",
      "AI-Assisted QA Engineer",
    ];

    var reduceMotion =
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduceMotion) {
      el.textContent = roles[0];
      if (cursor) cursor.classList.add("is-hidden");
      return;
    }

    var roleIndex = 0;
    var charIndex = 0;
    var deleting = false;
    var pauseUntil = 0;

    function setCursorVisible(visible) {
      if (!cursor) return;
      cursor.classList.toggle("is-hidden", !visible);
    }

    function tick() {
      var now = Date.now();
      if (now < pauseUntil) {
        window.setTimeout(tick, 60);
        return;
      }

      var current = roles[roleIndex];

      if (!deleting) {
        setCursorVisible(true);
        charIndex += 1;
        el.textContent = current.slice(0, charIndex);
        if (charIndex >= current.length) {
          // Word complete — hide blinking cursor during pause
          setCursorVisible(false);
          deleting = true;
          pauseUntil = now + 2000;
          window.setTimeout(tick, 60);
          return;
        }
        window.setTimeout(tick, 70);
        return;
      }

      setCursorVisible(true);
      charIndex -= 1;
      el.textContent = current.slice(0, Math.max(0, charIndex));
      if (charIndex <= 0) {
        setCursorVisible(false);
        deleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        pauseUntil = now + 350;
        window.setTimeout(tick, 60);
        return;
      }
      window.setTimeout(tick, 40);
    }

    setCursorVisible(true);
    tick();
  })();

  /* ---- Sticky header state ---- */
  const header = document.getElementById("site-header");
  function updateHeader() {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 12);
  }
  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  /* ---- Mobile nav ---- */
  const toggle = document.getElementById("menu-toggle");
  const mobileNav = document.getElementById("mobile-nav");
  const iconOpen = document.getElementById("icon-open");
  const iconClose = document.getElementById("icon-close");

  function setMenuOpen(open) {
    if (!mobileNav || !toggle) return;
    mobileNav.classList.toggle("hidden", !open);
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    if (iconOpen) iconOpen.classList.toggle("hidden", open);
    if (iconClose) iconClose.classList.toggle("hidden", !open);
  }

  if (toggle) {
    toggle.addEventListener("click", function () {
      const open = toggle.getAttribute("aria-expanded") !== "true";
      setMenuOpen(open);
    });
  }

  document.querySelectorAll("#mobile-nav a").forEach(function (link) {
    link.addEventListener("click", function () {
      setMenuOpen(false);
    });
  });

  /* ---- Active nav link on scroll ---- */
  const sections = ["home", "about", "skills", "qa-projects", "automation", "blog", "research", "contact"]
    .map(function (id) {
      return document.getElementById(id);
    })
    .filter(Boolean);

  const navLinks = document.querySelectorAll(".nav-link");
  const headerOffset = 80;

  function setActiveNav(currentId) {
    navLinks.forEach(function (link) {
      const href = link.getAttribute("href") || "";
      link.classList.toggle("is-active", href === "#" + currentId);
    });
  }

  function updateActiveNav() {
    if (!sections.length) return;

    // Pick the section that currently contains the line just under the fixed header.
    // This correctly activates short sections (e.g. Blog) instead of leaving the previous one active.
    const probe = headerOffset + 8;
    let current = sections[0].id;

    for (let i = 0; i < sections.length; i++) {
      const rect = sections[i].getBoundingClientRect();
      if (rect.top <= probe && rect.bottom > probe) {
        current = sections[i].id;
      }
    }

    setActiveNav(current);
  }

  navLinks.forEach(function (link) {
    link.addEventListener("click", function () {
      const href = link.getAttribute("href") || "";
      if (href.charAt(0) === "#") {
        setActiveNav(href.slice(1));
      }
    });
  });

  updateActiveNav();
  window.addEventListener("scroll", updateActiveNav, { passive: true });
  window.addEventListener("hashchange", updateActiveNav);
  window.addEventListener("resize", updateActiveNav);

  /* ---- Reveal on scroll ---- */
  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach(function (el) {
      io.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  /* ---- Contact form → Google Sheets ---- */
  const form = document.getElementById("contact-form");
  const statusEl = document.getElementById("form-status");
  const submitBtn = document.getElementById("submit-btn");
  let statusHideTimer = null;

  function setStatus(message, type) {
    if (!statusEl) return;
    if (statusHideTimer) {
      clearTimeout(statusHideTimer);
      statusHideTimer = null;
    }
    statusEl.textContent = message;
    statusEl.classList.remove("is-success", "is-error");
    if (type) statusEl.classList.add(type === "success" ? "is-success" : "is-error");

    if (message) {
      statusHideTimer = setTimeout(function () {
        statusEl.textContent = "";
        statusEl.classList.remove("is-success", "is-error");
        statusHideTimer = null;
      }, type === "success" ? 5000 : 7000);
    }
  }

  function validateEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  function clearInvalid() {
    if (!form) return;
    form.querySelectorAll(".is-invalid").forEach(function (el) {
      el.classList.remove("is-invalid");
    });
  }

  /** FormData POST (primary) + hidden iframe form (fallback) */
  function postToGoogleScript(url, fields) {
    var fd = new FormData();
    Object.keys(fields).forEach(function (key) {
      fd.append(key, fields[key]);
    });

    return fetch(url, {
      method: "POST",
      body: fd,
      mode: "no-cors",
      redirect: "follow",
    }).catch(function () {
      return new Promise(function (resolve) {
        var iframeName = "gas-frame-" + Date.now();
        var iframe = document.createElement("iframe");
        iframe.name = iframeName;
        iframe.setAttribute("aria-hidden", "true");
        iframe.style.cssText = "display:none;width:0;height:0;border:0;";
        document.body.appendChild(iframe);

        var tempForm = document.createElement("form");
        tempForm.method = "POST";
        tempForm.action = url;
        tempForm.target = iframeName;
        tempForm.style.display = "none";

        Object.keys(fields).forEach(function (key) {
          var input = document.createElement("input");
          input.type = "hidden";
          input.name = key;
          input.value = fields[key];
          tempForm.appendChild(input);
        });

        document.body.appendChild(tempForm);
        tempForm.submit();

        setTimeout(function () {
          if (tempForm.parentNode) tempForm.parentNode.removeChild(tempForm);
          if (iframe.parentNode) iframe.parentNode.removeChild(iframe);
          resolve();
        }, 2000);
      });
    });
  }

  if (form) {
    form.addEventListener("submit", async function (event) {
      event.preventDefault();
      clearInvalid();
      setStatus("", null);

      if (window.location.protocol === "file:") {
        setStatus(
          "Do not open as a file. Run: python3 -m http.server 8080 then visit http://localhost:8080",
          "error"
        );
        return;
      }

      const name = (form.name.value || "").trim();
      const mobile = (form.mobile.value || "").trim();
      const email = (form.email.value || "").trim();
      const message = (form.message.value || "").trim();

      let valid = true;
      if (!name) {
        form.name.classList.add("is-invalid");
        valid = false;
      }
      if (!mobile) {
        form.mobile.classList.add("is-invalid");
        valid = false;
      }
      if (!email || !validateEmail(email)) {
        form.email.classList.add("is-invalid");
        valid = false;
      }
      if (!message) {
        form.message.classList.add("is-invalid");
        valid = false;
      }

      if (!valid) {
        setStatus("Please fill in all fields with a valid email.", "error");
        return;
      }

      const scriptUrl = (config.GOOGLE_SCRIPT_URL || "").trim();
      if (!scriptUrl || scriptUrl.indexOf("script.google.com") === -1) {
        setStatus(
          "Form is not connected yet. Add your Google Apps Script Web App URL in js/config.js.",
          "error"
        );
        return;
      }

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = "Sending…";
      }

      try {
        await postToGoogleScript(scriptUrl, {
          name: name,
          mobile: mobile,
          email: email,
          message: message,
        });

        form.reset();
        setStatus(
          "Thank you — your message was sent successfully.",
          "success"
        );
      } catch (err) {
        setStatus("Something went wrong. Please try again or email me directly.", "error");
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = "Send Message";
        }
      }
    });
  }
})();
