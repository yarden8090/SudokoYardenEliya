//try to git it by Yarden
let sudokuData = {};

// Create Variables
let timer, timerRemaining, lives, selectedNum, selectedTile, disableSelect;

function deleteNum() {
    let selectedNumId = selectedNum.id;
    let selectedNumToRemove = document.getElementById(selectedNumId);
    selectedNumToRemove.style.display = "none";
}

window.onload = function(){
    // Fetch the sudoku data from JSON file
    fetch('sudoku.json')
        .then(response => response.json())
        .then(data => {
            sudokuData = data;
            console.log("Sudoku Data Loaded", sudokuData);
        })
        .catch(error => console.error('Error loading Sudoku file:', error));

    // Run startGame function when button is clicked
    document.getElementById("start-btn").addEventListener("click", startGame);

    // Add event listener to each number in number container
    let numberContainerChildren = document.getElementById("number-container").children;
    for(let i = 0; i < numberContainerChildren.length; i++){
        numberContainerChildren[i].addEventListener("click", function(){
            // If selecting is not disabled
            if(!disableSelect){
                // If number is already selected
                if(this.classList.contains("selected")){
                    // Then remove selection
                    this.classList.remove("selected");
                    selectedNum = null;
                } else {
                    // Deselect all other numbers
                    for(let j = 0; j < 9; j++){
                        numberContainerChildren[j].classList.remove("selected");
                    }
                    // Select it and update selectedNum variable
                    this.classList.add("selected");
                    selectedNum = this;
                    updateMove();
                }
            }
        });
    }
};

function startGame() {
    // Clear any existing game messages
    const messageElement = document.getElementById("message");
    messageElement.textContent = "";
    messageElement.style.color = "#000000"; // Reset color or use your default color

    document.getElementById("solver").style.display = "inline-block";
    for (let i = 0; i < 9; i++) {
        document.getElementById("number-container").children[i].style.display = "block";
    }
    let board;
    // Choose board difficulty
    let selectedIndex = document.getElementById("difficulty").selectedIndex;
    if (selectedIndex === 0) board = getRandomBoard('easy');
    else if (selectedIndex === 1) board = getRandomBoard('medium');
    else board = getRandomBoard('hard');
    // Set lives to 3 and enable selecting numbers and tiles
    lives = 3;
    disableSelect = false;
    document.getElementById("lives").textContent = "Lives Remaining: 3";
    // Create board based on difficulty
    generateBoard(board.puzzle);
    // Start the timer
    startTimer();
    // Show number container
    document.getElementById("number-container").classList.remove("hidden");
}

function startTimer(){
    timerRemaining = 900;
    document.getElementById("timer").textContent = timeConversion(timerRemaining);
    // Set timer to update every second
    timer = setInterval(function(){
        timerRemaining--;
        // If the timer has run out
        if(timerRemaining === 0) endGame('lose');
        document.getElementById("timer").textContent = timeConversion(timerRemaining);
    }, 1000);
}

// Convert seconds into string of MM:SS format
function timeConversion(time){
    let minutes = Math.floor(time / 60);
    if(minutes < 10) minutes = "0" + minutes;
    let seconds = time % 60;
    if(seconds < 10) seconds = "0" + seconds;
    return minutes + ":" + seconds;
}

function endGame(result){
    // Disable moves and stop the timer
    disableSelect = true;
    clearInterval(timer); // Use clearInterval to stop the timer

    // Display the appropriate message
    const messageElement = document.getElementById("message");
    if(result === 'win') {
        messageElement.textContent = "You Win!";
        messageElement.style.color = "#00FF00"; // Green color for win
    } else if(result === 'lose') {
        messageElement.textContent = "You Lost!";
        messageElement.style.color = "#FF0000"; // Red color for lose
    }

    document.getElementById("solver").style.display = "none";
}
function generateBoard(board) {
    clearPrevious();
    let idCount = 0;
    for (let i = 0; i < 81; i++) {
        let tile = document.createElement("p");
        if (board.charAt(i) !== "-") {
            tile.textContent = board.charAt(i);
            tile.classList.add("filled");
            tile.classList.add("non-editable"); // Mark initial numbers as non-editable
            tile.removeEventListener("click", tileClickHandler); // Ensure no click event
        } else {
            tile.addEventListener("click", tileClickHandler); // Attach click event for empty tiles
        }
        tile.id = idCount;
        idCount++;
        tile.classList.add("tile");
        if ((tile.id > 17 && tile.id < 27) || (tile.id > 44 && tile.id < 54)) {
            tile.classList.add("bottomBorder");
        }
        if ((tile.id + 1) % 9 === 3 || (tile.id + 1) % 9 === 6) {
            tile.classList.add("rightBorder");
        }
        document.getElementById("board").appendChild(tile);
    }
}


function updateMove() {
    if (selectedTile && selectedNum) {
        selectedTile.textContent = selectedNum.textContent;
        if (checkCorrect(selectedTile)) {
            if (!stillRelevant(selectedNum)) {
                deleteNum();
            }
            selectedTile.classList.remove("selected");
            selectedNum.classList.remove("selected");
            selectedNum = null;
            selectedTile.classList.add("correct"); // Mark the tile as correct
            selectedTile.classList.add("non-editable"); // Make it non-editable
            selectedTile.removeEventListener("click", tileClickHandler); // Remove click event listener
            selectedTile = null;
            if (checkDone()) {
                endGame('win');
            }
        } else {
            disableSelect = true;
            selectedTile.classList.add("incorrect");
            setTimeout(function() {
                lives--;
                if (lives <= 0) {
                    lives = 0;
                    document.getElementById("lives").textContent = "Lives Remaining: " + lives;
                    endGame('lose');
                } else {
                    document.getElementById("lives").textContent = "Lives Remaining: " + lives;
                    disableSelect = false;
                }
                selectedTile.classList.remove("incorrect");
                selectedTile.classList.remove("selected");
                selectedNum.classList.remove("selected");
                selectedTile.textContent = "";
                selectedTile = null;
                selectedNum = null;
            }, 1000);
        }
    }
}

function stillRelevant(number) {
    let tiles = document.querySelectorAll(".tile");
    let count = 0;
    // Count how many times the number appears in the board
    for (let i = 0; i < tiles.length; i++) {
        if (tiles[i].textContent === number.textContent) {
            count++;
        }
    }
    return count < 9;
}

function checkCorrect(tile){
    let solution;
    let selectedIndex = document.getElementById("difficulty").selectedIndex;
    if (selectedIndex === 0) {
        solution = sudokuData.easy.find(board => board.puzzle === getCurrentBoard().puzzle).solution;
    } else if (selectedIndex === 1) {
        solution = sudokuData.medium.find(board => board.puzzle === getCurrentBoard().puzzle).solution;
    } else {
        solution = sudokuData.hard.find(board => board.puzzle === getCurrentBoard().puzzle).solution;
    }
    return solution.charAt(tile.id) === tile.textContent;
}

function checkDone() {
    let tiles = document.querySelectorAll(".tile");
    for (let i = 0; i < tiles.length; i++) {
        // Check if any tile is empty or incorrect
        if (tiles[i].textContent === "" || !checkCorrect(tiles[i])) {
            return false;
        }
    }
    return true;
}

function clearPrevious() {
    let tiles = document.querySelectorAll(".tile");
    for (let i = 0; i < tiles.length; i++) {
        tiles[i].remove();
    }
    if (timer) clearInterval(timer); // Use clearInterval to stop the timer
    let numberContainerChildren = document.getElementById("number-container").children;
    for (let i = 0; i < numberContainerChildren.length; i++) {
        numberContainerChildren[i].classList.remove("selected");
    }
    selectedTile = null;
    selectedNum = null;
}

function solver() {
    if (document.getElementById("solver").textContent === "hide again") {
        document.getElementById("solver").textContent = "show solution";
        let tiles = document.querySelectorAll(".tile");
        for (let i = 0; i < tiles.length; i++) {
            if (tiles[i].classList.contains("correct")) {
                tiles[i].textContent = "";
                tiles[i].classList.remove("correct");
            }
        }
        return;
    } else {
        document.getElementById("solver").textContent = "hide again";
        let tiles = document.querySelectorAll(".tile");
        let board = "";
        for (let i = 0; i < tiles.length; i++) {
            if (tiles[i].textContent === "") board += "-";
            else board += tiles[i].textContent;
        }
        let solution;
        let selectedIndex = document.getElementById("difficulty").selectedIndex;
        if (selectedIndex === 0) {
            solution = sudokuData.easy.find(board => board.puzzle === getCurrentBoard().puzzle).solution;
        } else if (selectedIndex === 1) {
            solution = sudokuData.medium.find(board => board.puzzle === getCurrentBoard().puzzle).solution;
        } else {
            solution = sudokuData.hard.find(board => board.puzzle === getCurrentBoard().puzzle).solution;
        }
        for (let i = 0; i < solution.length; i++) {
            if (solution.charAt(i) !== board.charAt(i)) {
                tiles[i].textContent = solution.charAt(i);
                tiles[i].classList.add("correct");
            }
        }
    }
}

let currentBoard;
function getCurrentBoard(){
    return currentBoard;
}

function getRandomBoard(difficulty){
    let boards = sudokuData[difficulty];
    let randomIndex = Math.floor(Math.random() * boards.length);
    currentBoard = boards[randomIndex];
    return currentBoard;
}


function tileClickHandler(event) {
    if (!disableSelect && !event.target.classList.contains("non-editable")) {
        if (event.target.classList.contains("selected")) {
            event.target.classList.remove("selected");
            selectedTile = null;
        } else {
            document.querySelectorAll(".tile").forEach(t => t.classList.remove("selected"));
            event.target.classList.add("selected");
            selectedTile = event.target;
            updateMove();
        }
    }
}