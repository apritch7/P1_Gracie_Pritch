(function () {
    'use strict';

    // Create starfield
    function createStars() {
        const layer = document.getElementById('starsLayer');
        if (!layer) return;

        const starCount = 150;
        const fragment = document.createDocumentFragment();

        for (let i = 0; i < starCount; i++) {
            const star = document.createElement('span');
            star.className = 'star';
            star.style.left = Math.random() * 100 + '%';
            star.style.top = Math.random() * 100 + '%';
            star.style.animationDelay = (Math.random() * 3) + 's';
            star.style.animationDuration = (1.5 + Math.random() * 2) + 's';
            fragment.appendChild(star);
        }

        layer.appendChild(fragment);
    }

    // Animate astronaut from bottom-left to top-right
    function runAstronautAnimation() {
        const container = document.getElementById('astronautContainer');
        if (!container) return;

        container.style.position = 'fixed';
        container.style.left = '-120px';
        container.style.bottom = '-120px';
        container.style.top = 'auto';

        const w = window.innerWidth;
        const h = window.innerHeight;
        const duration = 10000;
        let start = null;

        function step(timestamp) {
            if (!start) start = timestamp;
            const elapsed = timestamp - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 0.7);

            const x = -120 + (w + 120) * eased;
            const y = h + 120 - (h + 240) * eased;

            container.style.left = x + 'px';
            container.style.top = y + 'px';
            container.style.bottom = 'auto';

            if (progress < 1) {
                requestAnimationFrame(step);
            } else {
                setTimeout(() => {
                    start = null;
                    container.style.left = '-120px';
                    container.style.top = 'auto';
                    container.style.bottom = '-120px';
                    requestAnimationFrame(step);
                }, 3000);
            }
        }

        requestAnimationFrame(step);
    }

    // Init
    createStars();
    runAstronautAnimation();
})();
