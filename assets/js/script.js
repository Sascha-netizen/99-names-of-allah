// Proper shuffle function using Fisher-Yates algorithm
function shuffle(array) {
    const result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
}

// Wait for the DOM to finish loading
document.addEventListener("DOMContentLoaded", async function() {
    // Level buttons
    const buttons = document.querySelectorAll("#game-levels-container button");
    buttons.forEach(button => {
        button.addEventListener("click", function() {
            const level = this.getAttribute("data-type");
            window.location.href = `game.html?level=${level}`;
        });
    });

    
    if (window.location.pathname.includes("game.html")) {
        const names = await loadNames();

        const params = new URLSearchParams(window.location.search);
        let level = params.get("level");

        let numberOfPairs;
        if (level === 'easy') numberOfPairs = 4;
        else if (level === 'medium') numberOfPairs = 6;
        else if (level === 'challenging') numberOfPairs = 8;
        else {
            level = 'easy';
            numberOfPairs = 4;
        }

        const shuffled = shuffle(names);
        const selectedNames = shuffled.slice(0, numberOfPairs);

        generateCards(selectedNames, level);
        setupCardLogic();
    }
});

// Fetch/liad names from JSON
async function loadNames() {
    try {
        const response = await fetch('assets/data/names.json');
        return await response.json();
    } catch (error) {
        console.error('Error loading names:', error);
        return [];
    }
}


// Generate cards on the game table
function generateCards(selectedNames, level) {
    const pairs = selectedNames.concat(selectedNames);
    const shuffledPairs = shuffle(pairs);

    const gameTable = document.getElementById("game-table");
    gameTable.innerHTML = "";
    gameTable.setAttribute('data-level', level);

    for (let card of shuffledPairs) {
        const cardElement = document.createElement("div");
        cardElement.classList.add("card");

        const inner = document.createElement("div");
        inner.classList.add("card-inner");

        const front = document.createElement("div");
        front.classList.add("card-front");
        front.textContent = "?";

        const back = document.createElement("div");
        back.classList.add("card-back");
        back.innerHTML = `
            <span dir="rtl">${card.arabic}</span>
            <span>${card.english}</span>
        `;

        inner.appendChild(front);
        inner.appendChild(back);
        cardElement.appendChild(inner);
        gameTable.appendChild(cardElement);
    }
}


// Logic to prevent flipping more than two cards and check matches

function setupCardLogic() {
    const cards = document.querySelectorAll(".card");
    let flippedCards = [];
    let isProcessing = false;

    cards.forEach(card => {
        card.addEventListener("click", () => {
            if (isProcessing || card.classList.contains("flipped")) return;

            card.classList.add("flipped");
            flippedCards.push(card);

            if (flippedCards.length === 2) {
                isProcessing = true;
                checkForMatch();
            }
        });
    });


    function checkForMatch() {
        const [card1, card2] = flippedCards;
        const match1 = card1.querySelector('.card-back span[dir="rtl"]').textContent;
        const match2 = card2.querySelector('.card-back span[dir="rtl"]').textContent;

        incrementAttempts();

        if (match1 === match2) {
            // Match found
            incrementMatches();
            resetTurn();
            checkWin();
        } else {
            // No match - flip back after delay
            setTimeout(() => {
                card1.classList.remove("flipped");
                card2.classList.remove("flipped");
                resetTurn();
            }, 2000);
        }
    }

    function resetTurn() {
        flippedCards = [];
        isProcessing = false;
    }

    function checkWin() {
        const allCards = document.querySelectorAll(".card");
        const allFlipped = [...allCards].every(card => card.classList.contains("flipped"));
        if (allFlipped) {
            setTimeout(() => alert("You found all pairs! 🎉"), 500);
        }
    }
}


// Counters for attempts and matches

function incrementAttempts() {
    const attemptsEl = document.getElementById("attempts");
    let current = 0;

    if (attemptsEl && attemptsEl.textContent) {
        const match = attemptsEl.textContent.match(/\d+/);
        if (match) current = parseInt(match[0], 10);
    }
    attemptsEl.textContent = `Attempts: ${current + 1}`;
}

function incrementMatches() {
    const matchesEl = document.getElementById("matches");
    let current = 0;

    if (matchesEl && matchesEl.textContent) {
        const match = matchesEl.textContent.match(/\d+/);
        if (match) current = parseInt(match[0], 10);
    }
    matchesEl.textContent = `Matches: ${current + 1}`;
}
