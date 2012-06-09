(function() {
	SAM.DadTractor = function(bgImage, clouds, tileSize, spriteFactory) {
		var levelLoader = new L7.ColorLevelLoader(bgImage, tileSize, 0);
		var board = levelLoader.load();
		board.parallaxRatio = 0;

		levelLoader = new L7.ColorLevelLoader(clouds, tileSize, 0);
		clouds = levelLoader.load();
		clouds.parallaxRatio = 0.2;

		var dad = spriteFactory.dad(L7.p(10, 38));
		var mom = spriteFactory.mom(L7.p(20, 39));
		var livi = spriteFactory.livi(L7.p(2, 43));
		var buddy = spriteFactory.buddy(L7.p(52, 28));

		var smoke = this._createSmokeSystem(L7.p(36, 28));

		board.addActors(dad, mom, livi, buddy);
		board.addDaemon(smoke);

		board.ani.frame({
			targets: [mom, livi, buddy],
			pieceSetIndex: 1,
			rate: 150,
			looping: 'backforth',
			loops: Infinity
		});

		dad.ani.frame({
			targets: [dad],
			pieceSetIndex: 1,
			rate: 400,
			looping: 'backforth',
			loops: Infinity
		});

		var parallax = new L7.ParallaxBoard({
			boards: [board, clouds],
			tileSize: tileSize,
			width: board.width,
			height: board.height
		});

		clouds.ani.repeat(Infinity, function(ani) {
			ani.invoke(function() {
				SAM.game.viewport.scrollX(1);
			});
			ani.wait(10);
		});

		parallax.destroy = function() {
			SAM.game.viewport.reset();
		};

		return parallax;
	};

	SAM.DadTractor.prototype._createSmokeSystem = function(position) {
		return fireSystem = new L7.ParticleSystem({
			totalParticles: 200,
			duration: Infinity,
			gravity: L7.p(),
			centerOfGravity: L7.p(),
			angle: - 90,
			angleVar: 10,
			speed: 24,
			speedVar: 10,
			radialAccel: 0,
			radialAccelVar: 0,
			tangentialAccel: 0,
			tangentialAccelVar: 0,
			position: position,
			posVar: L7.p(1, 1),
			life: 0.3,
			lifeVar: 0.05,
			emissionRate: 200 / 1,
			startColor: L7.Color.fromFloats(0.2, 0.2, 0.2, 1),
			startColorVar: [0, 0, 0, 0],
			endColor: [0, 0, 0, 0],
			endColorVar: [0, 0, 0, 0],
			active: true
		});
	}

})();

