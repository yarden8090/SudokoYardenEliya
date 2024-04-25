const easy = [
  "6------7------5-2------1---362----81--96-----71--9-4-5-2---651---78----345-------",
  "685329174971485326234761859362574981549618732718293465823946517197852643456137298"
];
const medium = [
  "--9-------4----6-758-31----15--4-36-------4-8----9-------75----3-------1--2--3--",
  "619472583243985617587316924158247369926531478734698152891754236365829741472163895"
];
const hard = [
  "-1-5-------97-42----5----7-5---3---7-6--2-41---8--5---1-4------2-3-----9-7----8--",
  "712583694639714258845269173521436987367928415498175326184697532253841769976352841"
];

// Create Variables
let timer, timerRemaining, lives, selectedNum, selectedTile, disableSelect;

function deleteNum() {
  let selectedNumId = selectedNum.id;
  let selectedNumToRemove = document.getElementById(selectedNumId);
  selectedNumToRemove.style.display = "none";
  //alert("deleted");
}

window.onload = function(){
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

function startGame(){
  for (let i = 0; i < 9; i++) {
    document.getElementById("number-container").children[i].style.display="block";
  }
  let board;
  // Choose board difficulty
  let selectedIndex = document.getElementById("difficulty").selectedIndex;
  if(selectedIndex === 0) board = easy[0];
  else if(selectedIndex === 1) board = medium[0];
  else board = hard[0];
  // Set lives to 3 and enable selecting numbers and tiles
  lives = 3;
  disableSelect = false;
  document.getElementById("lives").textContent = "Lives Remaining: 3";
  generateBoard(board);
  // Show number container
  document.getElementById("number-container").classList.remove("hidden");
  // Start the timer
  startTimer();
}

function startTimer(){
  timerRemaining =900;
  document.getElementById("timer").textContent = timeConversion(timerRemaining);
  // Set timer to update every second
  timer = setInterval(function(){
      timerRemaining--;
      // If the timer has run out
      if(timerRemaining === 0) endGame();
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

function checkDone(){
  let tiles = document.querySelectorAll(".tile");
  for(let i = 0; i < tiles.length; i++){
      if(tiles[i].textContent === "") return false;
  }
  return true;
}

function endGame(){
  // Disable moves and stop the timer
  disableSelect = true;
  clearTimeout(timer);
  // Display win or loss message
  if(lives === 0 || timerRemaining === 0){
      document.getElementById("lives").textContent = "You Lost!";
  } else {
      document.getElementById("lives").textContent = "You Won!";
  }
}

function generateBoard(board){
  // Clear previous board
  clearPrevious();
  // Let used to increment tile ids
  let idCount = 0;
  // Create 81 tiles
  for(let i = 0; i < 81; i++){
      // Create a new paragraph element
      let tile = document.createElement("p");
      // If the tile is not supposed to be blank
      if(board.charAt(i) !== "-"){
          // Set tile text to the correct number
          tile.textContent = board.charAt(i);
      } else {
          // Add click event listener to tile
          tile.addEventListener("click", function(){
              // If selecting is not disabled
              if(!disableSelect){
                  // If the tile is already selected
                  if(tile.classList.contains("selected")){
                      // Then remove selection
                      tile.classList.remove("selected");
                      selectedTile = null;
                  } else {
                      // Deselect all other tiles
                      for(let j = 0; j < 81; j++){
                          document.querySelectorAll(".tile")[j].classList.remove("selected");
                      }
                      // Add selection and update variable
                      tile.classList.add("selected");
                      selectedTile = tile;
                      updateMove();
                  }
              }
          });
      }
      // Assign tile id
      tile.id = idCount;
      // Increment for next tile
      idCount++;
      // Add tile class to all tiles
      tile.classList.add("tile");
      if((tile.id > 17 && tile.id < 27) || (tile.id > 44 && tile.id < 54)){
          tile.classList.add("bottomBorder");
      }
      if((tile.id + 1) % 9 === 3 || (tile.id + 1) % 9 === 6){
          tile.classList.add("rightBorder");
      }
      // Add tile to board
      document.getElementById("board").appendChild(tile);
  }
}

function updateMove(){
  // If a tile and a number is selected
  if(selectedTile && selectedNum){
      // Set the tile to the correct number
      selectedTile.textContent = selectedNum.textContent;
      // If the number matches the solution
      if(checkCorrect(selectedTile)){
            //check if selectedNum is not rellevent anymore
          if (!stillRelevant(selectedNum)) {
            deleteNum();
          }
          // Deselect the tile
          selectedTile.classList.remove("selected");
          selectedNum.classList.remove("selected");
          // Clear the selected variables
          selectedNum = null;
          selectedTile = null;
          // Check if board is completed
          if(checkDone()){
              endGame();
          }
          // If the number does not match the solution
      } else {
          // Disable selecting new numbers for one second
          disableSelect = true;
          // Make the tile turn red
          selectedTile.classList.add("incorrect");
          // Run in one second
          setTimeout(function(){
              // Subtract lives by one
              lives--;
              // If no lives left end the game
              if(lives === 0) {
                  endGame();
              } else {
                  // If lives is not equal to zero
                  // Update lives text
                  document.getElementById("lives").textContent = "Lives Remaining: " + lives;
                  // Enable selecting numbers and tiles
                  disableSelect = false;
              }
              // Restore tile color and remove selected from both
              selectedTile.classList.remove("incorrect");
              selectedTile.classList.remove("selected");
              selectedNum.classList.remove("selected");
              // Clear the tile text and clear selected variables
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
  //alert(count);
  // Check if the number appears 9 times in the board
  return count < 9;
}

function checkCorrect(tile){
  // Set solution based on difficulty selection
  let solution;
  let selectedIndex = document.getElementById("difficulty").selectedIndex;
  if (selectedIndex === 0) solution = easy[1];
  else if (selectedIndex === 1) solution = medium[1];
  else solution = hard[1];
  // If the tile's number is equal to the solution's number
  if(solution.charAt(tile.id) === tile.textContent) return true;
  else return false;
}

function clearPrevious(){
  // Access all of the tiles
  let tiles = document.querySelectorAll(".tile");
  // Remove each tile
  for(let i = 0; i < tiles.length; i++){
      tiles[i].remove();
  }
  // If there is a timer clear it
  if(timer) clearTimeout(timer);
  // Deselect any numbers
  let numberContainerChildren = document.getElementById("number-container").children;
  for(let i = 0; i < numberContainerChildren.length; i++){
      numberContainerChildren[i].classList.remove("selected");
  }
  // Clear selected variables
  selectedTile = null;
  selectedNum = null;
}