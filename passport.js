(function () {
    "use strict";

    const countries = [
        "Japan", "France", "Italy", "Spain", "Germany", "UK", "Australia",
        "Brazil", "Mexico", "Canada", "Thailand", "Greece", "Portugal",
        "Netherlands", "Switzerland", "Ireland", "New Zealand", "Iceland",
        "Norway", "Sweden", "Egypt", "Morocco", "South Korea", "India",
        "Argentina", "Chile", "Peru", "Croatia", "Poland", "Austria",
        "Belgium", "Singapore", "Vietnam", "Indonesia", "Turkey", "Israel"
    ];

    const colors = ["red", "blue", "black", "green", "purple"];
    let countryIndex = 0;

    function formatDate() {
        const d = new Date();
        const day = String(d.getDate()).padStart(2, "0");
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const year = d.getFullYear();
        return `${day} ${month} ${year}`;
    }

    function getRandomRotation() {
        return (Math.random() - 0.5) * 12;
    }

    function createStamp(country, clientX, clientY) {
        const stamp = document.createElement("div");
        stamp.className = "stamp stamp--" + colors[countryIndex % colors.length];
        stamp.setAttribute("aria-label", `Passport stamp: ${country}`);

        const rotation = getRandomRotation();
        stamp.style.setProperty("--rotation", rotation + "deg");
        stamp.style.left = clientX + "px";
        stamp.style.top = clientY + "px";

        stamp.innerHTML =
            '<span class="stamp-country">' + country + "</span>" +
            '<span class="stamp-date">' + formatDate() + "</span>";

        document.body.appendChild(stamp);

        // Center stamp on click position
        const rect = stamp.getBoundingClientRect();
        stamp.style.left = (clientX - rect.width / 2) + "px";
        stamp.style.top = (clientY - rect.height / 2) + "px";
    }

    function handleClick(e) {
        const country = countries[countryIndex % countries.length];
        countryIndex += 1;
        createStamp(country, e.clientX, e.clientY);
    }

    const area = document.getElementById("passportArea");
    if (area) {
        area.addEventListener("click", handleClick);
    }
})();
