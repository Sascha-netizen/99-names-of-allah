// Proper shuffle function using Fisher-Yates algorithm
function shuffle(array) {
    const result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
}

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
        } else if (level === 'challenging') {
            numberOfPairs = 12;
        } else {
            numberOfPairs = 6; // default fallback
        }

        // Use proper shuffle instead of biased sort method
        const shuffled = shuffle(names);
        const selectedNames = shuffled.slice(0, numberOfPairs);

        generateCards(selectedNames, level);
    }
});

async function loadNames() {
    try {
        const response = await fetch('assets/data/names.json');
        const names = await response.json();
        return names;
    } catch (error) {
        console.error('Error loading names:', error);
        return [];
    }
}

function generateCards(selectedNames, level) {
    // Create pairs and shuffle them properly
    const pairs = selectedNames.concat(selectedNames);
    const shuffledPairs = shuffle(pairs);

    const gameTable = document.getElementById("game-table");
    gameTable.innerHTML = "";
    
    // Add level data attribute for CSS targeting
    gameTable.setAttribute('data-level', level);

    for (let card of shuffledPairs) {
        // outer card container
        const cardElement = document.createElement("div");
        cardElement.classList.add("card");

        // inner wrapper (for flip animation)
        const inner = document.createElement("div");
        inner.classList.add("card-inner");

        // front (what you see before flipping)
        const front = document.createElement("div");
        front.classList.add("card-front");
        front.textContent = "?";

        // back (revealed on flip)
        const back = document.createElement("div");
        back.classList.add("card-back");
        back.innerHTML = `
            <span dir="rtl">${card.arabic}</span>
            <span>${card.english}</span>
        `;

        // assemble card
        inner.appendChild(front);
        inner.appendChild(back);
        cardElement.appendChild(inner);

        // add to game table
        gameTable.appendChild(cardElement);

        // click handler to flip
        cardElement.addEventListener("click", () => {
            cardElement.classList.toggle("flipped");
        });
    }
}