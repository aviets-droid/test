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
const ptwoname = "Player Two";
const ponename = "Player One";

var filehandle;
var myturn = false;
var mychar = "";

var game = {
  state: "NewGame",
  turn: "",
  lastwinner: "",
  diceroll: 0,
  poneGuess: 0,
  ptwoGuess: 0,
  boardData: [
    ['', '', ''],
    ['', '', ''],
    ['', '', '']
  ]
};

// JSON File related/internal game state functions
// createFile() and loadFile() should only be used to initialize a game, each being called only 1 time respectively

/** Create json file to store game state */
async function createFile() {
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

  try {
    filehandle = await window.showSaveFilePicker(opts);
    const file = await filehandle.createWritable();
    const contents = JSON.stringify(game);
    console.log(contents);
    await file.write(contents);
    await file.close();
  }
  catch (error) {
    console.error("Error creating file: ", error);
  }
  console.log("createFile() filehandle: " + filehandle);
}

/** Loads file opened by user, to 'join' a game */
async function loadFile() {
  const opts1 = {
    startIn: 'desktop',
  }
  try {
    filehandle = await window.showOpenFilePicker(opts1);
    console.log("loadFile() filehandle: " + filehandle);
  }
  catch (error) {
    console.error("Error loading file: ", error);
  }
  console.log("loadFile() filehandle: " + filehandle);
}

/** Supporting function; writes internal game state to the file supplied through filehandle 
 * @param {FileSystemFileHandle} fh
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

/** Read data from json file, update internal state with read data */
async function readFile() {
  try {
    console.log("readFile() filehandle: " + filehandle);
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
    console.error("Error reading file: " + error);
  }
}

// Button interaction
function handleClick(clickedButtonId) {
  let clickedButton = document.getElementById(clickedButtonId);
  console.log(clickedButton.textContent);
}

// Button click logic functions

function startClearClicked() {
  console.log("Start/Clear");
}

function newGameClicked() {
  console.log("New Game");
}

function joinGameClicked() {
  console.log("Joined Game");
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
  input_text("Enter number 1-6");
  addClickableButton("newgame_btn", "New Game", newGameClicked);
  addClickableButton("joingame_btn", "Join Game", joinGameClicked);
}