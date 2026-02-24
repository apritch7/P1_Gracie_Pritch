(function () {
    'use strict';

    const paper = document.getElementById('paper');
    const hint = document.getElementById('hint');

    if (!paper) return;

    let step = 0;
    const maxStep = 4;
    const hints = [
        'Click the paper to fold it into an airplane',
        'Fold in half...',
        'Fold the corners...',
        'Almost there...',
        'Click the airplane to fly!'
    ];

    const workspace = paper.closest('.workspace');
    const tryAgainBtn = document.getElementById('tryAgainBtn');
    const airplane = paper.querySelector('.paper-airplane');

    function advanceStep() {
        if (step >= maxStep) return;

        step++;
        paper.classList.remove('step-0', 'step-1', 'step-2', 'step-3', 'step-4', 'flying');
        paper.classList.add('step-' + step);

        if (hint && hints[step]) {
            hint.textContent = hints[step];
        }
        if (step === maxStep && workspace) {
            workspace.classList.add('done');
        }
    }

    function flyAway() {
        if (step !== maxStep) return;
        paper.classList.add('flying');
        if (workspace) workspace.classList.add('flying');
    }

    function showTryAgain() {
        if (workspace) workspace.classList.add('flew');
    }

    function tryAgain() {
        step = 0;
        paper.classList.remove('step-1', 'step-2', 'step-3', 'step-4', 'flying');
        paper.classList.add('step-0');
        if (workspace) {
            workspace.classList.remove('done', 'flying', 'flew');
        }
        if (hint) hint.textContent = hints[0];
    }

    if (airplane) {
        airplane.addEventListener('animationend', showTryAgain);
    }
    if (tryAgainBtn) {
        tryAgainBtn.addEventListener('click', tryAgain);
    }

    paper.addEventListener('click', function (e) {
        if (step < maxStep) {
            advanceStep();
        } else {
            flyAway();
        }
    });
    paper.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            advanceStep();
        }
    });
})();
