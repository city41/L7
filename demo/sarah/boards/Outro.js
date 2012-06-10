(function() {
	SAM.Outro = function(bgImage, tileSize, spriteFactory) {
		var levelLoader = new L7.ColorLevelLoader(bgImage, tileSize, 0);
		var board = levelLoader.load();
		board.parallaxRatio = 0;

		var danceBoard = new L7.Board({
			tileSize: tileSize * 1.8,
			width: board.width,
			height: board.height,
			parallaxRatio: 0
		});

		var sarahWedding = spriteFactory.sarahWedding(L7.p(18, 21));
		var mattWedding = spriteFactory.mattWedding(L7.p(10, 21));

		danceBoard.addActors(sarahWedding, mattWedding);

		danceBoard.ani.frame({
			targets: [sarahWedding, mattWedding],
			rate: 150,
			looping: 'backforth',
			pieceSetIndex: 1,
			loops: Infinity
		});

		var parallax = new L7.ParallaxBoard({
			boards: [board, danceBoard],
			width: board.width,
			height: board.height
		});

		parallax.destroy = function() {
			SAM.game.viewport.reset();
		};

		return parallax;
	};
})();



