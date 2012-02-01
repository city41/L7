(function() {
		var _game;

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

