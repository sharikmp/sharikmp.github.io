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
	
	window.location='#tictactoe-board';
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
	crossedCells = [];

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
		setNextPlayer();
		
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
	//console.log(outerBoardStatus + "");
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
			//currentPlayer = 'O';
		} else {
			cell.innerHTML = player;
			document.getElementById("next-turn").innerHTML = 'Next turn: X';
			//currentPlayer = 'X';
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
			////console.log(i);
		}

	}
}
/******************* X X X X X X X X X X X X X X X X X X X X X X X X X X X X X  ****************************************/


/*********************************** FUNCTION TO GET BOARD ELEMENT *****************************************************/
function getBoardElement() {

	var start = currentMiniBoardNum * 10 + 1;					//console.log('Mini Board Num: ' + currentMiniBoardNum);
	var end = start + 9;
	var board = [];

	for (var i = start; i < end; i++) {
		var cell = document.getElementById(i + '');
		board.push(cell.innerHTML);
	}
														//console.log('Mini Board: ' + board);
	return board;
}
/******************* X X X X X X X X X X X X X X X X X X X X X X X X X X X X X  ****************************************/


/*********************************** FUNCTION TO GAME STATUS ***********************************************************/
function setGameStatus() {
	gameStatus = mainBoardStatus(outerBoardStatus);
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
	var CELL_ID = cellId + '';					//console.log('Current Mini board: ' + CELL_ID.charAt(1));
	return CELL_ID.charAt(0);
}
/******************* X X X X X X X X X X X X X X X X X X X X X X X X X X X X X  ****************************************/


/*********************************** FUNCTION TO GET MINI BOARD NUMBER (1-9) BASED ON CLICKED CELL ID ******************/
function getNextMiniBoardNum(cellId) {
	var CELL_ID = cellId + '';					//console.log('cellId: ' + cellId);
	return CELL_ID.charAt(1);					//console.log('Next Mini board: ' + CELL_ID.charAt(1));
}
/******************* X X X X X X X X X X X X X X X X X X X X X X X X X X X X X  ****************************************/


/*********************************** FUNCTION TO HIGHLIGHT MINI BOARD BASED ON WINNING STATUS *************************/
function highlightCells() {
	
		for (var i = 0; i < crossedCells.length; i++) {
			var player = crossedCells[i][crossedCells[i].length-1]; 
			
			var colour = "rgba(255, 0, 0, 0.5";
			if( player === 'X'){
				colour = "rgba(0, 0, 255, 0.4)";
			}
			else if ( player === 'O'){
				colour = "rgba(255, 0, 0, 0.5)";
			}
			else if ( player === 'XO'){
				colour = "rgba(255, 255, 0, 0.5)";
			}
			
			for( var j = 0; j < crossedCells[i].length - 1; j++){
				//console.log('crossedCells[' + i + '][' + j + ']: ' + crossedCells[i][j]);
				document.getElementById(crossedCells[i][j] + '').style.backgroundColor = colour;
			}
			
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
	if(currentPlayer === 'O'){
		cell.style.color = "rgb(0, 0, 255)";
	}
	else{
		cell.style.color = "rgb(255, 0, 0)";
	}
	
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
	//console.log('Random No.: ' + r);
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







/*********************************** function to check if current player has won the current mini board ********************************/
function boardStatus(b){
	
	var possibleWin = [ [0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6] ];
	
	for( var i = 0; i < possibleWin.length; i++) {

		var win = isCross(possibleWin[i][0], possibleWin[i][1], possibleWin[i][2], currentPlayer, b);	
		if( win != '&nbsp;' ){
			return win;
		}
		
	}
	
	var drawCell = [];
	//if the board is not yet won, so if there is any empty cell then it means the mini board in not yet decided
	for(i = 0; i < 9; i++){
		if( b[i] === '&nbsp;'){
			return '&nbsp;';	//if any cell is empty that mean board is not yet Draw, so return status empty
		}
		drawCell.push(currentMiniBoardNum + '' + (i+1));
	}
	drawCell.push('XO');
	crossedCells.push(drawCell);
	return 'XO'; 			//Since board is not yet won and is also not empty then it's draw (XO)
	
	
	function isCross(c1, c2, c3, p, b){
		
		var crossedCell = [];
		if( b[c1++] === p && b[c2++] === p && b[c3++] === p ){
			crossedCell = [currentMiniBoardNum + '' + c1, currentMiniBoardNum + '' + c2, currentMiniBoardNum + '' + c3, p];
			crossedCells.push(crossedCell);					//console.log("crosed: " + crossedCells);
			return p;
		}
		
		return '&nbsp;';
	}

}




/*********************************** function to check if current player has won the game ********************************/
function mainBoardStatus(b){
	
	var possibleWin = [ [0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6] ];
	
	for( var i = 0; i < possibleWin.length; i++) {

		var win = isCross(possibleWin[i][0], possibleWin[i][1], possibleWin[i][2], currentPlayer, b);	
		if( win != '&nbsp;' ){
			return win;
		}
		
	}
	
	//if the board is not yet won, so if there is any empty cell then it means the mini board in not yet decided
	for(i = 0; i < 10; i++){
		if( b[i] === '&nbsp;'){
			return '&nbsp;';	//if any cell is empty that mean board is not yet Draw, so return status empty
		}
	}
	
	return 'XO'; 			//Since board is not yet won and is also not empty then it's draw (XO)
	
	
	function isCross(c1, c2, c3, p, b){
		
		if( b[c1++] === p && b[c2++] === p && b[c3++] === p ){
			return p;
		}
		
		return '&nbsp;';
	}

}


function setNextPlayer(){

	if (currentPlayer === 'X') {
		currentPlayer = 'O';
	} 
	else {
		currentPlayer = 'X';
	}
}
