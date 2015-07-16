

//The number of squares in the gameboard's width(columns)
var gameboardX;
//The number of squares in the gameboard's height(rows)
var gameboardY;

var levels = [
	{
		level:0,
		password:'LEVELZERO',
		gameboardSquaresX:5,
		gameboardSquaresY:5,
		balls:[
			{gamePosY:3, gamePosX:3}
		]
	},
	{
		level:1,
		password:'BEGINNER',
		gameboardSquaresX:5,
		gameboardSquaresY:5,
		balls:[
			{gamePosY:3, gamePosX:1},
			{gamePosY:3, gamePosX:2},
			{gamePosY:3, gamePosX:4},
			{gamePosY:3, gamePosX:5},
			{gamePosY:4, gamePosX:4},
			{gamePosY:5, gamePosX:4}
		]
	},
	{
		level:2,
		password:'PRACTICE',
		gameboardSquaresX:5,
		gameboardSquaresY:5,
		balls:[

			{gamePosY:2, gamePosX:1},
			{gamePosY:2, gamePosX:2},
			{gamePosY:2, gamePosX:4},
			{gamePosY:3, gamePosX:1},
			{gamePosY:3, gamePosX:2},
			{gamePosY:3, gamePosX:5},
			{gamePosY:4, gamePosX:4}
		]
	},	
	{
		level:3,
		password:'JUMPER',
		gameboardSquaresX:5,
		gameboardSquaresY:5,
		balls:[

			{gamePosY:2, gamePosX:1},
			{gamePosY:2, gamePosX:2},
			{gamePosY:2, gamePosX:3},
			{gamePosY:2, gamePosX:5},
			{gamePosY:3, gamePosX:1},
			{gamePosY:3, gamePosX:2},
			{gamePosY:3, gamePosX:4}
		]
	},
	{
		level:4,
		password:'ROOKIE',
		gameboardSquaresX:5,
		gameboardSquaresY:5,
		balls:[
			{gamePosY:1, gamePosX:2},
			{gamePosY:1, gamePosX:4},
			{gamePosY:2, gamePosX:2},
			{gamePosY:2, gamePosX:4},
			{gamePosY:3, gamePosX:1},
			{gamePosY:3, gamePosX:2},
			{gamePosY:3, gamePosX:4},
			{gamePosY:3, gamePosX:5}
		]
	},
	{
		level:5,
		password:'DOUGHNUT',
		gameboardSquaresX:5,
		gameboardSquaresY:5,
		balls:[
			{gamePosY:1, gamePosX:2},
			{gamePosY:2, gamePosX:2},
			{gamePosY:2, gamePosX:4},
			{gamePosY:3, gamePosX:3},
			{gamePosY:3, gamePosX:4},
			{gamePosY:4, gamePosX:3},
			{gamePosY:4, gamePosX:4},
			{gamePosY:4, gamePosX:5}
		]
	}	
];

//Building the level

var currentLevel = 1;
var gameboard = document.getElementById('gameboard');

var gameSquares = document.getElementsByClassName('gameElementSquare');
var gameBalls = document.getElementsByClassName('gameElementBall');
//The currently selected game piece. 
var selectedBall;
//The accompanying circle element for its parent SVG selectedBall
var currentBallCircle;
//The total number of balls that have been jumped. Basically, the "score" for a level.
var totalJumpedBalls;
//The total number of balls needed to be jumped for a level. 
var totalBallsNeeded; 
var killScreen;

//Generate the game elements
window.onload = level.buildLevel(1);
window.onresize = function(){
	level.refresh;
}
document.getElementById('button1').addEventListener('click', level.resetLevel);
document.getElementById('button2').addEventListener('click', level.newGame);

//function to generate/update a game element

//======================

//Generate the game spheres

function gamePosition(gameElement){
	var gameboardWidth = document.getElementById('gameboard').clientWidth;
	gameElement.style.width = 0;
	gameElement.style.height = gameboardWidth / gameboardX;
}

//Refresh all gameboard elements on window resize

