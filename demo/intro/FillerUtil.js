(function() {
	var noColor = [121, 133, 164, 1];

	i.FillerUtil = {
		pulsate: function(board, position) {
			board.ani.repeat(Infinity, function(ani) {
				ani.shimmer({
					targets: [board.tileAt(position)],
					minAlpha: 0,
					maxAlpha: 0.9,
					baseRate: 600,
					rateVariance: 0
				});
			});
		},

		addWater: function(board, corner, width, height) {
			var bubbles = new L7.ParticleSystem({
				totalParticles: 4,
				duration: Infinity,
				gravity: L7.p(),
				centerOfGravity: L7.p(),
				angle: - 90,
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

		addHighWater: function(board, corner, width, height) {
			var bubbles = new L7.ParticleSystem({
				totalParticles: 30,
				duration: Infinity,
				gravity: L7.p(),
				centerOfGravity: L7.p(),
				angle: - 90,
				angleVar: 0,
				speed: 3,
				speedVar: 0.6,
				radialAccel: 0,
				radialAccelVar: 0,
				tangentialAccel: 0,
				tangentialAccelVar: 0,
				position: L7.p(corner.x + width / 2, corner.y + height),
				posVar: L7.p(width / 2, 0),
				life: 5,
				lifeVar: 0.15,
				emissionRate: 7,
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

		addBarGraph: function(board, position, width, height, barColor) {
			barColor = barColor || [240, 186, 89, 1];

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
					var max = L7.rand(0, height);
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
				ani.waitBetween(100, 1000);
			});
		},

		addHeartWave: function(board, position, width, height, barColor) {
			barColor = barColor || [255, 255, 0, 1];

			var pieces = [];
			for (var i = 0; i < height; ++i) {
				var row = [];
				for (var k = 0; k < width; ++k) {
					row.push(1);
				}
				pieces.push(row);
			}

			pieces[0][0] = 5;

			var heartWave = new L7.Actor({
				shape: pieces,
				position: position
			});

			board.addActor(heartWave);

			var blipPosition = position.add(0, 1);
			var nonBlipHeight = position.y + 2;

			function doHeartWave() {
				for (var c = 0; c < width; ++c) {
					for (var r = 0; r < height; ++r) {
						var piece = heartWave.pieces.filter(function(p) {
							return p.position.x === c + position.x && p.position.y == r + position.y;
						})[0];

						if (piece.position.equals(blipPosition) || (piece.position.y === nonBlipHeight && piece.position.x !== blipPosition.x)) {
							piece.color = barColor;
						} else {
							piece.color = noColor;
						}
					}
				}

				blipPosition = blipPosition.add(1, 0);
				if (blipPosition.x >= position.x + width) {
					blipPosition = position.add(0, 1);
				}
			}

			heartWave.ani.repeat(Infinity, function(ani) {
				ani.invoke(doHeartWave);
				ani.wait(400);
			});
		},

		addSinWave: function(board, position, width, height, barColor) {
			barColor = barColor || [255, 255, 0, 1];

			var pieces = [];
			for (var i = 0; i < height; ++i) {
				var row = [];
				for (var k = 0; k < width; ++k) {
					row.push(1);
				}
				pieces.push(row);
			}

			pieces[0][0] = 5;

			var sinWave = new L7.Actor({
				shape: pieces,
				position: position
			});

			board.addActor(sinWave);

			var blipPosition = position.add(0, 1);
			var nonBlipHeight = position.y + 2;
			var sinCounter = 0;

			function doSinWave() {
				sinWave.pieces.forEach(function(p) {
					p.color = noColor;
				});

				for (var i = 0; i < width; ++i) {
					var x = position.x + i;
					var yOffset = (Math.sin(sinCounter + i) * (height/2)) | 0;
					var y = (position.y + (height / 2) + yOffset) | 0;
					var piece = sinWave.pieces.filter(function(p) {
						return p.position.x === x && p.position.y === y;
					})[0];
					if(!piece) {
						debugger;
					}
					piece.color = barColor;
				}
				++sinCounter;
			}

			sinWave.ani.repeat(Infinity, function(ani) {
				ani.invoke(doSinWave);
				ani.wait(600);
			});
		}

	};
})();

