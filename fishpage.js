(function () {
    var tank = document.querySelector(".tank");
    var fish = document.querySelectorAll(".fish");
    var fallSpeed = 2.5;
    var hitMargin = 80;

    function rectsOverlap(a, b) {
        return !(a.right < b.left || a.left > b.right || a.bottom < b.top || a.top > b.bottom);
    }

    function distance(x1, y1, x2, y2) {
        return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
    }

    function checkHitFish(wormEl) {
        var wormRect = wormEl.getBoundingClientRect();
        var wormCenterX = wormRect.left + wormRect.width / 2;
        var wormCenterY = wormRect.top + wormRect.height / 2;

        for (var i = 0; i < fish.length; i++) {
            var fishRect = fish[i].getBoundingClientRect();
            if (!rectsOverlap(wormRect, fishRect)) continue;

            var fishCenterX = fishRect.left + fishRect.width / 2;
            var fishCenterY = fishRect.top + fishRect.height / 2;
            var d = distance(wormCenterX, wormCenterY, fishCenterX, fishCenterY);
            if (d < hitMargin) return true;
        }
        return false;
    }

    function dropWorm(clientX) {
        var rect = tank.getBoundingClientRect();
        var x = clientX - rect.left - 10;
        x = Math.max(4, Math.min(rect.width - 24, x));

        var worm = document.createElement("div");
        worm.className = "worm";
        worm.setAttribute("aria-hidden", "true");
        worm.style.left = x + "px";
        worm.style.top = "-12px";

        tank.appendChild(worm);

        var top = -12;
        var tankBottom = rect.height;

        function step() {
            if (!worm.parentNode) return;
            top += fallSpeed;
            worm.style.top = top + "px";

            if (checkHitFish(worm)) {
                worm.remove();
                return;
            }
            if (top > tankBottom + 20) {
                worm.remove();
                return;
            }
            requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
    }

    tank.addEventListener("click", function (e) {
        dropWorm(e.clientX);
    });
})();
