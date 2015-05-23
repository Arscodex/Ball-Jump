(function(){

	function squareClick(){
		if(this.activeSquare && selectedBall){
			gameSquares[selectedBall.gamePos-1].occupied = false;
			//Always refresh all positional properties of a moved element.
			selectedBall.gamePosX = this.gamePosX;
			selectedBall.gamePosY = this.gamePosY;
			selectedBall.gamePos = ((selectedBall.gamePosY-1)*gameboardX)+selectedBall.gamePosX;
			selectedBall.moveBall();
			gameSquares[this.jumpedSquareIndex].occupied = false;
			gameBalls[this.jumpedBallIndex].style.left='-999px';
			gameBalls[this.jumpedBallIndex].gamePosX = 0;
			gameBalls[this.jumpedBallIndex].gamePosY = 0;
			gameBalls[this.jumpedBallIndex].gamePos = 0;
			for(i=0;i<gameSquares.length;i++){
				if(gameSquares[i].activeSquare){
					gameSquares[i].jumpedBallIndex = null;
					gameSquares[i].jumpedSquareIndex = null;
					gameSquares[i].activeSquare = false;
					gameSquares[i].highlightSquare();
				}
			}
			currentBallCircle.setAttribute('fill', 'url(#silver)');
			selectedBall.activeBall = false;
			selectedBall = '';
			currentBallCircle = '';
			this.occupied = true;
			totalJumpedBalls +=1;
			if(totalJumpedBalls >= totalBallsNeeded){
				currentLevel +=1;
				console.log(currentLevel);
				if(currentLevel === levels.length){
					display.innerHTML = 'Congratulations! That\'s All, Folks!';
					killScreen = true;
				}
				else{
					while(gameboard.hasChildNodes()){
						gameboard.removeChild(gameboard.lastChild);
					}
					level.buildLevel(currentLevel);
				}
			}
			
		}
	};

	var square = {

		makeSquares: function (elementWidth){
			for(i=0; i<gameboardY; i++){
				var gamePosY = i + 1;
				for(j=0; j<gameboardX; j++){

					var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
					var rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
					var gamePosX = j + 1;
					svg.classList.add('gameElementSquare');
					rect.classList.add('gameElementSquareRect');
					//The properties that give the position index
					svg.gamePosY = gamePosY;
					svg.gamePosX = gamePosX;
					svg.gamePos = ((svg.gamePosY-1)*gameboardX)+svg.gamePosX;
					square.gameElementSquare(svg, rect, elementWidth);
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
					svg.jumpedBallIndex = null;
					//The jumpedSquareIndex does the same, but tracks the square that held the ball.
					svg.jumpedSquareIndex = null;
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
					svg.onclick = squareClick;
					svg.appendChild(rect);
					gameboard.appendChild(svg);
				}
			}
		},

		//gameElementSquare is the constructor for new square elements. 

		gameElementSquare: function (element, square, elementWidth){
			var gameSquareWidth = elementWidth;
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
	}

	window.square = square;

}());