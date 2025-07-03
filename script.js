// Aisling Viets
// 6/28/25
// CS 491 Exercise 3
// Tic Tac Toe - Local Multiplayer

const dice = 6; 
const rows = 3;
const cols = 3;

const whitespace = "\u00A0";

const ptwochar = "X";
const ponechar = "O";

var filehandle;
var isMyTurn = false;
var mychar = "";

const gameStates = Object.freeze({
  NEWGAME: "New Game",
  CONTGAME: "Continued Game",
  ENDGAME: "Ended Game"
});

var game = {
  state: gameStates.NEWGAME,
  turn: "",
  lastwinner: "",
  poneGuess: 0,
  ptwoGuess: 0,
  o_cells: [],
  x_cells: []
};

// JSON File related/internal game state functions
// createFile() and loadFile() should only be used to initialize a game, each being called only 1 time respectively

/** Create json file to store game state 
 * @returns {boolean}
*/
async function createFile() {
  try {
    const opts = {
      startIn: 'desktop',
      suggestedName: 'TTTdata.json',
      types: [{
        description: 'TTT Local Save',
        accept: {
          'text/plain': ['.json'],
        }
      }]
    }

    filehandle = await window.showSaveFilePicker(opts);
    writeGameToFile(filehandle);
  }
  catch (error) {
    console.error("Error creating file: ", error);
    console.error("filehandle: ", filehandle);
  }
}

/** Loads file opened by user, to 'join' a game 
 * @returns {boolean}
*/
async function loadFile() {
  const opts1 = {
    startIn: 'desktop',
  }
  try {
    filehandle = await window.showOpenFilePicker(opts1);
    writeGameToFile(filehandle);
    console.log("loadFile() filehandle: " + filehandle);
  }
  catch (error) {
    console.error("Error loading file: ", error);
    console.error("filehandle: ", filehandle);
  }
}

/** Supporting function; writes internal game state to the file supplied through filehandle 
 * @param {FileSystemFileHandle} fh
 * @returns {boolean}
*/
async function writeGameToFile(fh) {
  try {
    const f = await fh.createWritable();
    const c = JSON.stringify(game);
    await f.write(c);
    await file.close();
  }
  catch (error) {
    console.error("Error writing to file: ", error);
  }
}

/** Read data from json file, update internal state with read data 
 * @returns {boolean}
*/
async function readFile() {
  try {
    console.log("readFile() filehandle: ", filehandle);
    const file = await filehandle.getFile();
    const text = await file.text();
    const object = JSON.parse(text);
    for (key in object) {
      game.key = object.key;
      console.log(key + " value in game: " + game.key);
      console.log(key + " value in object: " + game.object);
    }
    await file.close();
  }
  catch (error) {
    console.error("Error reading file: ", error);
  }
}

/** Get user inputs and determine the turn order */
async function determineTurnOrder() {
  let inputrefvalue = document.getElementById("dg").value;

  if (inputrefvalue == 0 || inputrefvalue == null || inputrefvalue > dice) {
    updateTurnDisplay("Select a number between 1 and " + dice);
  }
  else {
    await readFile();
    if (mychar == ponechar && ptwoGuess == 0) {
      game.poneGuess = inputrefvalue;
      // await writeGameToFile();
    }
    else if (mychar == ptwochar && poneGuess == 0) {
      game.poneGuess = inputrefvalue;
      // await writeGameToFile();
    }
    else {
      let randomnum = Math.floor(Math.random() * dice) + 1;
      let oneDiff = Math.abs(game.poneGuess - randomnum);
      let twoDiff = Math.abs(game.ptwoGuess - randomnum);

      if (oneDiff == twoDiff) {
        updateTurnDisplay("Both players made the same guess, guess again");
        game.poneGuess = 0;
        game.ptwoGuess = 0;
        // await writeGameToFile();
      }
      else if (oneDiff < twoDiff) {
        game.turn = ponechar;
      }
      else {
        game.turn = ptwochar;
      }
    }
    await writeGameToFile();
  }
  console.log("Player 1 guess: " + game.poneGuess + "\nPlayer 2 guess: " + game.ptwoGuess + "\nTurn: " + game.turn);
}

function start() {
  //
}

// Button click logic functions

/** Facilitate game start on click */
function startClearClicked() {
  console.log("Start/Clear");
  let startclearbtn = document.getElementById("startclear_btn");

  if (startclearbtn.textContent == "Start") {
    if (game.state == gameStates.NEWGAME && mychar == ponechar) {
      determineTurnOrder();
    }
    start();
  }
  else if (startclearbtn.textContent == "Clear") {
    startclearbtn.textContent = "Start";
  }
}

/** Create a new game; prompt user to make JSON file, assume this player is O/player one */
async function newGameClicked() {
  createFile().then(value => {
    document.getElementById("joingame_btn").disabled = true;
    document.getElementById("newgame_btn").disabled = true;

    mychar = ponechar;

    console.log("New Game as " + mychar);
  })
  .catch(error => {
    alert("Error: Failed to create game");
    console.error("Failed to create game: ", error);
  })
}

/** Join a game; prompt user to choose JSON file, assume this player is X/player two */
function joinGameClicked() {
  loadFile().then(value => {
    document.getElementById("joingame_btn").disabled = true;
    document.getElementById("newgame_btn").disabled = true;

    mychar = ptwochar;

    console.log("Joined Game as " + mychar);
  })
  .catch(error => {
    alert("Error: Failed to join game");
    console.error("Failed to join game: ", error);
  })
}

function syncClicked() {
  console.log("Synced Game");
}

// Display-related functions

/** Update title display 
 * @param {string} ttxt
*/
function updateTitle(ttxt) {
  let ttl = document.getElementById("title");
  ttl.textContent = ttxt;
}

/** Update turn display 
 * @param {string} tdtxt
*/
function updateTurnDisplay(tdtxt) {
  let my = document.getElementById("mt");
  my.textContent = tdtxt;
}

/** Creates the table/playing board visually. */
function table() {
  let table = document.createElement("table");
  table.id = "tbl";
  // table.addEventListener('click', cellclick);
  for (let i=1; i<=rows; i++) {
    let row = table.insertRow();
    for (let j=1; j<=cols; j++) {
      let cell = row.insertCell();
      cell.appendChild(document.createTextNode(whitespace));
    }
  }
  document.body.appendChild(table);
}

/** Function that creates buttons visually, fills respective properties
 * @param {string}: nid
 * @param {string}: ntxt
 * @param {function}: fxn
 */
function addClickableButton(nid, ntxt, fxn) {
  let button = document.createElement("button");
  button.id = nid;
  button.textContent = ntxt;
  button.addEventListener("click", fxn);
  document.body.appendChild(button);
}

/** Creates guess input field 
 * @param {string} placeholder_value
*/
function input_text(placeholder_value) {
  let inp = document.createElement("INPUT");
  inp.setAttribute("type", "text");
  inp.id = "dg";
  inp.setAttribute("placeholder", placeholder_value);
  document.body.appendChild(inp);
}

/** Loads the table/playing board and Clear/Start button. */
function vis_loadpage() {
  table();
  addClickableButton("startclear_btn", "Start", startClearClicked);
  addClickableButton("sync_btn", "Synchronize", syncClicked);
  input_text("Enter number 1-" + dice);
  addClickableButton("newgame_btn", "New Game", newGameClicked);
  addClickableButton("joingame_btn", "Join Game", joinGameClicked);
}