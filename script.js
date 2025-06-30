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
  poneconn: false,
  ptwoconn: false,
  diceroll: 0,
  poneGuess: 0,
  ptwoGuess: 0,
};

// JSON File related/internal game state functions

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
    await readFile();
  }
  catch (error) {
    console.error("Error loading file: ", error);
  }
  console.log("loadFile() filehandle: " + filehandle);
}

/** Read data from json file, update internal state with read data */
async function readFile() {
  try {
    console.log("readFile() filehandle: " + filehandle);
    const file1 = await filehandle.getFile();
    const contents1 = await file1.text();
    const data = JSON.parse(contents1);
    game.state = data.state;
    game.turn = data.turn;
    game.lastwinner = data.lastwinner;
    game.poneconn = data.poneconn;
    game.ptwoconn = data.ptwoconn;
    game.diceroll = data.diceroll;
    game.poneGuess = data.poneGuess;
    game.ptwoGuess = data.ptwoGuess;
    await file1.close();
  }
  catch (error) {
    console.error("Error reading file: " + error);
  }
}

/** Stringify internal state, update json file with new data */
async function updateFile() {
  try {
    console.log("updateFile() filehandle: " + filehandle);
    const file2 = await filehandle.createWritable();
    let contents2 = JSON.stringify(game);
    await file2.write(contents2);
    await file2.close();
  }
  catch (error) {
    console.error("Error updating file: " + error);
  }
}

// Button interaction
function handleClick(clickedButtonId) {
  let clickedButton = document.getElementById(clickedButtonId);
  console.log(clickedButton.textContent);
}

// // UI functions

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

function addClickableButton(nid, ntxt) {
  let button = document.createElement("button");
  button.id = nid;
  button.textContent = ntxt;
  button.addEventListener("click", function() {
    handleClick(button.id);
  });
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
  addClickableButton("clearstart", "Start");
  input_text("Enter number 1-6");
}