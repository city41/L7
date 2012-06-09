(function() {
	SAM.Skydiving = function(bgImage, clouds, landscape, tileSize, spriteFactory) {
		var levelLoader = new L7.ColorLevelLoader(bgImage, tileSize, 0);
		var board = levelLoader.load();

		levelLoader = new L7.ColorLevelLoader(clouds, tileSize, 0);
		clouds = levelLoader.load();

		levelLoader = new L7.ColorLevelLoader(landscape, tileSize, 0);
		landscape = levelLoader.load();

		var chad = spriteFactory.chad(L7.p(33, 29));
		var tammy = spriteFactory.tammy(L7.p(41, 0));
		var bobo = spriteFactory.bobo(L7.p(7, 15));
		var boo = spriteFactory.boo(L7.p(19, 48));

		board.addActors(chad, tammy, bobo, boo);

		board.ani.frame({
			targets: [chad, tammy, bobo, boo],
			pieceSetIndex: 1,
			rate: 150,
			looping: 'backforth',
			loops: Infinity
		});

		board.parallaxRatio = 0;
		clouds.parallaxRatio = 0;
		landscape.parallaxRatio = 0;

		var parallax = new L7.ParallaxBoard({
			boards: [landscape, board, clouds],
			tileSize: tileSize,
			width: board.width,
			height: board.height
		});

		clouds.ani.tween({
			targets: [clouds],
			property: 'offsetY',
			from: 0,
			to: 180,
			duration: 13000
		});

		landscape.ani.tween({
			targets: [landscape],
			property: 'offsetY',
			from: 0,
			to: 180,
			duration: 30000
		});

		return parallax;
	};

})();


