(function() {
	SAM.Wedding = function(bgImage, tileSize, spriteFactory) {
		var levelLoader = new L7.ColorLevelLoader(bgImage, tileSize, 0);
		var board = levelLoader.load();
		board.parallaxRatio = 0;

		var john = spriteFactory.john(L7.p(10, 0));
		var byron = spriteFactory.byron(L7.p(40, -4));
		var nicky = spriteFactory.nicky(L7.p(22, 0));

		board.addActors(john, byron, nicky);

		board.ani.frame({
			targets: [john, byron, nicky],
			pieceSetIndex: 0,
			rate: 150,
			looping: 'backforth',
			loops: Infinity
		});

		var parallax = new L7.ParallaxBoard({
			boards: [board],
			width: board.width,
			height: board.height
		});

		parallax.destroy = function() {
			SAM.game.viewport.reset();
		};

		return parallax;
	};

})();


