/* ============================================================
   Sterling & Vale Advisory — script.js
   Vanilla JS only. No dependencies.

   FORMSUBMIT ACTIVATION NOTE
   --------------------------
   The enquiry form posts to FormSubmit's AJAX endpoint. FormSubmit
   requires a ONE-TIME activation: the very first submission to a new
   email address triggers a confirmation email. The form will only
   deliver messages AFTER you click the activation link in that email.
   Replace the placeholder address below with your own first.
   ============================================================ */

// Destination email for enquiries (change here if it ever moves):
const FORMSUBMIT_EMAIL = "jolly.chan@redbeaconam.com";
const FORMSUBMIT_ENDPOINT = "https://formsubmit.co/ajax/" + FORMSUBMIT_EMAIL;

const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

/* --------------------------------------------------------------
   1. Footer year (auto-updates)
   -------------------------------------------------------------- */
(function setYear() {
  const el = document.getElementById("year");
  if (el) el.textContent = new Date().getFullYear();
})();

/* --------------------------------------------------------------
   2. Sticky-header shadow on scroll
   -------------------------------------------------------------- */
(function headerShadow() {
  const header = document.querySelector(".site-header");
  if (!header) return;
  const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 8);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
})();

/* --------------------------------------------------------------
   3. Mobile nav toggle + close on link click
   -------------------------------------------------------------- */
(function mobileNav() {
  const toggle = document.getElementById("navToggle");
  const menu = document.getElementById("navMenu");
  if (!toggle || !menu) return;

  const close = () => {
    menu.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open navigation menu");
  };
  const open = () => {
    menu.classList.add("open");
    toggle.setAttribute("aria-expanded", "true");
    toggle.setAttribute("aria-label", "Close navigation menu");
  };

  toggle.addEventListener("click", () => {
    const isOpen = menu.classList.contains("open");
    isOpen ? close() : open();
  });

  // Close the menu after choosing a destination (mobile).
  menu.addEventListener("click", (e) => {
    if (e.target.closest("a")) close();
  });

  // Close on Escape for keyboard users.
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") close();
  });
})();

/* --------------------------------------------------------------
   4. Scroll-in reveal animations (IntersectionObserver)
   -------------------------------------------------------------- */
(function revealOnScroll() {
  const items = document.querySelectorAll(".reveal");
  if (!items.length) return;

  // No IO support or reduced motion: just show everything.
  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    items.forEach((el) => el.classList.add("visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
  );

  items.forEach((el) => observer.observe(el));
})();

/* --------------------------------------------------------------
   5. Testimonials carousel (auto-rotate + prev/next + dots)
   -------------------------------------------------------------- */
(function carousel() {
  const root = document.getElementById("carousel");
  if (!root) return;

  const slides = Array.from(root.querySelectorAll("[data-slide]"));
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  const dotsWrap = document.getElementById("dots");
  if (slides.length === 0) return;

  let index = 0;
  let timer = null;
  const INTERVAL = 6000;

  // Build dots dynamically so markup stays lean.
  const dots = slides.map((_, i) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.className = "dot" + (i === 0 ? " is-active" : "");
    dot.setAttribute("role", "tab");
    dot.setAttribute("aria-label", "Show testimonial " + (i + 1));
    dot.setAttribute("aria-selected", i === 0 ? "true" : "false");
    dot.addEventListener("click", () => {
      goTo(i);
      restart();
    });
    dotsWrap.appendChild(dot);
    return dot;
  });

  function goTo(next) {
    index = (next + slides.length) % slides.length;
    slides.forEach((slide, i) => {
      const active = i === index;
      slide.classList.toggle("is-active", active);
      slide.hidden = !active;
      dots[i].classList.toggle("is-active", active);
      dots[i].setAttribute("aria-selected", active ? "true" : "false");
    });
  }

  function start() {
    if (prefersReducedMotion) return; // honour reduced-motion: no auto-rotate
    stop();
    timer = window.setInterval(() => goTo(index + 1), INTERVAL);
  }
  function stop() {
    if (timer) window.clearInterval(timer);
    timer = null;
  }
  function restart() {
    stop();
    start();
  }

  nextBtn?.addEventListener("click", () => {
    goTo(index + 1);
    restart();
  });
  prevBtn?.addEventListener("click", () => {
    goTo(index - 1);
    restart();
  });

  // Pause on hover / keyboard focus.
  root.addEventListener("mouseenter", stop);
  root.addEventListener("mouseleave", start);
  root.addEventListener("focusin", stop);
  root.addEventListener("focusout", start);

  goTo(0);
  start();
})();

/* --------------------------------------------------------------
   6. Enquiry form: validation + FormSubmit AJAX submit
   -------------------------------------------------------------- */
(function enquiryForm() {
  const form = document.getElementById("enquiryForm");
  if (!form) return;

  const submitBtn = document.getElementById("submitBtn");
  const status = document.getElementById("formStatus");
  const success = document.getElementById("formSuccess");
  const honey = form.querySelector(".honey");

  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Helpers to set/clear per-field errors.
  function setError(id, message) {
    const input = document.getElementById(id);
    const errEl = document.getElementById(id + "-error");
    if (errEl) errEl.textContent = message;
    if (input) input.setAttribute("aria-invalid", message ? "true" : "false");
  }
  function clearErrors() {
    ["name", "email", "phone", "message"].forEach((id) => setError(id, ""));
    status.textContent = "";
    status.classList.remove("is-error");
  }

  function validate() {
    let ok = true;
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();

    if (!name) {
      setError("name", "Please enter your full name.");
      ok = false;
    }
    if (!email) {
      setError("email", "Please enter your email address.");
      ok = false;
    } else if (!EMAIL_RE.test(email)) {
      setError("email", "Please enter a valid email address.");
      ok = false;
    }
    if (!message) {
      setError("message", "Please add a short message.");
      ok = false;
    }
    return ok;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    clearErrors();

    // Honeypot tripped → silently treat as success (don't tip off bots).
    if (honey && honey.value) {
      form.hidden = true;
      success.hidden = false;
      return;
    }

    if (!validate()) {
      // Move focus to the first invalid field for accessibility.
      const firstInvalid = form.querySelector('[aria-invalid="true"]');
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    const payload = {
      name: form.name.value.trim(),
      email: form.email.value.trim(),
      phone: form.phone.value.trim(),
      interest: form.interest.value,
      message: form.message.value.trim(),
      _subject: "New free-review request from Sterling & Vale website",
      _template: "table",
      _captcha: "false",
    };

    // Sending state.
    submitBtn.disabled = true;
    const originalLabel = submitBtn.textContent;
    submitBtn.textContent = "Sending…";

    try {
      const res = await fetch(FORMSUBMIT_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Request failed with status " + res.status);

      // FormSubmit returns { success: "true", ... } on success.
      const data = await res.json().catch(() => ({}));
      if (data && (data.success === "true" || data.success === true)) {
        form.reset();
        form.hidden = true;
        success.hidden = false;
        success.focus?.();
      } else {
        throw new Error(data.message || "Submission was not accepted.");
      }
    } catch (err) {
      status.textContent =
        "Sorry — something went wrong sending your enquiry. Please try again, or email us directly.";
      status.classList.add("is-error");
      submitBtn.disabled = false;
      submitBtn.textContent = originalLabel;
      // eslint-disable-next-line no-console
      console.warn("Enquiry submission error:", err.message);
    }
  });

  // Clear a field's error as the user corrects it.
  ["name", "email", "message"].forEach((id) => {
    const input = document.getElementById(id);
    input?.addEventListener("input", () => setError(id, ""));
  });
})();

/* --------------------------------------------------------------
   7. Animated count-up for the hero trust stats
   -------------------------------------------------------------- */
(function countUp() {
  const nums = Array.from(document.querySelectorAll("[data-count]"));
  if (!nums.length) return;

  const render = (el, value) => {
    const prefix = el.dataset.prefix || "";
    const suffix = el.dataset.suffix || "";
    el.textContent = prefix + value + suffix;
  };

  // Reduced motion or no IO support: show final values immediately.
  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    nums.forEach((el) => render(el, parseInt(el.dataset.count, 10)));
    return;
  }

  const animate = (el) => {
    const target = parseInt(el.dataset.count, 10) || 0;
    const duration = 1400;
    let startTime = null;

    const step = (now) => {
      if (startTime === null) startTime = now;
      const progress = Math.min((now - startTime) / duration, 1);
      // easeOutCubic for a settling finish
      const eased = 1 - Math.pow(1 - progress, 3);
      render(el, Math.round(target * eased));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animate(entry.target);
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.6 }
  );

  nums.forEach((el) => {
    render(el, 0); // start from zero before it scrolls into view
    observer.observe(el);
  });
})();

/* --------------------------------------------------------------
   8. WhatsApp chat widget (launcher + suggested queries)
   -------------------------------------------------------------- */
// Destination WhatsApp number, international format, digits only (change here):
const WHATSAPP_NUMBER = "6589669839";

(function whatsappWidget() {
  const widget = document.getElementById("waWidget");
  const launcher = document.getElementById("waLauncher");
  const panel = document.getElementById("waPanel");
  const closeBtn = document.getElementById("waClose");
  const suggestions = document.getElementById("waSuggestions");
  if (!widget || !launcher || !panel) return;

  const open = () => {
    panel.hidden = false;
    // next frame so the unhidden panel can transition in
    requestAnimationFrame(() => widget.classList.add("is-open"));
    launcher.setAttribute("aria-expanded", "true");
    launcher.setAttribute("aria-label", "Close chat");
  };
  const close = () => {
    widget.classList.remove("is-open");
    launcher.setAttribute("aria-expanded", "false");
    launcher.setAttribute("aria-label", "Chat with us on WhatsApp");
    // hide after the close transition so it leaves the tab order
    const hide = () => { panel.hidden = true; };
    if (prefersReducedMotion) hide();
    else panel.addEventListener("transitionend", hide, { once: true });
  };
  const toggle = () =>
    widget.classList.contains("is-open") ? close() : open();

  launcher.addEventListener("click", toggle);
  closeBtn?.addEventListener("click", close);

  // Each suggestion opens WhatsApp with its query pre-filled.
  suggestions?.addEventListener("click", (e) => {
    const chip = e.target.closest(".wa-chip");
    if (!chip) return;
    const text = chip.dataset.query || "";
    const url =
      "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(text);
    window.open(url, "_blank", "noopener");
    close();
  });

  // Close on Escape for keyboard users.
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && widget.classList.contains("is-open")) {
      close();
      launcher.focus();
    }
  });

  // Close when clicking outside the widget.
  document.addEventListener("click", (e) => {
    if (widget.classList.contains("is-open") && !widget.contains(e.target)) {
      close();
    }
  });
})();
