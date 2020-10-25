var outerBoardStatus = ['&nbsp;', '&nbsp;', '&nbsp;', '&nbsp;', '&nbsp;', '&nbsp;', '&nbsp;', '&nbsp;', '&nbsp;'];
var gameStatus = '&nbsp;';
var currentPlayer = 'X';
var lastMove;

var isSinglePlayer = false;

/********* function to set game mode **********/
function setGameMode(mode){
	gameStatus = '&nbsp;';
	resetAllElements();
	if( mode == 1){
		isSinglePlayer = true;
		document.getElementById("player-X").innerHTML = 'You - "X"';
		document.getElementById("player-O").innerHTML = 'Computer - "O"';
	}
	else{
		isSinglePlayer = false;
		document.getElementById("player-X").innerHTML = 'Player - "X"';
		document.getElementById("player-O").innerHTML = 'Player - "O"';
	}
}


/******** function executed when a click is done ****************/
function onCellClick(cellId){
	
	var isXOSet = setXO(cellId); 					//Set X or O for current move

	if(isXOSet){									//If valid click
		lastMove = cellId;
		var outerBoard = getOuterBoard();			//console.log('Outer Board: ' + outerBoard);
			
		gameStatus = boardStatus(outerBoard);		//console.log('Game Status: ' + gameStatus);
		
		if(gameStatus === '&nbsp;'){
				
			var cellNum = getCellNum(cellId);
				
			enableCellForNextMove(cellNum);
			
		}
		else if(gameStatus === 'X'){
				
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
	
	highlightCells();
	
	if(isSinglePlayer && currentPlayer === 'O'){	//If it's Single player game, select a random move 
		var cell = getRandomEmptyCell(cellId);		//Get a random cell which is empty
		onCellClick(cell);
	}
	
	highlightLastMove(cellId);
	
}

/*********************************** function to get outer board element ********************************/

function getOuterBoard(){
	for(var innerBoard = 1; innerBoard < 10; innerBoard++){
		
		var board = getBoardElement(innerBoard);
		var currStatus = boardStatus(board);

		outerBoardStatus[innerBoard-1] = currStatus;
	}
	return outerBoardStatus;
}


function getBoardElement(cellNum){
	var start = cellNum * 10 + 1;
	var end = start + 9;
	var board = [];
	//console.log('From: ' + start + ' to ' + end);
	for(i=start; i<end; i++){
		var cell = document.getElementById(i+'');
		board.push(cell.innerHTML);
	}	
	return board;
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




/*********************************** function to set X or O  ********************************/
function setXO(cellId){
	var cell = document.getElementById(cellId);
	if( cell.innerHTML === '&nbsp;' && gameStatus === '&nbsp;' ){
		var player = currentPlayer;
		if( player === 'X'){
			cell.innerHTML = player;
			document.getElementById("next-turn").innerHTML = 'Next turn: O';
			currentPlayer = 'O';
		}
		else {
			cell.innerHTML = player;
			document.getElementById("next-turn").innerHTML = 'Next turn: X';
			currentPlayer = 'X';
		}
		
		return true;
	}
	return false;
}




/*********************************** function to get outer cell num (1-9) based on cell id  ********************************/
function getCellNum(cellId){
	var CELL_ID = cellId + '';
	return CELL_ID.charAt(1);
}




/*********************************** function to enable board(s) for next move  ********************************/
function enableCellForNextMove(cellNum){
	if(outerBoardStatus[cellNum-1] === '&nbsp;'){	//if current board is active
		
		for(var i = 1; i < 10; i++){
			if( i == cellNum ){							//Enable only next board
				enableCell(i);							//console.log("Enabling: " + i);
			}
			else{
				disableCell(i);							//console.log("Disabling: " + i);
			}
			
		}
		
	}
	else{	//Enable all active boards
		
		for(var i = 1; i < 10; i++){
			if( outerBoardStatus[i-1] === '&nbsp;' ){
				enableCell(i);
			}
			else{
				disableCell(i);
			}			
														//console.log(i);
		}
		
	}
}



/*********************************** function to disable inner board  ********************************/
function disableCell(cellNum){
	//Disable given cells
	var start = cellNum * 10 + 1;
	var end = start + 9;
	for(i=start; i<end; i++){
		var cell = document.getElementById(i+'');
		cell.style.pointerEvents = 'none';
		cell.style.backgroundColor = "rgba(255, 0, 0, 0.3)";
	}
}


/*********************************** function to enable inner board  ********************************/
function enableCell(cellNum){
	//Enable given cells
	var start = cellNum * 10 + 1;
	var end = start + 9;
	for(var i=start; i<end; i++){
		var cell = document.getElementById(i+'');
		cell.style.pointerEvents = 'auto';
		cell.style.backgroundColor = "rgba(0, 100, 0, 0.5)";
	}
}




/*********************************** function to highlight won board  ********************************/
function highlightWonCell(cellNum, color){
	
	//Enable given cells
	var start = cellNum * 10 + 1;
	var end = start + 9;
	for(var i=start; i<end; i++){
		var cell = document.getElementById(i+'');
		cell.style.pointerEvents = 'none';
		cell.style.backgroundColor = color;
	}
}


function highlightCells(){
	
	for(var i=1; i<10; i++){
		if(outerBoardStatus[i-1] === 'XO'){
			highlightWonCell(i, "rgba(255, 255, 0, 0.5)");
		}
		else if(outerBoardStatus[i-1] === 'O'){
			highlightWonCell(i, "rgba(0, 0, 255, 0.4)");
		}
		else if(outerBoardStatus[i-1] === 'X'){
			highlightWonCell(i, "rgba(255, 0, 255, 0.4)");
		}
	}
}


function resetAllElements(){
	var mainBoard = [];
	for(var i = 11; i <= 99; i++){
		if(i%10 != 0){
			document.getElementById(i+'').innerHTML = '&nbsp;';
		}
	}
	outerBoardStatus = ['&nbsp;', '&nbsp;', '&nbsp;', '&nbsp;', '&nbsp;', '&nbsp;', '&nbsp;', '&nbsp;', '&nbsp;'];
	for(var i = 1; i <= 9; i++){
		disableCell(i);
	}
	enableCell(5);
	document.getElementById("next-turn").innerHTML = 'Next turn: X';
	currentPlayer = 'X';
	return mainBoard;
}




/*********************  Computer's Move  **************************************************************/
function getAllElements(){
	var mainBoard = [];
	for(var i = 11; i <= 99; i++){
		if(i%10 != 0){
			mainBoard.push(document.getElementById(i+'').innerHTML);
		}
	}
	return mainBoard;
}




function getRandomEmptyCell(cellId){
	var cellNum = getCellNum(cellId);
	var start = cellNum * 10 + 1;
	var end = start + 9;
	
	if(outerBoardStatus[cellNum-1] != '&nbsp;'){
		start = 11;
		end = 99;
	}
	
	var r = randomNumber(start, end);	console.log('Random No.: ' + r);
	while( r%10 == 0 || document.getElementById(r+'').innerHTML != '&nbsp;' ){
		r = randomNumber(start, end);
	}
	
	return r;
}




function setComputersMove(cell, player){
	document.getElementById(cell+'').innerHTML = 'O';
}




function randomNumber(min, max) {  
    return Math.round(Math.random() * (max - min) + min); 
} 



function highlightLastMove(cellId){
	for(var i = 11; i <= 99; i++){
		if(i%10 != 0){
			var cell = document.getElementById(i+'');
			cell.style.color = "rgb(0, 0, 0)";
		}
	}
	var cell = document.getElementById(lastMove+'');
	cell.style.color = "rgb(0, 0, 255)";
}