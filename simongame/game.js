var buttonColours = ["red", "blue", "green", "yellow"];
var gamePattern = [];
var userClickedPattern = [];
var level = 0;
var gameOver = true;

var patterCurrentCount = 0;

for (var i = buttonColours.length - 1; i >= 0; i--) {
	$("#"+buttonColours[i]).click(userClickHandle);
}

flash("#level-title", 3);

function startGame(startButton) {
	//Animate Start Button
	animatePress("startButton");
	//Wait for 200 milli sec display all 4 buttons
	setTimeout(function () {
		resetGame();
	}, 200);

	//Wait for 500 milli sec and then show next sequence
	setTimeout(function () {
		nextSequence();
	}, 500);

}



function userClickHandle() {

	var userChosenColour  = $(this).attr('id');

	userClickedPattern.push(userChosenColour);

	$("#" + userChosenColour).fadeOut(100).fadeIn(100);

	playSound(userChosenColour);

	animatePress(userChosenColour);

	if(userClickedPattern[patterCurrentCount] != gamePattern[patterCurrentCount]) {
		gameOver = true;
	}
	else if(userClickedPattern.length == gamePattern.length) {
		gameOver = checkAnswer();
	}
	if(!gameOver && userClickedPattern.length == gamePattern.length) {
		setTimeout(function () {nextSequence();}, 1000);
	}
	else if(gameOver) {
		gameOverScreen();
	}

	patterCurrentCount++;
}

function nextSequence() {

	level = level + 1;

	$("#level-title").text("Level - " + level);

	var randomNumber = Math.round(Math.random()*3);

	var color = buttonColours[randomNumber];

	gamePattern.push(color);

	animatePress(color);

	playSound(color);

	userClickedPattern = [];

	patterCurrentCount = 0;

	flash("#level-title", 1);
}


function playSound(id) {
	var audio = new Audio('sounds/' + id + '.mp3');
	audio.play();
}

function animatePress(currentColour) {
	$("#"+currentColour).addClass("pressed");
	setTimeout(function () {
		$("#"+currentColour).removeClass("pressed");
	}, 100)
}


function checkAnswer() {
	if(JSON.stringify(gamePattern)==JSON.stringify(userClickedPattern))
 		return false;
	
	return true;	
}

function resetGame() {
	gameOver = false;

	$("#level-title").css("font-size", "3rem");
	$("#level-title").css("color", "#FEF2BF");

	$(".container").css("display", "block");
	$(startButton).css("display", "none");

	gamePattern = [];
	userClickedPattern = [];
	level = 0;
	patterCurrentCount = 0;

	var H = window.screen.availHeight;
	var W = window.screen.availWidth;
	$(".center").css("width", W+"");
	$(".center").css("height", H+"");
	$(".center").css("margin-left", W/2+"");
	$(".center").css("margin-top", H/2+"");

}

function gameOverScreen() {
	var result = "Expected: " + gamePattern + '<br><p id="actual">' + "Actual: " + userClickedPattern + "</p>";
	$("#result").html(result);

	$(".container").css("display", "none");
	$("#startButton").css("display", "inline");
	$("#level-title").css("font-size", "2rem");
	$("#level-title").css("color", "red");
	$("#level-title").html("Game Over!");
	flash("#level-title", 3);
	var audio = new Audio("sounds/wrong.mp3");
	audio.play();
}


function flash(arg, num) {
	for (var i = num - 1; i >= 0; i--) {
		$(arg).fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100);
	}
}