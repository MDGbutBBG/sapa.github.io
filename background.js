document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];
    
    // Configuration
    const config = {
        particleCount: 50,
        connectionDistance: 150,
        mouseDistance: 250,
        colors: [
            'rgba(30, 58, 138, ',  // Blue-900
            'rgba(59, 130, 246, ', // Blue-500
            'rgba(147, 197, 253, ' // Blue-300
        ]
    };

    let mouse = { x: null, y: null };

    // Resize handling
    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }

    window.addEventListener('resize', resize);
    resize();

    // Mouse interaction
    window.addEventListener('mousemove', (e) => {
        mouse.x = e.x;
        mouse.y = e.y;
    });

    window.addEventListener('mouseout', () => {
        mouse.x = null;
        mouse.y = null;
    });

    // Click interaction (Explosion)
    window.addEventListener('click', (e) => {
        const explosionCount = 15;
        for (let i = 0; i < explosionCount; i++) {
            particles.push(new Particle(e.x, e.y, true));
        }
    });

    // Particle Class
    class Particle {
        constructor(x, y, isExplosion = false) {
            this.isExplosion = isExplosion;
            
            // Position
            this.x = x !== undefined ? x : Math.random() * width;
            this.y = y !== undefined ? y : Math.random() * height;
            
            // Velocity
            const velocityMultiplier = isExplosion ? 4 : 0.8;
            this.vx = (Math.random() - 0.5) * velocityMultiplier;
            this.vy = (Math.random() - 0.5) * velocityMultiplier;
            
            // Appearance
            this.size = Math.random() * 2 + (isExplosion ? 2 : 1);
            
            // Color selection
            const colorBase = config.colors[Math.floor(Math.random() * config.colors.length)];
            // Increased opacity for better visibility: range 0.4 to 0.8 instead of 0.1 to 0.4
            const opacity = isExplosion ? 1 : (Math.random() * 0.4 + 0.4);
            this.colorBase = colorBase;
            this.opacity = opacity;
            
            // Life for explosion particles
            this.life = 1.0;
            this.decay = Math.random() * 0.02 + 0.01;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            // Explosion logic
            if (this.isExplosion) {
                this.life -= this.decay;
                this.opacity = this.life;
                this.x += this.vx * 0.5; // Drag effect
                this.y += this.vy * 0.5;
                if (this.life <= 0) return false; // Dead
            } else {
                // Background particle screen wrap/bounce
                if (this.x < 0 || this.x > width) this.vx *= -1;
                if (this.y < 0 || this.y > height) this.vy *= -1;

                // Mouse repulsion
                if (mouse.x != null) {
                    let dx = mouse.x - this.x;
                    let dy = mouse.y - this.y;
                    let distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < config.mouseDistance) {
                        const forceDirectionX = dx / distance;
                        const forceDirectionY = dy / distance;
                        const force = (config.mouseDistance - distance) / config.mouseDistance;
                        const directionX = forceDirectionX * force * 0.4;
                        const directionY = forceDirectionY * force * 0.4;

                        this.vx -= directionX;
                        this.vy -= directionY;
                    }
                }
            }
            return true; // Alive
        }

        draw() {
            ctx.fillStyle = this.colorBase + this.opacity + ')';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    // Initialize particles
    function init() {
        particles = [];
        for (let i = 0; i < config.particleCount; i++) {
            particles.push(new Particle());
        }
    }

    // Animation Loop
    function animate() {
        ctx.clearRect(0, 0, width, height);

        for (let i = 0; i < particles.length; i++) {
            const p1 = particles[i];
            const isAlive = p1.update();
            
            if (!isAlive) {
                particles.splice(i, 1);
                i--;
                continue;
            }
            
            p1.draw();

            // Connect background particles only
            if (!p1.isExplosion) {
                for (let j = i; j < particles.length; j++) {
                    const p2 = particles[j];
                    if (p2.isExplosion) continue;

                    let dx = p1.x - p2.x;
                    let dy = p1.y - p2.y;
                    let distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < config.connectionDistance) {
                        ctx.beginPath();
                        const alpha = (1 - distance / config.connectionDistance) * 0.15;
                        ctx.strokeStyle = `rgba(30, 58, 138, ${alpha})`;
                        ctx.lineWidth = 1;
                        ctx.moveTo(p1.x, p1.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.stroke();
                    }
                }
            }
        }
        requestAnimationFrame(animate);
    }

    init();
    animate();
});
