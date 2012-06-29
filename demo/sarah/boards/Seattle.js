(function() {
	SAM.Seattle = function(bgImage, duck, tileSize, spriteFactory) {
		var levelLoader = new L7.ColorLevelLoader(bgImage, tileSize, 0);
		var board = levelLoader.load();

		levelLoader = new L7.ColorLevelLoader(duck, tileSize, 0);
		duck = levelLoader.load();
		duck.parallaxRatio = 0.4;

		var matt = spriteFactory.mattDuck(L7.p(95, 21));
		var sarah = spriteFactory.sarahDuck(L7.p(109, 22));
		var lucy = spriteFactory.lucyDuck(L7.p(123, 26));
		var chad = spriteFactory.chadDuck(L7.p(137, 21));
		var mom = spriteFactory.momDuck(L7.p(151, 22));

		duck.addActors(matt, sarah, lucy, chad, mom);

		duck.ani.frame({
			targets: [sarah, matt, lucy, chad, mom],
			pieceSetIndex: 1,
			rate: 150,
			looping: 'backforth',
			loops: Infinity
		});

		var parallax = new L7.ParallaxBoard({
			boards: [board, duck],
			tileSize: tileSize,
			width: board.width,
			height: board.height
		});

		duck.ani.repeat(Infinity, function(ani) {
			ani.invoke(function() {
				SAM.game.viewport.scrollX(5);
			});
			ani.wait(1);
		});

		parallax.destroy = function() {
			SAM.game.viewport.reset();
		};

		return parallax;
	};
})();


