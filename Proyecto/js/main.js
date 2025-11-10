// Navbar scroll effect
window.addEventListener('scroll', function () {
    const navbar = document.getElementById('mainNav');
    if (navbar) {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
});

// Crear partículas
const particlesContainer = document.getElementById('particles');
if (particlesContainer) {
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 20 + 's';
        particle.style.animationDuration = (Math.random() * 10 + 15) + 's';
        particlesContainer.appendChild(particle);
    }
}

// Smooth scroll solo para enlaces internos en la misma página
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && href.length > 1) {
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

// Animación de cubo
const cube = document.querySelector('.cube-3d');
if (cube) {
    let rotation = 0;
    setInterval(() => {
        rotation += 0.5;
        cube.style.transform = `translateX(-50%) rotateX(${45 + Math.sin(rotation * 0.01) * 10}deg) rotateY(${45 + rotation}deg)`;
    }, 50);
}

// Juego de pelota rodando por cuadros estilo Cartoon Network (solo en index.html)
const gameContainer = document.getElementById('gameContainer');
if (gameContainer) {
    const ball = document.createElement('div');
    ball.className = 'ball';
    gameContainer.appendChild(ball);

    // Variables del juego
    let ballX = window.innerWidth * 0.7;
    let ballY = 100;
    let ballSpeed = 3;
    let ballRotation = 0;
    const ballRadius = 17.5;
    const boxSize = 80;

    // Sistema de cuadros
    const boxes = [];
    let pathIndex = 0;

    function createBox(x, y) {
        const box = document.createElement('div');
        box.className = 'box appearing';
        box.style.left = x + 'px';
        box.style.top = y + 'px';
        gameContainer.appendChild(box);

        setTimeout(() => {
            box.classList.remove('appearing');
        }, 400);

        return {
            element: box,
            x: x,
            y: y,
            width: boxSize,
            height: boxSize,
            visited: false
        };
    }

    function removeBox(box) {
        if (box && box.element && box.element.parentNode) {
            box.element.classList.add('disappearing');
            setTimeout(() => {
                if (box.element.parentNode) {
                    box.element.remove();
                }
            }, 300);
        }
    }

    // Crear camino inicial de cuadros
    function initializePath() {
        let currentX = ballX - boxSize / 2;
        let currentY = ballY + 60;

        // Crear 3 cuadros iniciales
        for (let i = 0; i < 3; i++) {
            const box = createBox(currentX, currentY);
            boxes.push(box);

            // Decidir siguiente posición
            const direction = Math.random();
            if (direction < 0.4 && currentX > 100) {
                // Ir a la izquierda
                currentX -= boxSize;
            } else if (direction < 0.7 && currentX < window.innerWidth - boxSize - 100) {
                // Ir a la derecha
                currentX += boxSize;
            }
            // Siempre bajar
            currentY += boxSize;
        }
    }

    initializePath();

    function updateGame() {
        if (boxes.length === 0) return;

        // Obtener el cuadro objetivo actual
        const targetBox = boxes[pathIndex];

        if (!targetBox) {
            pathIndex = 0;
            return;
        }

        // Centro del cuadro objetivo
        const targetCenterX = targetBox.x + boxSize / 2;
        const targetCenterY = targetBox.y + boxSize / 2;

        // Calcular dirección hacia el centro del cuadro
        const dx = targetCenterX - ballX;
        const dy = targetCenterY - ballY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > 5) {
            // Mover hacia el centro del cuadro
            ballX += (dx / distance) * ballSpeed;
            ballY += (dy / distance) * ballSpeed;

            // Rotar la pelota
            ballRotation += ballSpeed * 3;
            ball.style.transform = `rotate(${ballRotation}deg)`;
        } else {
            // Llegó al centro del cuadro actual
            targetBox.visited = true;

            // Remover el cuadro anterior si existe
            if (pathIndex > 0) {
                removeBox(boxes[pathIndex - 1]);
            }

            // Avanzar al siguiente cuadro
            pathIndex++;

            // Si llegamos al último cuadro, crear uno nuevo
            if (pathIndex >= boxes.length - 1) {
                const lastBox = boxes[boxes.length - 1];
                let nextX = lastBox.x;
                let nextY = lastBox.y + boxSize;

                // Decidir dirección aleatoria
                const direction = Math.random();
                if (direction < 0.35 && nextX > 100) {
                    nextX -= boxSize;
                } else if (direction < 0.7 && nextX < window.innerWidth - boxSize - 100) {
                    nextX += boxSize;
                }

                const newBox = createBox(nextX, nextY);
                boxes.push(newBox);
            }
        }

        // Resetear si la pelota sale de la pantalla
        if (ballY > window.innerHeight + 100) {
            // Limpiar todos los cuadros
            boxes.forEach(box => {
                if (box.element && box.element.parentNode) {
                    box.element.remove();
                }
            });
            boxes.length = 0;

            // Resetear posición
            ballY = 100;
            ballX = window.innerWidth * 0.7;
            ballRotation = 0;
            pathIndex = 0;

            // Recrear camino
            initializePath();
        }

        // Actualizar posición visual
        ball.style.left = (ballX - ballRadius) + 'px';
        ball.style.top = (ballY - ballRadius) + 'px';

        requestAnimationFrame(updateGame);
    }

    // Iniciar el juego después de un pequeño delay
    setTimeout(() => {
        updateGame();
    }, 100);
}

// Inicializar tooltips de Bootstrap
document.addEventListener('DOMContentLoaded', function() {
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
});

// ============================================
// SISTEMA DE ANIMACIONES DE ENTRADA
// ============================================

// Intersection Observer para animaciones de entrada
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const animationObserver = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
            // Para evitar que se repita la animación, desconectamos el observer de ese elemento
            animationObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observar elementos con clases de animación generales
document.addEventListener('DOMContentLoaded', function() {
    const animatedElements = document.querySelectorAll('.fade-in-up, .slide-in-left, .slide-in-right, .scale-in, .rotate-in');
    animatedElements.forEach(el => {
        animationObserver.observe(el);
    });
});
(function() {
    'use strict';
    const form = document.getElementById('contactForm');
    
    form.addEventListener('submit', function(event) {
        if (!form.checkValidity()) {
            event.preventDefault();
            event.stopPropagation();
        } else {
            event.preventDefault();
            // Simulación de envío exitoso
            alert('¡Mensaje enviado con éxito! Te contactaré pronto.');
            form.reset();
            form.classList.remove('was-validated');
        }
        
        form.classList.add('was-validated');
    }, false);
})();