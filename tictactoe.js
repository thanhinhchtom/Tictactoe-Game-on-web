const CANVAS_BORDER_COLOUR = 'black';
const CANVAS_BACKGROUND_COLOUR = "white";

const restartButton = document.getElementById('restartButton');
const winningMessageElement = document.getElementById('winningMessage');
const winningMessageTextElement = document.querySelector('[data-winning-message-text]');

let field = [];  //create a field
var win = false;

// Get the canvas element
const gameCanvas = document.getElementById("gameCanvas");
// Return a two dimensional drawing context
const ctx = gameCanvas.getContext("2d");

// get game dimensions
const canvasHeight = gameCanvas.height;
const canvasWidth = gameCanvas.width;

let turn = "X";

// add to field
for (var i = 0; i < canvasWidth; i += 30) {
    for (var j = 0; j < canvasHeight; j += 30) {
        field.push({ 'x': j, 'y': i, "icon": "blank" })
    }
}

let xPlayed = [];
let oPlayed = [];

gameCanvas.addEventListener('click', function (event) {
    var rect = gameCanvas.getBoundingClientRect();
    var x = event.clientX - rect.left;
    var y = event.clientY - rect.top;

    x = Math.floor(x / 30) * 30
    y = Math.floor(y / 30) * 30

    let newMove = [x, y]

    //after click, if it is blank, draw X or O and check if that move make win
    field.forEach(e => {
        if (e['x'] == newMove[0] && e['y'] == newMove[1] && e['icon'] == 'blank') {
            e['icon'] = turn;
            if (turn == "X") {
                xPlayed.push(newMove);

                //check 4 direction from top to bottom and left to right
                var horizontalX = checkWinMove(xPlayed, 6 , 10, 1 , 0, 0);
                var diagonal1X = checkWinMove(xPlayed, 6, 6, 1, 1, 0);
                var verticalX = checkWinMove(xPlayed, 10, 6, 0, 1, 0);
                var diagonal2X = checkWinMove(xPlayed, 10, 6, -1, 1, 4);

                //after click one, change turn to O
                turn = "O";
                document.getElementById("turn").innerHTML = "O's Turn";

                //if one of the 4 directions is true, tell that player X wins
                if(horizontalX || diagonal1X || verticalX || diagonal2X){
                    win = true;
                }
                if(win){
                    winningMessageTextElement.innerText = "X wins";
                    winningMessageElement.classList.remove('show');
                }

            } 
            else {
                oPlayed.push(newMove);

                //check 4 direction from top to bottom and left to right
                var horizontalO = checkWinMove(oPlayed, 6 , 10, 1 , 0, 0);
                var diagonal1O = checkWinMove(oPlayed, 6, 6, 1, 1, 0);
                var verticalO = checkWinMove(oPlayed, 10, 6, 0, 1, 0);
                var diagonal2O = checkWinMove(oPlayed, 10, 6, -1, 1, 4);

                //after click one, change turn to X
                turn = "X";
                document.getElementById("turn").innerHTML = "X's Turn";

                //if one of the 4 directions is true, tell player O wins
                if(horizontalO || diagonal1O || verticalO || diagonal2O){
                    win = true;
                }
                if (win) {
                    winningMessageTextElement.innerText = "O wins";
                    winningMessageElement.classList.remove('show');
                }
                if (oPlayed.length == 50 && !win){
                    winningMessageTextElement.innerText = "DRAW";
                    winningMessageElement.classList.remove('show');
                }
                
            }
        }
    });

    drawGameField();
    drawXO();

}, false);

drawGameField();

function drawGameField() {
    ctx.fillStyle = CANVAS_BACKGROUND_COLOUR;
    ctx.strokestyle = CANVAS_BORDER_COLOUR;
    ctx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);
    ctx.strokeRect(0, 0, gameCanvas.width, gameCanvas.height);

    field.forEach(e => {
        ctx.fillRect(e['x'], e['y'], 30, 30);
        ctx.strokeRect(e['x'], e['y'], 30, 30);
    });
}

function drawXO() {
    ctx.fillStyle = 'black';
    // draw X or O when clicked
    field.forEach(e => {
        ctx.font = "30px Arial";
        if (e['icon'] == "X") {
            ctx.strokeText("X", e['x'] + 5, e['y'] + 25);
        } 
        else if (e['icon'] == "O") {
            ctx.strokeText("O", e['x'] + 3, e['y'] + 25);
        }
    });
}

//check win by finding the elements needed in the played array
function checkWinMove(array, rangeX, rangeY, plusX, plusY, start) {
    var a = JSON.stringify(array);
    var count = 0;
    for (var i = start; i < rangeX; i++){
        for (var j = 0; j < rangeY; j++){
            count = 0;
            var m = i;
            var n = j;
            for(var k =0; k < 5; k++){
                var b = JSON.stringify([m * 30, n * 30]);
                var truefalse = a.indexOf(b);
                // if there is no element needed, break
                if(truefalse == -1){
                    break;
                }
                // if there is element needed, continue with that direction
                else {
                    m += plusX;
                    n += plusY;
                    count ++;
                    //if 5 element continuous, win
                    if (count == 5){
                        return true;
                    }
                }
            }
        }
    }
}

//if click on restart button after one wins or draw, restart the game
restartButton.addEventListener('click', restart);

// restart function
function restart() {
    //reset x and o played 
    xPlayed = [];
    oPlayed = [];
    win = false;
    turn = "X";
    winningMessageTextElement.innerText = "";
    winningMessageElement.classList.add('show');
    //draw field
    field = [];
    for (var i = 0; i < canvasWidth; i += 30) {
        for (var j = 0; j < canvasHeight; j += 30) {
            field.push({ 'x': j, 'y': i, "icon": "blank" })
        }
    }
    document.getElementById("turn").innerHTML = "X's Turn";
    drawGameField();
    drawXO();
}