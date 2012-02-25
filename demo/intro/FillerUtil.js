(function() {

	i.FillerUtil = {
		addWater: function(board, corner, width, height) {
			var bubbles = new L7.ParticleSystem({
				totalParticles: 4,
				duration: Infinity,
				gravity: L7.p(),
				centerOfGravity: L7.p(),
				angle: -90,
				angleVar: 0,
				speed: 2,
				speedVar: 0.4,
				radialAccel: 0,
				radialAccelVar: 0,
				tangentialAccel: 0,
				tangentialAccelVar: 0,
				position: L7.p(corner.x + width / 2, corner.y + height),
				posVar: L7.p(width / 2, 0),
				life: 1.4,
				lifeVar: 0.15,
				emissionRate: 4,
				startColor: [255, 255, 255, 1],
				startColorVar: [0, 0, 0, 0],
				endColor: [145, 220, 255, 1],
				endColorVar: [0, 0, 0, 0],
				active: true
			});

			board.addDaemon(bubbles);
		},

		addBlueScreen: function(board, position, width, height) {
			var whiteColor = [255, 255, 255, 1];
			var blueColor = [0, 0, 255, 1];

			var pieces = [];
			for (var i = 0; i < height; ++i) {
				var row = [];
				for (var k = 0; k < width; ++k) {
					row.push(1);
				}
				pieces.push(row);
			}

			pieces[0][0] = 5;

			var blueScreen = new L7.Actor({
				shape: pieces,
				position: position
			});

			board.addActor(blueScreen);

			function doBlueScreen() {
				for (var c = 0; c < width; ++c) {
					for (var r = 0; r < height; ++r) {
						var piece = blueScreen.pieces.filter(function(p) {
							return p.position.x === c + position.x && p.position.y == r + position.y;
						})[0];

						var rand = L7.rand(0, 100);

						if (rand < 35) {
							piece.color = whiteColor;
						} else {
							piece.color = blueColor;
						}
					}
				}
			}

			blueScreen.ani.repeat(Infinity, function(ani) {
				ani.invoke(doBlueScreen);
				ani.waitBetween(1000, 3000);
			});
		},

		addBarGraph: function(board, position, width, height) {
			var barColor = [240, 186, 89, 1];
			var noColor = [100, 100, 100, 0.5];

			var pieces = [];
			for (var i = 0; i < height; ++i) {
				var row = [];
				for (var k = 0; k < width; ++k) {
					row.push(1);
				}
				pieces.push(row);
			}

			pieces[0][0] = 5;

			var barGraph = new L7.Actor({
				shape: pieces,
				position: position
			});

			board.addActor(barGraph);

			function doBarGraph() {
				for (var c = 0; c < width; ++c) {
					var max = L7.rand(0, height + 1);
					for (var r = 0; r < height; ++r) {
						var piece = barGraph.pieces.filter(function(p) {
							return p.position.x === c + position.x && p.position.y == r + position.y;
						})[0];

						if (r >= max) {
							piece.color = barColor;
						} else {
							piece.color = noColor;
						}
					}
				}
			}

			barGraph.ani.repeat(Infinity, function(ani) {
				ani.invoke(doBarGraph);
				ani.waitBetween(100, 2000);
			});
		}
	};
})();


