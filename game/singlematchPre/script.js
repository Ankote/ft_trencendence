// Game state object to store paddle and table selections
const gameState = {
    selectedTable: null,
    selectedPaddles: {
        player1: null,
        player2: null
    }
};

// Utility function to handle table selection
function handleTableClick(tables) {
    tables.forEach(table => {
        table.addEventListener('click', function () {
            tables.forEach(t => t.classList.remove('selectedTable')); // Remove 'selected' from all tables
            this.classList.add('selectedTable'); // Add 'selected' to the clicked table
            gameState.selectedTable = (setColor(this.getAttribute('data-value'))); // Log the data-value attribute
        });
    });
}

// Initialize tables
function initTables() {
    const tables = document.getElementsByClassName('tables');
    if (tables.length > 0) {
        tables[0].classList.add('selectedTable'); // Select the first table by default
        handleTableClick(Array.from(tables)); // Convert to array and set up event listeners
    }
}

// Utility function for handling paddles click
function paddleClickHandler(paddles, player) {
    return function () {
        paddles.forEach(paddle => paddle.classList.remove('selectedPaddle'));
        this.classList.add('selectedPaddle');
        
        // console.log(setColor(this.getAttribute('data-value')));
        gameState.selectedPaddles[player] = setColor(this.getAttribute('data-value'))
    }
}

// Utility function for adding/removing hover effect
function togglePaddleHover(paddles, enable) {
    paddles.forEach(paddle => {
        if (enable) {
            paddle.addEventListener('mouseover', handleMouseOver);
            paddle.addEventListener('mouseout', handleMouseOut);
        } else {
            paddle.removeEventListener('mouseover', handleMouseOver);
            paddle.removeEventListener('mouseout', handleMouseOut);
        }
    });
}



// Generalized Ready Handler for both players
function handlePlayerReady(paddles, inputField, readyBtn, clickHandler) {
    if (readyBtn.textContent === "Ready") {
        if (inputField.value == '')
            inputField.value =  inputField.getAttribute('id')
        togglePaddleHover(paddles, false);  // Disable hover effect
        inputField.disabled = true;
        inputField.style.border = "none";
        inputField.style.opacity = '0.25'
        readyBtn.textContent = "Cancel";
        paddles.forEach(paddel=>paddel.style.opacity = '0.25')
        paddles.forEach(paddle => paddle.removeEventListener('click', clickHandler));
    } else {
        togglePaddleHover(paddles, true);  // Enable hover effect
        inputField.disabled = false;
        inputField.style.border = "solid 1px #666673";
        inputField.style.opacity = '1'
        readyBtn.textContent = "Ready";
        paddles.forEach(paddel=>paddel.style.opacity = '1')
        paddles.forEach(paddle => paddle.addEventListener('click', clickHandler));
    }
}

// Hover effect handlers
function handleMouseOver() {
    this.style.opacity = '0.75';
}

function handleMouseOut() {
    this.style.opacity = '1';
}

// Initialize paddles for both players
function initPaddles(playerSelector, selectedClass) {
    const paddles = Array.from(document.querySelectorAll(`${playerSelector} > .paddles > div`));
    paddles[0].classList.add(selectedClass);  // Mark the first paddle as selected
    return paddles;
}


// Set Color depend paddels selected
function setColor(paddlName)
{
    const colorsMap = {'ice' : '#1E90FF', 'blood' : '#F35969', 'basic' : '#D9D9D9'}
    return colorsMap[paddlName]
}


// Initialize the game
function initGame() {
    const lPlayerPaddles = initPaddles(".player1", 'selectedPaddle');
    const rPlayerPaddles = initPaddles(".player2", 'selectedPaddle');

    const lPlayerReadyBtn = document.querySelector(".player1 > button");
    const rPlayerReadyBtn = document.querySelector(".player2 > button");
    const lInputText = document.querySelector(".player1 input");
    const rInputText = document.querySelector(".player2 input");

    const lClickHandler = paddleClickHandler(lPlayerPaddles, 'player1');
    const rClickHandler = paddleClickHandler(rPlayerPaddles, 'player2');

    lPlayerPaddles.forEach(paddle => paddle.addEventListener('click', lClickHandler));
    rPlayerPaddles.forEach(paddle => paddle.addEventListener('click', rClickHandler));

    togglePaddleHover(lPlayerPaddles, true);
    togglePaddleHover(rPlayerPaddles, true);

    lPlayerReadyBtn.addEventListener('click', () => handlePlayerReady(lPlayerPaddles, lInputText, lPlayerReadyBtn, lClickHandler));
    rPlayerReadyBtn.addEventListener('click', () => handlePlayerReady(rPlayerPaddles, rInputText, rPlayerReadyBtn, rClickHandler));
    initTables(); // Initialize tables
}

// Call the initialization function
initGame();
