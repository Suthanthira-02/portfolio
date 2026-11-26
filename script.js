/* ==========================================================
   Suthanthira A | Portfolio scripts
   1. Day / night theme   2. Mobile menu   3. Typing effect
   4. Scroll reveal       5. Active nav link  6. Back to top
   7. Contact form (EmailJS)
   ========================================================== */

(function () {
    "use strict";

    var root = document.documentElement;
    var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    /* ---------- 1. Day / night theme ---------- */

    var themeBtn = document.getElementById("theme-toggle");

    function updateThemeButton() {
        var isLight = root.getAttribute("data-theme") === "light";
        themeBtn.setAttribute("aria-label", isLight ? "Switch to dark theme" : "Switch to light theme");
        var meta = document.querySelector('meta[name="theme-color"]');
        if (meta) meta.setAttribute("content", isLight ? "#f8fafc" : "#0a0f1f");
    }

    themeBtn.addEventListener("click", function () {
        var next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
        root.setAttribute("data-theme", next);
        try { localStorage.setItem("theme", next); } catch (e) { }
        updateThemeButton();
    });

    updateThemeButton();

    /* ---------- 2. Mobile menu ---------- */

    var menuBtn = document.getElementById("menu-toggle");
    var navLinks = document.getElementById("nav-links");

    function setMenu(open) {
        navLinks.classList.toggle("open", open);
        menuBtn.setAttribute("aria-expanded", String(open));
        menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
        menuBtn.firstElementChild.className = open ? "fa-solid fa-xmark" : "fa-solid fa-bars";
    }

    menuBtn.addEventListener("click", function () {
        setMenu(!navLinks.classList.contains("open"));
    });

    navLinks.addEventListener("click", function (e) {
        if (e.target.classList.contains("nav-link")) setMenu(false);
    });

    document.addEventListener("keydown", function (e) {
        if (e.key === "Escape") setMenu(false);
    });

    /* ---------- 3. Typing effect ---------- */

    var typedEl = document.getElementById("typed");
    var roles = [
        "Full Stack Developer (MERN)",
        "Software Tester / QA",
        "API Testing with Postman",
        "Java & OOP Enthusiast"
    ];

    if (reduceMotion) {
        typedEl.textContent = roles[0];
    } else {
        var roleIndex = 0, charIndex = 0, deleting = false;

        (function type() {
            var current = roles[roleIndex];
            typedEl.textContent = current.substring(0, charIndex);

            var delay = deleting ? 40 : 85;

            if (!deleting && charIndex === current.length) {
                deleting = true;
                delay = 1600;
            } else if (deleting && charIndex === 0) {
                deleting = false;
                roleIndex = (roleIndex + 1) % roles.length;
                delay = 350;
            } else {
                charIndex += deleting ? -1 : 1;
            }

            setTimeout(type, delay);
        })();
    }

    /* ---------- 4. Scroll reveal ---------- */

    var revealEls = document.querySelectorAll(".reveal");

    if ("IntersectionObserver" in window && !reduceMotion) {
        var revealObserver = new IntersectionObserver(function (entries, obs) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12 });

        revealEls.forEach(function (el) { revealObserver.observe(el); });
    } else {
        revealEls.forEach(function (el) { el.classList.add("visible"); });
    }

    /* ---------- 5. Active nav link + navbar shadow ---------- */

    var sections = document.querySelectorAll("main section[id]");
    var links = document.querySelectorAll(".nav-link");
    var navbar = document.getElementById("navbar");
    var toTop = document.getElementById("to-top");

    function onScroll() {
        var y = window.scrollY;

        navbar.classList.toggle("scrolled", y > 10);
        toTop.classList.toggle("show", y > 500);

        var current = "home";
        sections.forEach(function (sec) {
            if (y >= sec.offsetTop - 140) current = sec.id;
        });

        links.forEach(function (a) {
            a.classList.toggle("active", a.getAttribute("href") === "#" + current);
        });
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    /* ---------- 6. Back to top ---------- */

    toTop.addEventListener("click", function () {
        window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
    });

    document.getElementById("year").textContent = new Date().getFullYear();

    /* ---------- 7. Contact form (EmailJS) ---------- */

    var form = document.getElementById("contactForm");
    var sendBtn = document.getElementById("sendBtn");
    var statusEl = document.getElementById("formStatus");

    function setStatus(message, type) {
        statusEl.textContent = message;
        statusEl.className = "form-status" + (type ? " " + type : "");
    }

    if (window.emailjs) {
        emailjs.init("dMueNV-0iFGvsDqM7");
    }

    form.addEventListener("submit", function (e) {
        e.preventDefault();

        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        if (!window.emailjs) {
            setStatus("The email service could not load. Please email me directly instead.", "err");
            return;
        }

        sendBtn.disabled = true;
        sendBtn.textContent = "Sending...";
        setStatus("", "");

        emailjs.sendForm("service_j215fom", "template_10fb1i5", form)
            .then(function () {
                setStatus("Message sent successfully. Thank you, I'll get back to you soon!", "ok");
                form.reset();
            })
            .catch(function () {
                setStatus("Sorry, the message could not be sent. Please try again or email me directly.", "err");
            })
            .finally(function () {
                sendBtn.disabled = false;
                sendBtn.textContent = "Send Message";
            });
    });
})();
