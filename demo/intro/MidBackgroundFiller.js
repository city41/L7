(function() {
	i.MidBackgroundFiller = {
		fill: function(board) {
			i.FillerUtil.addBarGraph(board, L7.p(12, 5), 5, 4);
			i.FillerUtil.addWater(board, L7.p(28, 5), 3, 7);
			i.FillerUtil.addHighWater(board, L7.p(128, 2), 30, 18);

			this._addSmoke(board);
		},

		_addSmoke: function(board) {
			var fireSystem = new L7.ParticleSystem({
				totalParticles: 50,
				duration: Infinity,
				gravity: L7.p(),
				centerOfGravity: L7.p(),
				angle: - 90,
				angleVar: 8,
				speed: 2,
				speedVar: 1,
				radialAccel: 0,
				radialAccelVar: 0,
				tangentialAccel: 0,
				tangentialAccelVar: 0,
				position: L7.p(104, 7),
				posVar: L7.p(1, 1),
				life: 2,
				lifeVar: 0.15,
				emissionRate: 50 / 1,
				startColor: L7.Color.fromFloats(0.5, 0.5, 0.5, 1),
				startColorVar: [0, 0, 0, 0],
				endColor: L7.Color.fromFloats(1, 1, 1, 0.25),
				endColorVar: [0, 0, 0, 0],
				active: true
			});

			board.addDaemon(fireSystem);
		}
	};
})();

