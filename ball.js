(function(){

//The ballClick function defines all behavior for ball elements on the gameboard. 

		function ballClick(){
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

	var ball = {

		//The makeBall function is the constructor for ball elements. 

		makeBall: function (gamePosX, gamePosY, ballNumber, elementWidth){
			var gameAreaWidth = document.getElementById('gameboard').clientWidth;
			var gameBallWidth = elementWidth;
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
						gameSquares[i].jumpedBallIndex = null;
						gameSquares[i].activeSquare = false;
						gameSquares[i].highlightSquare();
					}
				}

				//These variables check the ball selected, and the surrounding squares. 
				var baseX = this.gamePosX;
				var baseY = this.gamePosY;

				//Below, the following checks are made: 
				//1. See if the legal move is on the board.
				//2. Check to see if the square to move to is occupied.
				//3. Check to see if there is a ball in the middle to 'jump' over.
				//If successful, the square is highlighted for a legal move. 

				//Check the top
				if(baseY > 2 && this.activeBall){
					var moveUp = ((baseY-3)*gameboardX) + (baseX);
					var adjacentUp = ((baseY-2)*gameboardX) + (baseX);
					
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
					var moveDown = ((baseY+1)*gameboardX) + (baseX);
					var adjacentDown = ((baseY)*gameboardX) + (baseX);
					
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
					var moveLeft = ((baseY-1)*gameboardX) + (baseX-2);
					var adjacentLeft = ((baseY-1)*gameboardX) + (baseX-1);
					
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
					var moveRight = ((baseY-1)*gameboardX) + (baseX+2);
					var adjacentRight = ((baseY-1)*gameboardX) + (baseX+1);

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

	}

	window.ball = ball;

}());