

//Building the level ==== THIS NEEDS TO BE A FUNCTION ASAP ====

var currentLevel = 2;

//==The selected ball should be gold, highlight possible move spaces, and be stored in a variable for when one clicks on the move spaces. Clicking on the ball removes the default click event and adds a secondary one that will cancel the move if clicked on again. There should be a loop that builds an array of the "open" spaces available for the ball. These spaces then receive styling that changes their color to reflect their highlighting. Yellow might be good. Despite the checkered pattern, the highlighted styling should be consistent, not a dark and a light. 

//Generate the tiles used for the gameboard, a 5X5 grid

//The number of squares in the gameboard's width(columns)
var gameboardX;
//The number of squares in the gameboard's height(rows)
var gameboardY;

var levels = [
	{
		level:1,
		gameboardWidth:3,
		gameboardHeight:3,
		balls:[
			{gamePosX:1, gamePosY:1},
			{gamePosX:1, gamePosY:2},
			{gamePosX:2, gamePosY:2},
			{gamePosX:2, gamePosY:3}
		]
	},
	{
		level:2,
		gameboardWidth:5,
		gameboardHeight:5,
		balls:[
			{gamePosX:1, gamePosY:2},
			{gamePosX:2, gamePosY:3},
			{gamePosX:3, gamePosY:3},
			{gamePosX:4, gamePosY:4},
			{gamePosX:4, gamePosY:5},
			{gamePosX:5, gamePosY:2},
			{gamePosX:5, gamePosY:3},
			{gamePosX:5, gamePosY:4}
		]
	}
];

var levelLayout = levels[currentLevel - 1];
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

//Generate the game elements
window.onload = function(){
	for(i=0; i<levelLayout.balls.length; i++){
		var gamePosX = levelLayout.balls[i].gamePosX;
		var gamePosY = levelLayout.balls[i].gamePosY;
		gameboardX = levelLayout.gameboardWidth;
		gameboardY = levelLayout.gameboardHeight;
		makeBall(gamePosX, gamePosY, i);
	}
	totalBallsNeeded = levelLayout.balls.length -1;
	makeSquares();

};




//function to generate/update a game element



function makeBall(gamePosX, gamePosY, ballNumber){
	var gameAreaWidth = document.getElementById('gameboard').clientWidth;
	var gameBallWidth = Math.floor(gameAreaWidth / gameboardX);
	var gameBallRadius = gameBallWidth / 2.5;
	var gameboard = document.getElementById('gameboard');
	var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
	var circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
	svg.classList.add('gameElementBall');
	circle.classList.add('gameElementBallCircle');
	svg.gamePosX = gamePosX;
	svg.gamePosY = gamePosY;
	//The gamePos is extremely important for identification and tracking in the game.
	svg.gamePos = ((gamePosY-1)*gameboardX)+gamePosX;
	//The ballNumber is mostly useful for tracking balls in tests.
	svg.ballNumber = ballNumber;
	svg.activeBall = false;
	svg.setAttribute('width', gameBallWidth);
	svg.setAttribute('height', gameBallWidth);
	svg.style.left = (gamePosX - 1) * gameBallWidth;
	svg.style.top = (gamePosY - 1) * gameBallWidth;
	circle.setAttribute('cx', gameBallWidth/2);
	circle.setAttribute('cy', gameBallWidth/2);
	circle.setAttribute('r', gameBallRadius);
	//Setting the gradients
	var defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
	//Silver Gradient
	var radialGradient1 = document.createElementNS('http://www.w3.org/2000/svg', 'radialGradient');
	radialGradient1.setAttribute('id', 'silver');
	radialGradient1.setAttribute('cx', '50%');
	radialGradient1.setAttribute('cy', '50%');
	radialGradient1.setAttribute('r', '50%');
	radialGradient1.setAttribute('fx', '50%');
	radialGradient1.setAttribute('fy', '50%');
	var stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
	stop1.setAttribute('offset', '0%');
	stop1.setAttribute('style', 'stop-color:#dddddd');
	radialGradient1.appendChild(stop1);
	var stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
	stop2.setAttribute('offset', '100%');
	stop2.setAttribute('style', 'stop-color:#777777');
	radialGradient1.appendChild(stop2);
	//Gold gradient
	var radialGradient2 = document.createElementNS('http://www.w3.org/2000/svg', 'radialGradient');
	radialGradient2.setAttribute('id', 'gold');
	radialGradient2.setAttribute('cx', '50%');
	radialGradient2.setAttribute('cy', '50%');
	radialGradient2.setAttribute('r', '50%');
	radialGradient2.setAttribute('fx', '50%');
	radialGradient2.setAttribute('fy', '50%');
	stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
	stop1.setAttribute('offset', '0%');
	stop1.setAttribute('style', 'stop-color:#cca300');
	radialGradient2.appendChild(stop1);
	stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
	stop2.setAttribute('offset', '100%');
	stop2.setAttribute('style', 'stop-color:#4c3d00');
	radialGradient2.appendChild(stop2);
	defs.appendChild(radialGradient1);
	defs.appendChild(radialGradient2);
	svg.appendChild(defs);
	circle.setAttribute('fill', 'url(#silver)');
	//Appending the graphic to the SVG tag
	svg.appendChild(circle);
	//The moveBall method to move this ball to another square.
	svg.moveBall = function(){
		this.style.left = (this.gamePosX - 1) * gameBallWidth;
		this.style.top = (this.gamePosY - 1) * gameBallWidth;
	}
	//The checkMoves method to see legal moves for the ball. 
	svg.checkMoves = function(){
		//clear out any active squares first
		for(i=0;i<gameSquares.length;i++){
			if(gameSquares[i].activeSquare){
				gameSquares[i].jumpedBallIndex = 0;
				gameSquares[i].activeSquare = false;
				gameSquares[i].highlightSquare();
			}
		}

		//These variables check the ball selected, and the surrounding squares. 
		var baseX = this.gamePosX;
		var baseY = this.gamePosY;
		var moveUp = ((baseY-3)*gameboardX) + (baseX);
		var adjacentUp = ((baseY-2)*gameboardX) + (baseX);
		var moveDown = ((baseY+1)*gameboardX) + (baseX);
		var adjacentDown = ((baseY)*gameboardX) + (baseX);
		var moveLeft = ((baseY-1)*gameboardX) + (baseX-2);
		var adjacentLeft = ((baseY-1)*gameboardX) + (baseX-1);
		var moveRight = ((baseY-1)*gameboardX) + (baseX+2);
		var adjacentRight = ((baseY-1)*gameboardX) + (baseX+1);

		//Below, the following checks are made: 
		//1. See if the legal move is on the board.
		//2. Check to see if the square to move to is occupied.
		//3. Check to see if there is a ball in the middle to 'jump' over.
		//If successful, the square is highlighted for a legal move. 

		//Check the top
		if(baseY > 2 && this.activeBall){
			if(gameSquares[adjacentUp-1].occupied && !gameSquares[moveUp-1].occupied){
				for(i=0;i<gameBalls.length;i++){
					if(gameBalls[i].gamePos === adjacentUp){
						gameSquares[moveUp-1].jumpedBallIndex = gameBalls[i].ballNumber;
					}
				}
				gameSquares[moveUp-1].jumpedSquareIndex = adjacentUp-1;
				gameSquares[moveUp-1].activeSquare = true;
				gameSquares[moveUp-1].highlightSquare();
			}
		}
		//Check the bottom
		if(baseY < (gameboardY-1) && this.activeBall){
			if(gameSquares[adjacentDown-1].occupied && !gameSquares[moveDown-1].occupied){
				for(i=0;i<gameBalls.length;i++){
					if(gameBalls[i].gamePos === adjacentDown){
						gameSquares[moveDown-1].jumpedBallIndex = gameBalls[i].ballNumber;
					}
				}
				gameSquares[moveDown-1].jumpedSquareIndex = adjacentDown-1;
				gameSquares[moveDown-1].activeSquare = true;
				gameSquares[moveDown-1].highlightSquare();
			}
		}
		//Check to the left
		if(baseX > 2 && this.activeBall){
			if(gameSquares[adjacentLeft-1].occupied && !gameSquares[moveLeft-1].occupied){
				for(i=0;i<gameBalls.length;i++){
					if(gameBalls[i].gamePos === adjacentLeft){
						gameSquares[moveLeft-1].jumpedBallIndex = gameBalls[i].ballNumber;
					}
				}
				gameSquares[moveLeft-1].jumpedSquareIndex = adjacentLeft-1;
				gameSquares[moveLeft-1].activeSquare = true;
				gameSquares[moveLeft-1].highlightSquare();
			}
		}
		//Check to the right
		if(baseX < (gameboardX - 1) && this.activeBall){
			if(gameSquares[adjacentRight-1].occupied && !gameSquares[moveRight-1].occupied){
				for(i=0;i<gameBalls.length;i++){
					if(gameBalls[i].gamePos === adjacentRight){
						gameSquares[moveRight-1].jumpedBallIndex = gameBalls[i].ballNumber;
					}
				}
				gameSquares[moveRight-1].jumpedSquareIndex = adjacentRight-1;
				gameSquares[moveRight-1].activeSquare = true;
				gameSquares[moveRight-1].highlightSquare();
			}
		}
	}
	svg.addEventListener('click', ballClick);
	document.getElementById('gameboard').appendChild(svg);
}

function ballClick(){
	console.log('this ball number:' + this.ballNumber);
	//This sequence comes up if a ball has been selected without selecting it again.  
	if(selectedBall){
		//The last selected ball is selected again, cancelling it out. 
		if(this.ballNumber === selectedBall.ballNumber){
			currentBallCircle = document.getElementsByClassName('gameElementBallCircle')[this.ballNumber];
			currentBallCircle.setAttribute('fill', 'url(#silver)');
			this.activeBall = false;
			this.checkMoves();
			selectedBall = '';
		}
		//A new ball is selected.
		else{
		currentBallCircle = document.getElementsByClassName('gameElementBallCircle')[selectedBall.ballNumber];
		currentBallCircle.setAttribute('fill', 'url(#silver)');
		selectedBall.activeBall = false;
		//clear the old active squares

		selectedBall = this;
		currentBallCircle = document.getElementsByClassName('gameElementBallCircle')[this.ballNumber];
		currentBallCircle.setAttribute('fill', 'url(#gold)');
		this.activeBall = true;
		this.checkMoves();			
		}
	}
	//This sequence only comes up if a ball hasn't been selected this game. 
	//The first ball selected becomes the initial selected ball, set to gold.
	else{
		selectedBall = this;
		currentBallCircle = document.getElementsByClassName('gameElementBallCircle')[this.ballNumber];
		currentBallCircle.setAttribute('fill', 'url(#gold)');
		this.activeBall = true;
		this.checkMoves();
	}
}

function gameElementSquare(element, square){
	var gameAreaWidth = document.getElementById('gameboard').clientWidth;
	var gameSquareWidth = Math.floor(gameAreaWidth / gameboardX);
	element.setAttribute('width', gameSquareWidth);
	element.setAttribute('height', gameSquareWidth);
	square.setAttribute('width', gameSquareWidth);
	square.setAttribute('height', gameSquareWidth);

	if(element.gamePos%2 === 0){
		square.setAttribute('fill', '#000099');
	}else{
		square.setAttribute('fill', '#6699ff');
	}
	//Position the element
	element.style.top = (element.gamePosY - 1) * gameSquareWidth + 'px';
	element.style.left = (element.gamePosX - 1) * gameSquareWidth + 'px';
}

function makeSquares(){
	for(i=0; i<gameboardY; i++){
		var gamePosY = i + 1;
		for(j=0; j<gameboardX; j++){
			var gameboard = document.getElementById('gameboard');
			var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
			var rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
			var gamePosX = j + 1;
			svg.classList.add('gameElementSquare');
			rect.classList.add('gameElementSquareRect');
			//The properties that give the position index
			svg.gamePosY = gamePosY;
			svg.gamePosX = gamePosX;
			svg.gamePos = ((svg.gamePosY-1)*gameboardX)+svg.gamePosX;
			gameElementSquare(svg, rect);
			svg.occupied = false;
			var gameBalls = document.getElementsByClassName('gameElementBall');
			for(k=0; k<gameBalls.length; k++){
				if(svg.gamePos === gameBalls[k].gamePos){
					svg.occupied = true;
				}
			}
			//Check to see if the square is highlighted as a legal move.
			svg.activeSquare = false;
			//Set the ball index that will be affected if this square is selected. 
			svg.jumpedBallIndex = 0;
			//The jumpedSquareIndex does the same, but tracks the square that held the ball.
			svg.jumpedSquareIndex = 0;
			svg.highlightSquare = function(){
				var currentSquareRect = document.getElementsByClassName('gameElementSquareRect')[this.gamePos - 1];
				if(!this.activeSquare){
					if(this.gamePos%2 === 0){
						currentSquareRect.setAttribute('fill', '#000099');
						this.activeSquare = false;
					}
					else{
						currentSquareRect.setAttribute('fill', '#6699ff');
						this.activeSquare = false;
					}
				}
				else if(this.activeSquare){
					currentSquareRect.setAttribute('fill', '#d63333');
				}
			};
			svg.onclick = function(){
				console.log('occupied?:' + this.occupied);
				if(this.activeSquare && selectedBall){
					console.log(this.jumpedBallIndex);
					gameSquares[selectedBall.gamePos-1].occupied = false;
					//Always refresh all positional properties of a moved element.
					selectedBall.gamePosX = this.gamePosX;
					selectedBall.gamePosY = this.gamePosY;
					selectedBall.gamePos = ((selectedBall.gamePosY-1)*gameboardX)+selectedBall.gamePosX;
					selectedBall.moveBall();
					gameSquares[this.jumpedSquareIndex].occupied = false;
					gameBalls[this.jumpedBallIndex].style.left='-999px';

					for(i=0;i<gameSquares.length;i++){
						if(gameSquares[i].activeSquare){
							gameSquares[i].jumpedBallIndex = 0;
							gameSquares[i].jumpedSquareIndex = 0;
							gameSquares[i].activeSquare = false;
							gameSquares[i].highlightSquare();
						}
					}
					currentBallCircle.setAttribute('fill', 'url(#silver)');
					selectedBall.activeBall = false;
					selectedBall = '';
					currentBallCircle = '';
					this.occupied = true;
					
				}
			}
			svg.appendChild(rect);
			gameboard.appendChild(svg);
		}
	}
}

//======================

//Generate the game spheres

function gamePosition(gameElement){
	var gameboardWidth = document.getElementById('gameboard').clientWidth;
	gameElement.style.width = 0;
	gameElement.style.height = gameboardWidth / gameboardX;
}

//Refresh all gameboard elements on window resize

