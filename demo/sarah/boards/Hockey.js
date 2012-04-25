(function() {
	SAM.Hockey = function(bgImage, fgImage, tileSize, spriteFactory) {
		var bgLevelLoader = new L7.ColorLevelLoader(bgImage, tileSize, 0);
		var bgBoard = bgLevelLoader.load();
		bgBoard.parallaxRatio = 0;

		var matt = spriteFactory.matt(L7.p(20, 20));
		var sarah = spriteFactory.sarah(L7.p(30, 21));
		var phil = spriteFactory.phil(L7.p(40, 21));
		var emily = spriteFactory.emily(L7.p(7, 21));

		bgBoard.addActors(matt, sarah, phil, emily);

		bgBoard.ani.frame({
			targets: [matt, sarah, phil, emily],
			pieceSetIndex: 1,
			rate: 150,
			looping: 'backforth',
			loops: Infinity
		});

		var fgLevelLoader = new L7.ColorLevelLoader(fgImage, tileSize, 0);
		var fgBoard = fgLevelLoader.load();
		fgBoard.parallaxRatio = 0;

		return new L7.ParallaxBoard({
			boards: [bgBoard, fgBoard]
		});
	};

})();


