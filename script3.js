/**
 * Room - Drawers and lamp
 * Click drawers to open/close. Click lamp to toggle on/off.
 */

document.addEventListener('DOMContentLoaded', () => {
  const drawers = document.querySelectorAll('.drawer');
  drawers.forEach(drawer => {
    drawer.addEventListener('click', () => {
      drawer.classList.toggle('open');
    });
  });

  const lamp = document.getElementById('lamp');
  if (lamp) {
    lamp.addEventListener('click', (e) => {
      e.stopPropagation();
      lamp.classList.toggle('on');
    });
  }

  const picture = document.getElementById('picture');
  if (picture) {
    picture.addEventListener('mouseenter', () => {
      picture.classList.remove('swinging');
      void picture.offsetWidth;
      picture.classList.add('swinging');
      setTimeout(() => picture.classList.remove('swinging'), 600);
    });
  }

  const suitcase = document.getElementById('suitcase');
  if (suitcase) {
    let dragX = 0;
    let startX = 0;
    let initialDragX = 0;
    let didDrag = false;

    function applyTransform() {
      suitcase.style.transform = `translate(${dragX}px, 0)`;
    }

    function startDrag(clientX, clientY) {
      startX = clientX;
      initialDragX = dragX;
      didDrag = false;
      suitcase.classList.add('dragging');
    }

    function moveDrag(clientX, clientY) {
      const dx = clientX - startX;
      if (Math.abs(dx) > 5) didDrag = true;

      const dresser = document.querySelector('.dresser');
      const suitcaseRect = suitcase.getBoundingClientRect();
      const baseLeft = suitcaseRect.left - dragX;
      const baseRight = suitcaseRect.right - dragX;

      const minDragX = 0 - baseLeft;
      const maxDragX = dresser
        ? dresser.getBoundingClientRect().left - baseRight - 8
        : Infinity;

      dragX = Math.max(minDragX, Math.min(maxDragX, initialDragX + dx));
      applyTransform();
    }

    function endDrag() {
      suitcase.classList.remove('dragging');
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', endDrag);
      document.removeEventListener('touchmove', onTouchMove, { passive: false });
      document.removeEventListener('touchend', endDrag);
    }

    let rainbowIndex = 0;
    const rainbowTotal = 7;

    suitcase.addEventListener('click', (e) => {
      if (!didDrag) {
        e.preventDefault();
        suitcase.classList.remove('rainbow-0', 'rainbow-1', 'rainbow-2', 'rainbow-3', 'rainbow-4', 'rainbow-5', 'rainbow-6');
        rainbowIndex = (rainbowIndex + 1) % rainbowTotal;
        suitcase.classList.add(`rainbow-${rainbowIndex}`);
      }
    });

    function onMouseMove(e) {
      moveDrag(e.clientX, e.clientY);
    }

    function onTouchMove(e) {
      if (e.touches.length === 1) {
        e.preventDefault();
        moveDrag(e.touches[0].clientX, e.touches[0].clientY);
      }
    }

    suitcase.addEventListener('mousedown', (e) => {
      e.preventDefault();
      startDrag(e.clientX, e.clientY);
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', endDrag);
    });

    suitcase.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        startDrag(e.touches[0].clientX, e.touches[0].clientY);
        document.addEventListener('touchmove', onTouchMove, { passive: false });
        document.addEventListener('touchend', endDrag);
      }
    });
  }
});
