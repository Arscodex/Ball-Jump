(function(){

	//buildLevel generates all of the elements necessary for a game level. 
	//The number parameter in the signature is the current level. 

	function buildLevel(number){
		var levelLayout = levels[number];
		totalJumpedBalls = 0;
		totalBallsNeeded = levelLayout.balls.length;
		var currentDisplay = document.getElementById('display');
		currentDisplay.innerHTML = 'Level: ' + number;
		var gameAreaWidth = document.getElementById('gameboard').clientWidth;
		gameboardX = levelLayout.gameboardWidth;
		gameboardY = levelLayout.gameboardHeight;
		var gameElementWidth = Math.floor(gameAreaWidth / gameboardX);
		for(i=0; i<levelLayout.balls.length; i++){
			var gamePosX = levelLayout.balls[i].gamePosX;
			var gamePosY = levelLayout.balls[i].gamePosY;
			ball.makeBall(gamePosX, gamePosY, i, gameElementWidth);
		}
		totalBallsNeeded = levelLayout.balls.length -1;
		square.makeSquares(gameElementWidth);

		gameboard.style.height = gameSquares[0].clientHeight*gameboardY +'px';
		gameboard.style.width = gameSquares[0].clientWidth*gameboardX + 'px';
	}

	var level = {

		//Assign buildLevel to the level scope

		buildLevel: buildLevel,

		//newGame is only called if you want an entirely new game with fully-refreshed variables.

		newGame: function(){
			var confirm = window.confirm('Are you sure?');
			if(confirm){
				killScreen = false;
				currentLevel = 1;
				while(gameboard.hasChildNodes()){
					gameboard.removeChild(gameboard.lastChild);
				}
				buildLevel(1);
			}

		},

		//resetLevel only resets the elements to all values for the current level.
		//It even works on the game's kill screen, though I might change this later. 

		resetLevel:	function(){
			while(gameboard.hasChildNodes()){
				gameboard.removeChild(gameboard.lastChild);
			}
			if(killScreen){
				currentLevel -=1;
				buildLevel(currentLevel);
			}
			else{
				buildLevel(currentLevel);
			}
		}

	};

	window.level = level;

}());