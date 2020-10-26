/******************************** GLOBAL VARIABLES FOR STORING GAME STATUS *******************************************/

var outerBoardStatus = ['&nbsp;', '&nbsp;', '&nbsp;', '&nbsp;', '&nbsp;', '&nbsp;', '&nbsp;', '&nbsp;', '&nbsp;'];
var crossedCells = [];
var gameStatus = '&nbsp;'; //GAME STATUS IDENTIFIED BY '&nbsp;'/'X'/'O'/'XO'
var currentPlayer = 'X'; //STORES CURRENT PLAYER
var lastMove; //STORES LAST MOVE IN THE GAME
var gameMode = 1; //DEFAULT GAME MODE IS SINGLE PLAYER
var currentMiniBoardNum = 5; //FIRST MINI BOARD, RANGE 1 TO 9


/*************************** FUNCTION TO SET GAME MODE  ***************************************************************/
function setGameMode(mode) {

	initializeGame();
	if (mode == 1) { //SINGLE PLAYER
		gameMode = 1;
		document.getElementById("player-X").innerHTML = 'You - "X"';
		document.getElementById("player-O").innerHTML = 'Computer - "O"';
	} else if (mode == 2) { //TWO PLAYER
		gameMode = 2;
		document.getElementById("player-X").innerHTML = 'Player - "X"';
		document.getElementById("player-O").innerHTML = 'Player - "O"';
	} else if (mode == 3) { //PLAYER WITH FRIEND
		gameMode = 3;
		document.getElementById("player-X").innerHTML = 'Player - "X"';
		document.getElementById("player-O").innerHTML = 'Player - "O"';
	}
}
/******************* X X X X X X X X X X X X X X X X X X X X X X X X X X X X X  ****************************************/


/******************* FUNCTION TO INITIALIZE / RESET GAME ****************************************************************/
function initializeGame() {

	//SET GAME STATUS TO NOT DECIDED
	gameStatus = '&nbsp;';


	//SET ALL MINI BOARD STATUS TO NOT DECIDED
	outerBoardStatus = ['&nbsp;', '&nbsp;', '&nbsp;', '&nbsp;', '&nbsp;', '&nbsp;', '&nbsp;', '&nbsp;', '&nbsp;'];


	//SET ALL CELLS TO BLANK
	for (var i = 11; i <= 99; i++) {
		if (i % 10 !== 0) {
			document.getElementById(i + '').innerHTML = '&nbsp;';
		}
	}


	//DISABLE ALL MINI BOARD EXCEPT MIDDLE BOARD (BOARD - 5)
	for (var i = 1; i <= 9; i++) {
		if (i == 5) {
			enableCell(i);
		} else {
			disableCell(i);
		}
	}

	//SET FIRST PLAYER AS 'X'
	document.getElementById("next-turn").innerHTML = 'Start: X';
	currentPlayer = 'X';
}
/******************* X X X X X X X X X X X X X X X X X X X X X X X X X X X X X  ****************************************/


/******************* FUNCTION TO TO CONTROL GAME WHEN A CELL IS CLICKED ***********************************************/
function onCellClick(cellId) {

	var isXOSet = setXO(cellId); //IF IT'S A VALID CLICK, SET 'X' OR 'O' AND RETURN TRUE, ELSE FALSE

	if (isXOSet) { //IF IT'S A VALID CLICK

		currentMiniBoardNum = getCurrentMiniBoardNum(cellId); //GET MINI BOARD NUMBER (1-9) WITH CELL ID OF THE CLICKED CELL 
		lastMove = cellId; //STORE CELL ID AS LAST MOVE
		setOuterBoardStatus(); //SET OUTER BOARD STATUS IN GLOBAL VARIABLE "outerBoardStatus"
		setGameStatus(); //SET GAME STATUS IN GLOBAL VARIABLE "gameStatus"

		if (gameStatus === '&nbsp;') {
			enableCellForNextMove(cellId); //ENABLE ONE BOARD FOR NEXT PLAYER
			highlightCells(); //HIGHLIGHT CELLS OF WINNER'S BOARD 
			highlightLastMove(); //HIGHLIGHT LAST MOVE
		} else {
			setWinner(cellId); //DECLARE WINNER'S
		}
	}

	//IF IT'S COMPUTER'S TURN
	if (gameMode == 1 && gameStatus === '&nbsp;' && currentPlayer === 'O') {
		var cell = getRandomEmptyCell(cellId); //GET A RANDOM CELL WHICH IS EMPTY
		onCellClick(cell); //PERFORM ALL FUNCTION AFTER A CLICK IS MADE BY COMPUTER
	}
	console.log(outerBoardStatus);
}
/******************* X X X X X X X X X X X X X X X X X X X X X X X X X X X X X  ****************************************/


/*********************************** FUNCTION TO SET 'X' OR 'O' IF THE CLICK IS VALID **********************************/
function setXO(cellId) {
	var cell = document.getElementById(cellId);
	if (cell.innerHTML === '&nbsp;' && gameStatus === '&nbsp;') {
		var player = currentPlayer;
		if (player === 'X') {
			cell.innerHTML = player;
			document.getElementById("next-turn").innerHTML = 'Next turn: O';
			currentPlayer = 'O';
		} else {
			cell.innerHTML = player;
			document.getElementById("next-turn").innerHTML = 'Next turn: X';
			currentPlayer = 'X';
		}

		return true;
	}
	return false;
}
/******************* X X X X X X X X X X X X X X X X X X X X X X X X X X X X X  ****************************************/


/*********************************** FUNCTION TO SET OUTER BOARD STATUS ************************************************/
function setOuterBoardStatus() {

	var board = getBoardElement();
	var currStatus = boardStatus(board);
	outerBoardStatus[currentMiniBoardNum - 1] = currStatus;

}
/******************* X X X X X X X X X X X X X X X X X X X X X X X X X X X X X  ****************************************/


/*********************************** function to enable board(s) for next move  ****************************************/
function enableCellForNextMove(cellId) {
	if (outerBoardStatus[getNextMiniBoardNum(cellId) - 1] === '&nbsp;') { //if current board is active

		for (var i = 1; i < 10; i++) {
			if (i == getNextMiniBoardNum(cellId)) { //Enable only next board
				enableCell(i);
			} else {
				disableCell(i);
			}
		}

	} else { //Enable all active boards

		for (var i = 1; i < 10; i++) {
			if (outerBoardStatus[i - 1] === '&nbsp;') {
				enableCell(i);
			} else {
				disableCell(i);
			}
			//console.log(i);
		}

	}
}
/******************* X X X X X X X X X X X X X X X X X X X X X X X X X X X X X  ****************************************/


/*********************************** FUNCTION TO GET BOARD ELEMENT *****************************************************/
function getBoardElement() {

	var start = currentMiniBoardNum * 10 + 1;					console.log('Mini Board Num: ' + currentMiniBoardNum);
	var end = start + 9;
	var board = [];

	for (var i = start; i < end; i++) {
		var cell = document.getElementById(i + '');
		board.push(cell.innerHTML);
	}
														console.log('Mini Board: ' + board);
	return board;
}
/******************* X X X X X X X X X X X X X X X X X X X X X X X X X X X X X  ****************************************/


/*********************************** FUNCTION TO GAME STATUS ***********************************************************/
function setGameStatus() {
	gameStatus = boardStatus(outerBoardStatus);
}
/******************* X X X X X X X X X X X X X X X X X X X X X X X X X X X X X  ****************************************/


/******************* FUNCTION TO DISABLE A MINI BOARD IDENTIFIED BY CELL NUMBER (1-9)  *********************************/
function disableCell(boardNum) {
	var start = boardNum * 10 + 1;
	var end = start + 9;
	for (var i = start; i < end; i++) {
		var cell = document.getElementById(i + '');
		cell.style.pointerEvents = 'none';
		cell.style.backgroundColor = "rgba(255, 0, 0, 0.3)";
	}
}
/******************* X X X X X X X X X X X X X X X X X X X X X X X X X X X X X  ****************************************/


/******************* FUNCTION TO ENABLE A MINI BOARD IDENTIFIED BY CELL NUMBER (1-9)  **********************************/
function enableCell(boardNum) {
	//Enable given cells
	var start = boardNum * 10 + 1;
	var end = start + 9;
	for (var i = start; i < end; i++) {
		var cell = document.getElementById(i + '');
		cell.style.pointerEvents = 'auto';
		cell.style.backgroundColor = "rgba(0, 100, 0, 0.5)";
	}
}
/******************* X X X X X X X X X X X X X X X X X X X X X X X X X X X X X  ****************************************/


/*********************************** FUNCTION TO GET MINI BOARD NUMBER (1-9) BASED ON CLICKED CELL ID ******************/
function getCurrentMiniBoardNum(cellId) {
	var CELL_ID = cellId + '';					console.log('Current Mini board: ' + CELL_ID.charAt(1));
	return CELL_ID.charAt(0);
}
/******************* X X X X X X X X X X X X X X X X X X X X X X X X X X X X X  ****************************************/


/*********************************** FUNCTION TO GET MINI BOARD NUMBER (1-9) BASED ON CLICKED CELL ID ******************/
function getNextMiniBoardNum(cellId) {
	var CELL_ID = cellId + '';					console.log('cellId: ' + cellId);
	return CELL_ID.charAt(1);					console.log('Next Mini board: ' + CELL_ID.charAt(1));
}
/******************* X X X X X X X X X X X X X X X X X X X X X X X X X X X X X  ****************************************/


/*********************************** FUNCTION TO HIGHLIGHT MINI BOARD BASED ON WINNING STATUS *************************/
function highlightCells() {

	for (var i = 1; i < 10; i++) {
		if (outerBoardStatus[i - 1] === 'XO') {
			highlightWonCell(i, "rgba(255, 255, 0, 0.5)");
		} else if (outerBoardStatus[i - 1] === 'O') {
			highlightWonCell(i, "rgba(0, 0, 255, 0.4)");
		} else if (outerBoardStatus[i - 1] === 'X') {
			highlightWonCell(i, "rgba(255, 0, 255, 0.4)");
		}
	}
}
/******************* X X X X X X X X X X X X X X X X X X X X X X X X X X X X X  ****************************************/


/*********************************** function to highlight won board  *************************************************/
function highlightWonCell(cellNum, color) {

	//Enable given cells
	var start = cellNum * 10 + 1;
	var end = start + 9;
	for (var i = start; i < end; i++) {
		var cell = document.getElementById(i + '');
		cell.style.pointerEvents = 'none';
		cell.style.backgroundColor = color;
	}
}
/******************* X X X X X X X X X X X X X X X X X X X X X X X X X X X X X  ****************************************/


/*********************************** FUNCTION TO HIGHLIGHT LAST MOVE ***************************************************/
function highlightLastMove() {
	var cell;
	for (var i = 11; i <= 99; i++) {
		if (i % 10 != 0) {
			cell = document.getElementById(i + '');
			cell.style.color = "rgb(0, 0, 0)";
		}
	}
	cell = document.getElementById(lastMove + '');
	cell.style.color = "rgb(0, 0, 255)";
}
/******************* X X X X X X X X X X X X X X X X X X X X X X X X X X X X X  ****************************************/


/*********************************** FUNCTION TO GET RANDOM EMPTY CELL FOR COMPUTER'S MOVE *****************************/
function getRandomEmptyCell(cellId) {
	var cellNum = getNextMiniBoardNum(cellId);
	var start = cellNum * 10 + 1;
	var end = start + 9;

	while (outerBoardStatus[cellNum - 1] != '&nbsp;') {
		cellNum = getActiveBoardNumber();
		start = cellNum * 10 + 1;
		end = start + 9;
	}

	var r = randomNumber(start, end);
	console.log('Random No.: ' + r);
	while (r % 10 == 0 || document.getElementById(r + '').innerHTML != '&nbsp;') {
		r = randomNumber(start, end);
	}

	return r;
}
/******************* X X X X X X X X X X X X X X X X X X X X X X X X X X X X X  ****************************************/


/*********************************** FUNCTION TO GET RANDOM ACTIVE BOARD FOR COMPUTER'S MOVE ***************************/
function getActiveBoardNumber() {
	var r = randomNumber(1, 9);
	while (outerBoardStatus[r - 1] != '&nbsp;') {
		r = randomNumber(1, 9);
	}
	return r;
}
/******************* X X X X X X X X X X X X X X X X X X X X X X X X X X X X X  ****************************************/



/*********************************** FUNCTION TO GET RANDOM NUMBER IN A RANGE ******************************************/
function randomNumber(min, max) {
	return Math.round(Math.random() * (max - min) + min);
}
/******************* X X X X X X X X X X X X X X X X X X X X X X X X X X X X X  ****************************************/






function setWinner(cellId){
	
		highlightCells();
		highlightLastMove(cellId);
		
		if(gameStatus === 'X'){
				
			//X won
			document.getElementById("next-turn").innerHTML = '"X" Won!';
			
		}
		else if(gameStatus === 'O'){
				
			//O won
			document.getElementById("next-turn").innerHTML = '"O" Won!';
			
		}
		else if(gameStatus === 'XO'){
				
			//Game Draw
			document.getElementById("next-turn").innerHTML = 'Game Draw!';
		}
}







/*********************************** function to check if current player has won ********************************/
function boardStatus(b){

	/**** Check for 'X' ****/ 
	//ROW CROSSED
	if( ( (b[0] === 'X' && b[0] === b[1] && b[1] == b[2])
			|| (b[3] === 'X' && b[3] === b[4] && b[4] == b[5])
			|| (b[6] === 'X' && b[6] === b[7] && b[7] == b[8]) ) ){
		console.log('ROW CROSSED');
		return 'X';
	}
	//COLUMN CROSSED
	if( ( (b[0] === 'X' && b[0] === b[3] && b[3] == b[6])
			|| (b[1] === 'X' && b[1] === b[4] && b[4] == b[7])
			|| (b[2] === 'X' && b[2] === b[5] && b[5] == b[8]) ) ){
		console.log('COLUMN CROSSED');
		return 'X';
	}
	//DIAGONAL CROSSED
	if( (b[4] === 'X')
			&& ( (b[0] === b[4] && b[4] == b[8]) || (b[2] === b[4] && b[4] == b[6]) ) ){
		console.log('DIAGONAL CROSSED');
		return 'X';
	}
	
	/**** Check for 'O' ****/ 
	
	//ROW CROSSED
	if( ( (b[0] ===  'O' && b[0] === b[1] && b[1] == b[2])
			|| (b[3] ===  'O' && b[3] === b[4] && b[4] == b[5])
			|| (b[6] ===  'O' && b[6] === b[7] && b[7] == b[8]) ) ){
		console.log('ROW CROSSED');
		return  'O';
	}
	//COLUMN CROSSED
	if( ( (b[0] ===  'O' && b[0] === b[3] && b[3] == b[6])
			|| (b[1] ===  'O' && b[1] === b[4] && b[4] == b[7])
			|| (b[2] ===  'O' && b[2] === b[5] && b[5] == b[8]) ) ){
		console.log('COLUMN CROSSED');
		return  'O';
	}
	//DIAGONAL CROSSED
	if( (b[4] ===  'O')
			&& ( (b[0] === b[4] && b[4] == b[8]) || (b[2] === b[4] && b[4] == b[6]) ) ){
		console.log('DIAGONAL CROSSED');
		return  'O';
	}
	
	/*** Check for empty cell ***/
	
	for(i = 0; i < 10; i++){
		if( b[i] === '&nbsp;'){
			//console.log('Board is not yet Draw, so return status empty');
			return '&nbsp;';	//if any cell is empty that mean board is not yet Draw, so return status empty
		}
	}
	
	return 'XO'; 			//Since board is not yet won and is also not empty then it's draw (XO)
}



