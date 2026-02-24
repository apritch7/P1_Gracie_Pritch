(function () {
    // Path data for overlay only – radius 54 so wedges extend past the pizza edge and hide crust/slice lines
    var slicePaths = [
        'M 50 50 L 50 -4 A 54 54 0 0 1 88.18 11.82 Z',
        'M 50 50 L 88.18 11.82 A 54 54 0 0 1 104 50 Z',
        'M 50 50 L 104 50 A 54 54 0 0 1 88.18 88.18 Z',
        'M 50 50 L 88.18 88.18 A 54 54 0 0 1 50 104 Z',
        'M 50 50 L 50 104 A 54 54 0 0 1 11.82 88.18 Z',
        'M 50 50 L 11.82 88.18 A 54 54 0 0 1 -4 50 Z',
        'M 50 50 L -4 50 A 54 54 0 0 1 11.82 11.82 Z',
        'M 50 50 L 11.82 11.82 A 54 54 0 0 1 50 -4 Z'
    ];

    var eatenOverlay = document.querySelector('.eaten-overlay');
    var countEl = document.getElementById('count');
    var messageEl = document.querySelector('.message');
    var eaten = new Set();

    function eatSlice(index) {
        if (eaten.has(index)) return;
        eaten.add(index);
        var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', slicePaths[index]);
        path.setAttribute('class', 'eaten-slice');
        eatenOverlay.appendChild(path);
        document.querySelector('.slice[data-slice="' + index + '"]').classList.add('eaten');
        countEl.textContent = eaten.size;
        if (eaten.size === 8 && messageEl) {
            messageEl.textContent = 'A good tip is always appreciated!';
        }
    }

    document.querySelectorAll('.pizza-slices .slice').forEach(function (el) {
        el.addEventListener('click', function () {
            var index = parseInt(this.getAttribute('data-slice'), 10);
            eatSlice(index);
        });
    });
})();
