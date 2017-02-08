/*******************
/* GLOBAL VARIABLES
*******************/
var row1_cell1,
	row1_cell2,
	row1_cell3,
	row2_cell1,
	row2_cell2,
	row2_cell3,
	row3_cell1,
	row3_cell2,
	row3_cell3;

// Set all cell values to ""
row1_cell1 = row1_cell2 = row1_cell3 = row2_cell1 = row2_cell2 =
row2_cell3 = row3_cell1 = row3_cell2 = row3_cell3 = "";

var boardArray = [[row1_cell1, row1_cell2, row1_cell3],
				  [row2_cell1, row2_cell2, row2_cell3],
				  [row3_cell1, row3_cell2, row3_cell3]];

var markers = {
	ex: "X",
	oh: "O"
}
var mode = "";
var currentMarker = "";
var currentPlayer = "Player 1";
var startingPlayer = "Player 1";	// To keep track of who starts each game
var gameOver = false;				
var winningSequence = "";  // Captures actual win sequence
var winningArr = [];	   // Sequence pushed to array for iterating	
var p1Marker = "";
var p2Marker = "";
var player1Score = 0;
var player2Score = 0;
var potentialWinSequence = "";	// Captures a potential win (for pVc mode)
var potentialWinMarker = "";	// Captures X or O as potential winner (for pVc mode)
var potentialWinArr = [];		// Potential sequence is pushed to array (for pVc mode)
var computerCanWin = false;
var sounds = {
	move: "assets/sounds/click.mp3",
	close: "assets/sounds/close.mp3",
	lose: "assets/sounds/lose.mp3",
	win: "assets/sounds/win.mp3"
}

var turn = 0;

/******************
/* MAIN FUNCTIONS
******************/
function playGame(boardID) {

	placeMark(boardID);
	checkForWinner();
}

// Computer "AI"
function computerTurn() {

	checkPotentialWinner();				
	if (potentialWinSequence !== "") {	// If a win is available...
		
		var selector;
		var selectorVal;
		
		for (var i = 0, len = potentialWinArr.length; i < len; i++) {  // Loop through potentialWinArr to find blank spot
		
			selector = "#" + potentialWinArr[i];
			selectorVal = $(selector).text();

			if (selectorVal === "" && potentialWinMarker === p2Marker) { // Prioritize winning over blocking
				placeMark(potentialWinArr[i]);
				checkForWinner();
				$(".board").removeClass("unclickable");
				return;
			} else if (selectorVal === "") {	// If win isn't an option, block player from winning
				placeMark(potentialWinArr[i]);
				checkForWinner();
				$(".board").removeClass("unclickable");
				return;
			};
		}
	} else {	// If no win available, choose randomly
		chooseRandom();
	}
}

// Computer picks open board space at random
function chooseRandom() {
	
	var row = generateRandomNumber();
	var col = generateRandomNumber();
	var boardID = "r" + (row + 1) + "c" + (col + 1);

	if (boardArray[row][col] !== "") { // If space is occupied, computer picks again
		chooseRandom();
	} else {
		placeMark(boardID);
		checkForWinner();
		$(".board").removeClass("unclickable");
	}
}

// Generates random number for row and column
function generateRandomNumber() {
	var number = Math.floor(Math.random() * 3);
	return number;
}
/*************************
/* FUNCTIONS FOR SWAPPING 
/* TURNS AND MARKING BOARD
*************************/
function playSound(source) {
	var audio = document.getElementById("sound");
	audio.src = sounds[source];
	audio.play();
}

// Initial set of marker and transition to next screen
function setMarker(marker) {
	if (marker === "ex") {
		currentMarker = p1Marker = markers.ex;
		p2Marker = markers.oh;
	} else {
		currentMarker = p1Marker = markers.oh;
		p2Marker = markers.ex;
	}
}

// Initially sets BG color of player box based on player marker (X or O)
function setActivePlayerBG() {
	currentMarker === markers.ex ? 
	$(".activePlayer").addClass("exBG") : 
	$(".activePlayer").addClass("ohBG");

	$(".activePlayer span").fadeIn(400);
}

// Swaps marker on each turn and changes BG of player box
function changeParams() {
	swapPlayer();
	swapMarker();
	swapBG();
	swapText();
}

// Swaps players for each turn
function swapPlayer() {
	if (mode === "pVp") {
		currentPlayer === "Player 1" ? currentPlayer = "Player 2" : currentPlayer = "Player 1";
	} else {
		currentPlayer === "Player 1" ? currentPlayer = "Computer" : currentPlayer = "Player 1";
	}
}

// Swaps the marker for the current player (X or O)
function swapMarker() {
	currentMarker === markers.ex ? currentMarker = markers.oh : currentMarker = markers.ex;
}

// Swaps the BG color of the top box for the current player (red for X or blue for O)
function swapBG() {
	var bgIsRed;
	bgIsRed = $(".activePlayer").hasClass("exBG");
	bgIsRed ? $(".activePlayer").removeClass("exBG").addClass("ohBG") :
	$(".activePlayer").removeClass("ohBG").addClass("exBG");
}

// Changes the text in the top box to reflect current player
function swapText() {
	$(".playerText").fadeOut(100, function() {
		$(this).text(currentPlayer + "'s Turn!").fadeIn(400);
	});
}

// Fill boardArray with appropriate value (X or O) and
// put mark on the board
function placeMark(elemID) {

	// Determine the current marker and change colors
	// Red for X and blue for O
	currentMarker === markers.ex ? 
	$("#" + elemID).css("color", "rgb(170, 0, 0)") : 
	$("#" + elemID).css("color", "rgb(12, 105, 255)");

	$("#" + elemID).text(currentMarker);
	$("#" + elemID).addClass("unclickable");  // Freezes location from changes

	switch(elemID) {
		case "r1c1":
			boardArray[0][0] = currentMarker;
			break;
		case "r1c2":
			boardArray[0][1] = currentMarker;
			break;
		case "r1c3":
			boardArray[0][2] = currentMarker;
			break;
		case "r2c1":
			boardArray[1][0] = currentMarker;
			break;
		case "r2c2":
			boardArray[1][1] = currentMarker;
			break;
		case "r2c3":
			boardArray[1][2] = currentMarker;
			break;
		case "r3c1":
			boardArray[2][0] = currentMarker;
			break;
		case "r3c2":
			boardArray[2][1] = currentMarker;
			break;
		case "r3c3":
			boardArray[2][2] = currentMarker;
			break;
		default:
			break;
	}
	playSound("move");
}
/***********************
/* FUNCTIONS FOR MENU
/* OR SCREEN TRANSITIONS
************************/
// Used to transition from picking marker to picking mode screens
function displayTransition() {
	$(".options").fadeOut(400);
	$(".markerTitle").fadeOut(400, function() {

		var title = "Choose Game Mode:";
		var firstOption = "<i class='icon user'></i> Player 1 <i class='icon exchange'></i> Player 2 <i class='icon user'></i>";
		var secondOption = "<i class='icon user'></i> Player <i class='icon exchange'></i> Computer <i class='icon desktop'></i>";
		var firstID = "pVp";
		var secondID = "pVc";
		var className = "mode";
		var modeString = buildString(title, firstOption, secondOption, firstID, secondID, className);

		$(modeString).hide().appendTo(".optionBox").fadeIn();
	});
}

// Helper used to construct mode screen and reset screen
function buildString(title, option1, option2, id1, id2, className) {

	var string =

			"<div class='modeTitle'>" +
				"<span>" + title + "</span>" + 
			"</div>" +
			"<div id='" + id1 + "' class='" + className + "'>" + 
				"<span>" + option1 + "</span>" +
			"</div>" +
			"<div id='" + id2 + "' class='" + className + "'>" +
				"<span>" + option2 + "</span" +
			"</div>";

	return string;
}

// Hide initial display screen after choosing option
function hideDisplay(title, option) {
	$("#initialDisplay").fadeOut(400, function() {
		$(title + ", " + option).remove();
	});
}
/***************************
/* FUNCTIONS FOR CHECKING
/* VARIOUS WINNING SCENARIOS
****************************/

// Checks horizontal, vertical, and both diagonals for winning pattern
// Will then look for a tie.  If no tie, "none" is returned
function checkForWinner() {

	var result;
	result = checkHandV("horizontal") || checkDiagonal("diagDown") || 
			 checkTie() || "none";

	result !== "none" ? displayWinner(result) : changeParams();

	// If no winner, Computer takes its turn
	if (currentPlayer === "Computer" && !gameOver) {
		$(".board").addClass("unclickable");
		setTimeout(computerTurn, 1000);
	}
}

// Checks both horizontal and vertical directions
function checkHandV(direction) {

	var checkString = "";
	var result = "";
	var blankOut = function() {
		checkString = "";
		winningSequence = "";
	}

	for (var i = 0; i <= 2; i++) {
		for (var j = 0; j <= 2; j++) {

			if (direction === "horizontal") {
				checkString += boardArray[i][j];
				winningSequence += "r" + (i + 1) + "c" + (j + 1) + " ";
			} else if (direction === "vertical") {
				checkString += boardArray[j][i];
				winningSequence += "r" + (j + 1) + "c" + (i + 1) + " ";
			}
		}

		// If string in row/columns is XXX or OOO
		if (checkString === "XXX" || checkString === "OOO") {
			winningArr = winningSequence.split(" ");
			winningArr.pop();	// Remove extra "" on the end of array after splitting
			result = checkString;
		} else if (checkString === "XX" && mode === "pVc" && !computerCanWin) {	// Only use in pVc mode and only change
			setPotentialVars(markers.ex, winningSequence);						// if computer is not in line to win
			blankOut();
		} else if (checkString === "OO" && mode === "pVc" && !computerCanWin) {
			setPotentialVars(markers.oh, winningSequence);
			blankOut();
		} else {  // If not, blank out checkString and winningSequence for next iteration
			blankOut();
		}
	}

	// Only check vertical if result is not a "win" (XXX or OOO)
	if (direction === "horizontal" && result === "") {
		result = checkHandV("vertical");
	}

	return result;
}

// Checks both diagonal directions
function checkDiagonal(direction) {
	
	var checkString = "";
	var result = "";
	var arrLen = boardArray.length - 1;
	var blankOut = function() {
		checkString = "";
		winningSequence = "";
	}

	// If string in diagonal down/diagonal up is XXX or OOO
	for (var i = 0; i <= 2; i++) {
		if (direction === "diagDown") {
			checkString += boardArray[i][i];
			winningSequence += "r" + (i + 1) + "c" + (i + 1) + " ";
		} else if (direction === "diagUp") {
			checkString += boardArray[(arrLen - i)][i];
			winningSequence += "r" + (arrLen - i + 1) + "c" + (i + 1) + " ";
		}
	}
	if (checkString === "XXX" || checkString === "OOO") {
		winningArr = winningSequence.split(" ");
		winningArr.pop();	// Remove extra "" on the end of array after splitting
		result = checkString;
	} else if (checkString === "XX" && mode === "pVc" && !computerCanWin) {	// Only use in pVc mode and only change
		setPotentialVars(markers.ex, winningSequence);						// if computer is not in line to win
		blankOut();
	} else if (checkString === "OO" && mode === "pVc" && !computerCanWin) {
		setPotentialVars(markers.oh, winningSequence);
		blankOut();
	} else {
		blankOut();
	}

	// Only check diagonal up if diagonal down is not a "win" (XXX or OOO)
	if (direction === "diagDown" && result === "") {
		result = checkDiagonal("diagUp");
	}

	return result;
}

// Initializes all potential winning variables (only useful for pVc mode)
function setPotentialVars(string, sequence) {
	string === markers.ex ? 
	potentialWinMarker = markers.ex : 
	potentialWinMarker = markers.oh;

	if (potentialWinMarker === p2Marker) {
		computerCanWin = true;
	}

	potentialWinSequence = sequence;
	potentialWinArr = potentialWinSequence.split(" ");
	potentialWinArr.pop();	// Remove extra "" on the end of array after splitting
}

function checkPotentialWinner() {
	
	var markCount = 0;

	for (var i = 0; i <= 2; i++) {
		var selector = "#" + potentialWinArr[i];
		var selectorVal = $(selector).text();
		if (selectorVal !== "") {
			markCount++;
		}
	}

	if (markCount === 3) {
		potentialWinArr = [];
		potentialWinSequence = "";
		potentialWinMarker = "";
		computerCanWin = false;
		checkHandV("horizontal");
		checkDiagonal("diagDown");
	}

}

// Checks for a tie if everything is filled out, and there is no "win"
function checkTie() {
	
	var spacesFilled = 0;
	var result = "";
	for (var i = 0; i <= 2; i++) {
		for (var j = 0; j <= 2; j++) {
			if (boardArray[i][j] !== "") {
				spacesFilled++;
			}
		}
	}
	if (spacesFilled === 9) {
		result = "tie";
	}
	return result;
}

/*********************************
/* FUNCTIONS FOR HANDLING A "WIN"
**********************************/

// Displays winner and presents reset options
function displayWinner(combo) {
	
	gameOver = true;
	currentPlayer !== "Computer" || combo === "tie" ?
	setTimeout(function() {playSound("win")}, 100) :
	setTimeout(function() {playSound("lose")}, 100);

	var title,
		firstOption,
		secondOption,
		firstID,
		secondID,
		className,
		optionString;

	if (combo === "tie") {
		title = "You Tied!";
		$(".board").hide().addClass("tied").fadeIn(400);
	} else {
		changeScore();
		title = currentPlayer + " Wins!!";
		colorSquares();
	}
	
	firstOption = "<i class='icon play'></i> Play Again";
	secondOption = "<i class='icon bomb'></i> Reset";
	firstID = "softReset";
	secondID = "hardReset";
	className = "resetOption";
	optionString = buildString(title, firstOption, secondOption, firstID, secondID, className);
	$(optionString).appendTo(".optionBox");
	$(".board").addClass("unclickable");
	setTimeout(function() {
		$("#initialDisplay").fadeIn(400);
	}, 1000);
}

// For coloring winning sequence
function colorSquares() {
	
	var selectorString = "";
	var highlightClass = "";

	currentMarker === markers.ex ? highlightClass = "exBG" : highlightClass = "ohBG";
	for (var i = 0; i < 3; i++) {
		selectorString = "#" + winningArr[i];
		$(selectorString).hide()
						 .addClass(highlightClass)
						 .addClass("highlightText")
						 .fadeIn();
	}
}

// Updating appropriate player's score
function changeScore() {

	if (currentPlayer === "Player 1") {
		player1Score = Number($(".player1Score").text());
		player1Score++;
		$(".player1Score").text(player1Score);
	} else {
		player2Score = Number($(".player2Score").text());
		player2Score++;
		$(".player2Score").text(player2Score);
	}
}
/*************************
/* RESET-RELATED FUNCTIONS
*************************/

// Used to clear boardArray of all values and wipe all Xs and Os off the board
function clearBoard() {

	var selectorString = "";

	for (var i = 0; i <= 2; i++) {
		for (var j = 0; j <= 2; j++) {
			boardArray[i][j] = "";
			selectorString = "#r" + (i + 1) + "c" + (j + 1);
			$(selectorString).text("")
							 .removeClass("highlightText ohBG exBG unclickable")
		}
	}
	$(".board").removeClass("tied unclickable");
}

// If 'Keep Playing' option is used
function softReset() {
	
	if (mode === "pVp") {
		if (startingPlayer === "Player 1") {
			currentPlayer = startingPlayer = "Player 2";
			currentMarker = p2Marker;
		} else {
			currentPlayer = startingPlayer = "Player 1";
			currentMarker = p1Marker;
		}
	} else {
		if (startingPlayer === "Player 1") {
			currentPlayer = startingPlayer = "Computer";
			currentMarker = p2Marker;
		} else {
			currentPlayer = startingPlayer = "Player 1";
			currentMarker = p1Marker;
		}
	}

	$(".playerText").text(startingPlayer + " Starts!");
	$(".activePlayer").removeClass("exBG ohBG");
	setActivePlayerBG();

	gameOver = false;
	winningSequence = "";
	winningArr = [];
	potentialWinSequence = "";
	potentialWinMarker = "";
	potentialWinArr = [];
	computerCanWin = false;
}

// If 'Reset' option is used, starts from beginning
function hardReset() {
	mode = "";
	currentMarker = "";
	currentPlayer = "Player 1";
	startingPlayer = "Player 1";
	gameOver = false;
	winningSequence = "";
	winningArr = [];
	potentialWinSequence = "";
	potentialWinMarker = "";
	potentialWinArr = [];
	computerCanWin = false;
	p1Marker = "";
	p2Marker = "";
	player1Score = 0;
	player2Score = 0;
	$(".player1Score, .player2Score").text("0");
	$(".playerText").text("Player 1's Turn!");
	$(".activePlayer").removeClass("ohBG exBG");
	clearBoard();
	$(".modeTitle, .resetOption").fadeOut(400, function() {
		$(this).remove();
		$(".markerTitle, .options").fadeIn(400);
	});
}

// Initiate entire board text values to ""
function blankBoard() {
	for (var i = 1; i <= 3; i++) {
		for (var j = 1; j <= 3; j++) {
			var selector = "#r" + i + "c" + j;
			$(selector).text("");
		}
	}
}
/*****************
/* EVENT HANDLERS
******************/

// Fades in initial screen
$(document).ready(function() {
	$("#initialDisplay").fadeIn();
	blankBoard();
});

// All clickable pieces of the board
$(".board div div").on("click", function() {
	var getBoardID = $(this).attr("id");
	playGame(getBoardID);
});

// For choosing marker on initial screen
$(".ex, .oh").on("click", function() {
	playSound("close");
	var getMarkerClass = $(this).attr("class");
	setMarker(getMarkerClass);
	displayTransition();
});

// Next 2 click events are initially set to document
// and then passed to corresponding divs (.mode and .resetOption)
// after they are created

$(document).on("click", ".mode", function() {	// Selects pVp or pVc
	playSound("close");
	mode = $(this).attr("id");
	if (mode === "pVc") {		// Instead of Player 2, this will show "Computer"
		$(".player2Title").text("Computer's Score")
	}
	hideDisplay(".modeTitle", ".mode");
	setActivePlayerBG();
})

$(document).on("click", ".resetOption", function() {	// Keep playing or reset entirely
	playSound("close");
	var option = $(this).attr("id");
	
	if (option === "hardReset"){
		hardReset();
	} else {
		softReset();
		hideDisplay(".modeTitle", ".resetOption");
		if (startingPlayer === "Computer") {	// Keep the computer from playing immediately
			clearBoard();						// after choosing to keep playing
			$(".board").addClass("unclickable");
			setTimeout(computerTurn, 1000);
		} else {
			clearBoard();
		}
	}
});