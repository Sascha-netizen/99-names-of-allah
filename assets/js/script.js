// Wait for the DOM to finish loading and adding event listeners to the buttons

document.addEventListener("DOMContentLoaded", async function() {
    let buttons = document.querySelectorAll("#game-levels-container button");

    for (let button of buttons) {
        button.addEventListener("click", function() {
            const level = this.getAttribute("data-type");
            window.location.href = `game.html?level=${level}`;
        });
    }

    if (window.location.pathname.includes("game.html")) {
        // fetch json
        const names = await loadNames();
        console.log(names);

        const params = new URLSearchParams(window.location.search);
        const level = params.get("level");

        let numberOfPairs;
        if (level === 'easy') {
            numberOfPairs = 6;
        } else if (level === 'medium') {
            numberOfPairs = 9;
        } else {
            numberOfPairs = 12;
        }

        const shuffled = names.sort(() => 0.5 - Math.random());
        const selectedNames = shuffled.slice(0, numberOfPairs);

        console.log(selectedNames);
    }

});

async function loadNames() {
    try {
        const response = await fetch('../data/names.json');
        const names = await response.json();
        return names;
    } catch (error) {
        console.error('Error loading names:', error);
        return [];
    }
}



