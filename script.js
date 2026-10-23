document.addEventListener("DOMContentLoaded", () => {
    /**
     * 1. HIGH-PERFORMANCE INTERSECTION OBSERVER
     * Replaces scroll event listening for smooth, fast navbar highlighting
     */
    const sections = document.querySelectorAll("section, header");
    const navLinks = document.querySelectorAll(".nav-links a");

    const observerOptions = {
        root: null, // Uses the browser viewport
        rootMargin: "-30% 0px -60% 0px", // Triggers right when the section enters active reading view
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
     * 2. ADVANCED 3D PARALLAX TILT EFFECT
     * Gives your skill cards an interactive depth tracking animation on mouse move
     */
    const cards = document.querySelectorAll(".skill-card");

    cards.forEach(card => {
        card.addEventListener("mousemove", (e) => {
            const rect = card.getBoundingClientRect();
            
            // Calculate mouse position relative to the center of the card
            const x = e.clientX - rect.left - (rect.width / 2);
            const y = e.clientY - rect.top - (rect.height / 2);
            
            // Convert to subtle angle degrees (divided to prevent wild spinning)
            const tiltX = (y / (rect.height / 2)) * -10; 
            const tiltY = (x / (rect.width / 2)) * 10;

            // Apply smooth 3D transformations
            card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(1.02)`;
        });

        // Reset the position perfectly when the mouse leaves the card
        card.addEventListener("mouseleave", () => {
            card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)";
        });
    });


    /**
     * 3. BACKGROUND CANVAS PARTICLES INFRASTRUCTURE
     * Handles your floating neon background bubbles
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

        const colors = ["rgba(59, 130, 246, 0.15)", "rgba(168, 85, 247, 0.12)", "rgba(37, 99, 235, 0.1)"];
        const particles = [];
        const particleCount = 45;

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.radius = Math.random() * 90 + 40;
                this.color = colors[Math.floor(Math.random() * colors.length)];
                this.vx = (Math.random() - 0.5) * 0.6;
                this.vy = (Math.random() - 0.5) * 0.6;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                ctx.filter = "blur(40px)";
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
