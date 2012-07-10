(function() {
	SAM.Intro = function(tileSize, spriteFactory) {
		var board = new L7.Board({
			width: 60,
			height: 60,
			tileSize: tileSize,
			borderWidth: 0,
			defaultTileColor: [156, 97, 22, 1]
		});

		var matt = spriteFactory.matt(L7.p(20, 20));
		var sarah = spriteFactory.sarah(L7.p(30, 21));
		var title = spriteFactory.title(L7.p(12, 38));

		var confetti = this._createConfettiSystem(board.width);
		board.addDaemon(confetti);

		board.addActors(matt, sarah);

		board.ani.sequence(function(ani) {
			ani.wait(6700);
			ani.invoke(function() {
				confetti.active = true;
				board.addActor(title);
			});
			ani.frame({
				targets: [matt, sarah],
				pieceSetIndex: 1,
				rate: 150,
				looping: 'backforth',
				loops: Infinity
			});
		});

		return board;
	};

	SAM.Intro.prototype._createConfettiSystem = function(width) {
		return new L7.ParticleSystem({
			totalParticles: 50,
			duration: Infinity,
			gravity: L7.p(0, 1),
			centerOfGravity: L7.p(),
			angle: 90,
			angleVar: 10,
			speed: 5,
			speedVar: 1,
			radialAccel: 0,
			radialAccelVar: 2,
			tangentialAccel: 0,
			tangentialAccelVar: 2,
			position: L7.p(width / 2, 0),
			posVar: L7.p(width / 2, 0),
			life: 6,
			lifeVar: 2,
			emissionRate: 10,
			startColor: L7.Color.fromFloats(1, 1, 1, 1),
			startColorVar: [255, 255, 255, 0],
			endColor: L7.Color.fromFloats(1, 1, 1, 0),
			endColorVar: [255, 255, 255, 0],
			active: false
		});
	};

})();


