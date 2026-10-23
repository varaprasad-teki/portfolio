document.addEventListener("DOMContentLoaded", () => {
    /**
     * 1. HIGH-PERFORMANCE INTERSECTION OBSERVER
     * Replaces heavy scroll tracking for seamless navigation linking
     */
    const sections = document.querySelectorAll("section, header");
    const navLinks = document.querySelectorAll(".nav-links a");

    const observerOptions = {
        root: null,
        rootMargin: "-30% 0px -60% 0px",
        threshold: 0
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const currentId = entry.target.getAttribute("id");
                navLinks.forEach(link => {
                    link.classList.remove("active");
                    if (link.getAttribute("href") === `#${currentId}`) {
                        link.classList.add("active");
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => sectionObserver.observe(section));


    /**
     * 2. 3D SMOOTH CARD ROTATION ARCHITECTURE
     */
    const cards = document.querySelectorAll(".skill-card");
    cards.forEach(card => {
        card.addEventListener("mousemove", (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left - (rect.width / 2);
            const y = e.clientY - rect.top - (rect.height / 2);
            
            const tiltX = (y / (rect.height / 2)) * -8; 
            const tiltY = (x / (rect.width / 2)) * 8;

            card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(1.02)`;
        });

        card.addEventListener("mouseleave", () => {
            card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)";
        });
    });


    /**
     * 3. CYBERPUNK AMBIENT NEON CANVAS ENGINE
     * Renders floating pink and light-blue large light bursts smoothly
     */
    const canvas = document.getElementById("animation-canvas");
    if (canvas) {
        const ctx = canvas.getContext("2d");

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        resizeCanvas();
        window.addEventListener("resize", resizeCanvas);

        // Cyberpunk palette: Neon Pink/Magenta and Electric Cyan
        const colors = ["rgba(255, 0, 127, 0.08)", "rgba(0, 240, 255, 0.08)", "rgba(168, 85, 247, 0.05)"];
        const particles = [];
        const particleCount = 35; // Balanced particle payload for performance

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.radius = Math.random() * 100 + 50;
                this.color = colors[Math.floor(Math.random() * colors.length)];
                this.vx = (Math.random() - 0.5) * 0.5;
                this.vy = (Math.random() - 0.5) * 0.5;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                ctx.filter = "blur(50px)";
                ctx.fill();
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                if (this.x - this.radius > canvas.width) this.x = -this.radius;
                if (this.x + this.radius < 0) this.x = canvas.width + this.radius;
                if (this.y - this.radius > canvas.height) this.y = -this.radius;
                if (this.y + this.radius < 0) this.y = canvas.height + this.radius;
            }
        }

        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }

        function renderLoop() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(particle => {
                particle.update();
                particle.draw();
            });
            requestAnimationFrame(renderLoop);
        }
        renderLoop();
    }
});
