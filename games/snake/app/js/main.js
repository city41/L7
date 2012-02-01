(function() {
	var _game;

	function _onSplashComplete(splash) {
		var nextBoard;
		if (snake.Storage.present('hasPlayedBefore')) {
			nextBoard = new snake.MainMenu
		} else {
			nextBoard = new snake.ClassicIntro
		}

		_game.replaceBoard(new L7.FadeOutIn({
			duration: 300,
			game: game,
			fromBoard: splash,
			toBoard: nextBoard,
			color: 'black'
		}));
	}

	snake.go = function() {
		var splash = new snake.SplashBoard({
			duration: 5000,
			onComplete: _onSplashComplete
		});

		_game = new L7.Game({
			board: splash,
			width: 480,
			height: 320
		});

		_game.go();
	};
})();

