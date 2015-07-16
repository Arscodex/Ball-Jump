(function(){

	//buildLevel generates all of the elements necessary for a game level. 
	//The number parameter in the signature is the current level. 

	var gameboard = document.getElementById('gameboard')
	var gameWidth = document.getElementById('game').clientWidth;
	var gameDisplay = document.getElementById('display');
	var buttons = document.getElementsByClassName('button');

	var levelLayout;
	var gameElementWidth;

	var level = {

		//Assign buildLevel to the level scope

		buildLevel: function (number){
			levelLayout = levels[number];
			totalJumpedBalls = 0;
			totalBallsNeeded = levelLayout.balls.length;
			var currentDisplay = document.getElementById('display');
			currentDisplay.innerHTML = 'Level: ' + number;
			
			gameboardX = levelLayout.gameboardSquaresX;
			gameboardY = levelLayout.gameboardSquaresY;
			gameElementWidth = Math.floor((gameWidth*0.9) / gameboardX);
			for(i=0; i<levelLayout.balls.length; i++){
				var gamePosX = levelLayout.balls[i].gamePosX;
				var gamePosY = levelLayout.balls[i].gamePosY;
				ball.makeBall(gamePosX, gamePosY, i, gameElementWidth);
			}
			totalBallsNeeded = levelLayout.balls.length -1;
			square.makeSquares(gameElementWidth);

			gameboard.style.height = gameElementWidth*gameboardY +'px';
			gameboard.style.width = gameElementWidth*gameboardX + 'px';
			gameDisplay.style.width = gameElementWidth*gameboardX + 'px';
			for(i=0;i<buttons.length;i++){
				buttons[i].style.width = Math.floor((gameElementWidth*gameboardX)*0.99) + 'px';
			}
		},

		//Refresh all elements when the window is resized

		refresh: function(){
				
			gameWidth = document.getElementById('game').clientWidth;
			levelLayout = levels[currentLevel];
			gameboardX = levelLayout.gameboardSquaresX;
			gameElementWidth = Math.floor((gameWidth*0.9) / gameboardX);
			square.refresh(gameElementWidth);
			ball.refresh(gameElementWidth);
			gameboard.style.height = gameElementWidth*gameboardY +'px';
			gameboard.style.width = gameElementWidth*gameboardX + 'px';
			gameDisplay.style.width = gameElementWidth*gameboardX + 'px';
			for(i=0;i<buttons.length;i++){
				buttons[i].style.width = Math.floor((gameElementWidth*gameboardX)*0.99) + 'px';
			}
		},

		//newGame is only called if you want an entirely new game with fully-refreshed variables.

		newGame: function(){
			var confirm = window.confirm('Are you sure?');
			if(confirm){
				killScreen = false;
				currentLevel = 1;
				while(gameboard.hasChildNodes()){
					gameboard.removeChild(gameboard.lastChild);
				}
				level.buildLevel(1);
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
				level.buildLevel(currentLevel);
			}
			else{
				level.buildLevel(currentLevel);
			}
		}

	};

	window.level = level;

}());