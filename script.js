document.addEventListener("DOMContentLoaded", () => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    /* 1. Footer year */
    const yearEl = document.getElementById("year");
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    /* 2. Mobile menu */
    const toggle = document.querySelector(".nav-toggle");
    const menu = document.getElementById("nav-menu");

    function setMenu(open) {
        menu.classList.toggle("open", open);
        toggle.setAttribute("aria-expanded", String(open));
        toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    }

    if (toggle && menu) {
        toggle.addEventListener("click", () => {
            setMenu(toggle.getAttribute("aria-expanded") !== "true");
        });
        menu.querySelectorAll("a").forEach(a => a.addEventListener("click", () => setMenu(false)));
        document.addEventListener("keydown", e => { if (e.key === "Escape") setMenu(false); });
        window.matchMedia("(min-width: 821px)").addEventListener("change", e => { if (e.matches) setMenu(false); });
    }

    /* 3. Active nav link on scroll */
    const sections = document.querySelectorAll("main section, main header");
    const navLinks = document.querySelectorAll(".nav-links a");

    const sectionObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const id = entry.target.id;
            navLinks.forEach(link => {
                link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
            });
        });
    }, { rootMargin: "-30% 0px -60% 0px", threshold: 0 });

    sections.forEach(s => sectionObserver.observe(s));

    /* 4. 3D card tilt (mouse devices only, skipped for reduced motion) */
    const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (canHover && !reduceMotion) {
        document.querySelectorAll(".skill-card").forEach(card => {
            card.addEventListener("mousemove", e => {
                const r = card.getBoundingClientRect();
                const x = e.clientX - r.left - r.width / 2;
                const y = e.clientY - r.top - r.height / 2;
                const tiltX = (y / (r.height / 2)) * -6;
                const tiltY = (x / (r.width / 2)) * 6;
                card.style.transform =
                    `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(1.02)`;
            });
            card.addEventListener("mouseleave", () => {
                card.style.transform = "";
            });
        });
    }

    /* 5. Ambient neon background (radial gradients, much lighter than blur filter) */
    const canvas = document.getElementById("animation-canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const palette = ["255,0,127", "0,240,255", "168,85,247"];
    const alphas = [0.16, 0.14, 0.12];
    let w = 0, h = 0, particles = [], rafId = null;

    function resize() {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        w = window.innerWidth;
        h = window.innerHeight;
        canvas.width = w * dpr;
        canvas.height = h * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        draw();
    }

    function createParticles() {
        const count = w < 600 ? 10 : w < 1100 ? 16 : 22;
        particles = Array.from({ length: count }, () => {
            const c = Math.floor(Math.random() * palette.length);
            return {
                x: Math.random() * w,
                y: Math.random() * h,
                r: Math.random() * 120 + 80,
                vx: (Math.random() - 0.5) * 0.4,
                vy: (Math.random() - 0.5) * 0.4,
                rgb: palette[c],
                a: alphas[c]
            };
        });
    }

    function draw() {
        ctx.clearRect(0, 0, w, h);
        for (const p of particles) {
            const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r);
            g.addColorStop(0, `rgba(${p.rgb},${p.a})`);
            g.addColorStop(1, `rgba(${p.rgb},0)`);
            ctx.fillStyle = g;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function step() {
        for (const p of particles) {
            p.x += p.vx;
            p.y += p.vy;
            if (p.x - p.r > w) p.x = -p.r;
            if (p.x + p.r < 0) p.x = w + p.r;
            if (p.y - p.r > h) p.y = -p.r;
            if (p.y + p.r < 0) p.y = h + p.r;
        }
        draw();
        rafId = requestAnimationFrame(step);
    }

    function start() { if (!rafId && !reduceMotion) rafId = requestAnimationFrame(step); }
    function stop()  { if (rafId) { cancelAnimationFrame(rafId); rafId = null; } }

    let resizeTimer;
    window.addEventListener("resize", () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => { resize(); createParticles(); draw(); }, 150);
    });

    // Pause when the tab is hidden to save battery
    document.addEventListener("visibilitychange", () => (document.hidden ? stop() : start()));

    resize();
    createParticles();
    draw();
    start();
});
