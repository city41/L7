(function() {
		var _game;

		function _onSplashComplete(splash) {
			var nextBoard;
			if(snake.Storage.present('hasPlayedBefore')) {
				nextBoard = new snake.MainMenu
			} else {
				nextBoard = new snake.ClassicScenario
			}

			_game.transition(new L7.Fade(300), nextBoard);
		}

		snake.go = function(){
			var splash = new snake.SplashScreen({
				duration: 2000,
				onComplete: _onSplashComplete;
			});

			_game = new L7.Game({
				board: splash,
				width: 480,
				height: 320
			});

			_game.go();
		};
})();

