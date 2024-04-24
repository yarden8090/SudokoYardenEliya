//Load boards from file manually
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
//Create Variables 
let timer, timerRemainig, lives, selectedNum, selectedTile, disableSelect; //how much time

let e = document.getElementById("difficulty");

window.onload = function(){
  //Run startgame function when button is clicked
  id("start-btn").addEventListener("click", startGame);
}

function startGame() {
  // choose board difficulty
  let board;
  let e = qs("#difficulty");
  let selectedIndex = e.selectedIndex;
  if (selectedIndex == 0) board = easy[0];
  else if (selectedIndex == 1) board = medium[0];
  else board = hard[0];
  // set lives to 3 and enable selecting numbers and tiles
  lives = 3;
  disableSelect = false;
  id("lives").textContent = "Lives Remaining: 3";
  generateBoard(board);
  // start the timer
  startTimer();
  // show number container
  id("number-container").classList.remove("hidden");
}

function startTimer(){
    timerRemaining = 600;
    id("timer").textContent = timeConversion(timerRemaining);
    //set timer to update every second
    timer = setInterval(function(){
      timerRemaining--;
      //if the timer has run out
      if(timerRemaining === 0) endGame();
      id("timer").textContent = timeConversion(timerRemaining);
    }, 1000)
}
//convert seconds into string of MM:SS format
function timeConversion(time){
  let minutes = Math.floor(time/60);
  if(minutes < 10) minutes = "0" + minutes;
  let seconds = time % 60;
  if(seconds < 10) seconds = "0" + seconds;
  return minutes + ":" + seconds;
}



function generateBoard(board){
  //clear previous board
  clearPrevious();
  //let used to increment tile ids
  let idCount = 0;
  //create 81 tiles
  for(let i = 0; i < 81; i++){
    //create a new paragraph element
    let tile = document.createElement("p");
    //if the tile is not supposed to be blank
    if(board.charAt(i) != "-"){
      //set tile text to the correct number
      tile.textContent = board.charAt(i);
    }  else {
      //add click event listener to tile
    }
    //assign tile id
    tile.id = idCount;
    //increment for next tile
    idCount++;
    //add tile class to all tiles
    tile.classList.add("tile");
    if((tile.id > 17 && tile.id < 27) || (tile.id > 44 & tile.id < 54)){
      tile.classList.add("bottomBorder");
    }
    if((tile.id + 1) % 9 == 3 || (tile.id + 1) % 9 == 6){
      tile.classList.add("rightBorder");
    }
    //add tile to board
    id("board").appendChild(tile);
  }
}

function clearPrevious(){
  //access all of the tiles
  let tiles = qsa(".tile");
  //remove each tile
  for(let i = 0; i < tiles.length; i++){
    tiles[i].remove();
  }
  //if there is a timer clear it
  if(timer) clearTimeout(timer);
  //deselect any numbers
  for(let i = 0; i < id("number-container").children.length; i++){
    id("number-container").children[i].classList.remove("selected");
  }
  //clear selected variables
  selectedTile = null;
  selectedNum = null;
}

//helper functions
function id(id){
  return document.getElementById(id);
}

function qs(selector){
  return document.querySelector(selector);
}

function qsa(selector){
  return document.querySelectorAll(selector);
}
