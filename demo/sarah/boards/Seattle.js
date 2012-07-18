(function() {
	SAM.Seattle = function(bgImage, duck, tileSize, spriteFactory) {
		var levelLoader = new L7.ColorLevelLoader(bgImage, tileSize, 0);
		var board = levelLoader.load();

		levelLoader = new L7.ColorLevelLoader(duck, tileSize, 0);
		duck = levelLoader.load();
		duck.parallaxRatio = 0.4;

		var matt = spriteFactory.mattDuck(L7.p(59, 21));
		var sarah = spriteFactory.sarahDuck(L7.p(73, 22));
		var lucy = spriteFactory.lucyDuck(L7.p(87, 26));
		var chad = spriteFactory.chadDuck(L7.p(101, 21));
		var tammy = spriteFactory.tammyDuck(L7.p(115, 22));
		var frontWheel = spriteFactory.duckWheel(L7.p(41, 50));
		var midWheel = spriteFactory.duckWheel(L7.p(102, 50));
		var backWheel = spriteFactory.duckWheel(L7.p(118, 50));

		duck.addActors(matt, sarah, lucy, chad, tammy, frontWheel, midWheel, backWheel);

		duck.ani.frame({
			targets: [sarah, matt, lucy, chad, tammy, frontWheel, midWheel, backWheel],
			pieceSetIndex: 1,
			rate: 150,
			looping: 'backforth',
			loops: Infinity
		});

		var rainBoard = new L7.Board({
			width: 60,
			height: 60,
			tileSize: tileSize,
			borderWidth: 0
		});

		var rain = this._createRainSystem(rainBoard);
		rainBoard.addDaemon(rain);

		var parallax = new L7.ParallaxBoard({
			boards: [board, duck, rainBoard],
			tileSize: tileSize,
			width: board.width,
			height: board.height
		});

		duck.ani.repeat(Infinity, function(ani) {
			ani.invoke(function() {
				SAM.game.viewport.scrollX(2);
			});
		});

		parallax.destroy = function() {
			SAM.game.viewport.reset();
		};

		return parallax;
	};

	SAM.Seattle.prototype._createRainSystem = function(board) {
		return new L7.ParticleSystem({
			totalParticles: 80,
			duration: Infinity,
			gravity: L7.p(100, - 10),
			centerOfGravity: L7.p(),
			angle: 90,
			angleVar: 5,
			speed: 100,
			speedVar: 30,
			radialAccel: 0,
			radialAccelVar: 1,
			tangentialAccel: 0,
			tangentialAccelVar: 1,
			position: L7.p(board.width / 2, -1),
			posVar: L7.p(board.width / 2, 0),
			life: 1.8,
			lifeVar: 0,
			emissionRate: 40,
			startColor: L7.Color.fromFloats(0.7, 0.8, 1, 1),
			startColorVar: [0, 0, 0, 0],
			endColor: L7.Color.fromFloats(0.7, 0.8, 1, 1),
			endColorVar: [0, 0, 0, 0],
			active: true
		});
	};
})();

