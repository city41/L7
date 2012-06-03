(function() {
	var _tileSize = 2;
	L7.useWebGL = true;

	function onImagesLoaded(images) {
		var introBoard = new SI.IntroBoard(images.introBoard, _tileSize);

		var game = new L7.Game(introBoard);
		game.fpsContainer = document.getElementById('fpsContainer');

		var spriteFactory = new SI.SpriteFactory(images.sprites);


		introBoard.on('startGame', function() {
			var gameBoard = new SI.GameBoard(spriteFactory, _tileSize);

			gameBoard.on('gameover', function() {
				game.replaceBoard(introBoard);
			});

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

