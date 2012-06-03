(function() {
	var _tileSize = 2;
	L7.useWebGL = true;

	function onImagesLoaded(images) {
		var spriteFactory = new SI.SpriteFactory(images.sprites);
		var introBoard = new SI.IntroBoard(images.introBoard, _tileSize);
		var game = new L7.Game(introBoard);

		function getGameBoard() {
			var gameBoard = new SI.GameBoard(spriteFactory, _tileSize);

			gameBoard.on('gameover', function() {
				game.replaceBoard(introBoard);
			});
			gameBoard.on('levelComplete', function() {
				var nextGameBoard = getGameBoard();
				game.replaceBoard(nextGameBoard);
			});

			return gameBoard;
		}

		game.fpsContainer = document.getElementById('fpsContainer');

		introBoard.on('startGame', function() {
			var gameBoard = getGameBoard();
			game.replaceBoard(gameBoard);
		});

		game.go();
	}

	var imageLoader = new L7.ImageLoader({
		srcs: ['sprites.png', 'introBoard.png'],
		loadNow: true,
		handler: onImagesLoaded
	});

})();

