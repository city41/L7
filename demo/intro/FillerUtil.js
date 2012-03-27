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

		addSmoke: function(board, position, radius, life) {
			life = life || 2;
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
				position: position,
				posVar: L7.p(radius, 1),
				life: life,
				lifeVar: 0.15,
				emissionRate: 50 / life,
				startColor: L7.Color.fromFloats(0.5, 0.5, 0.5, 1),
				startColorVar: [0, 0, 0, 0],
				endColor: L7.Color.fromFloats(1, 1, 1, 0.25),
				endColorVar: [0, 0, 0, 0],
				active: true
			});

			board.addDaemon(fireSystem);
		},

		addSparks: function(board, position) {
			var sparks = new L7.ParticleSystem({
				totalParticles: 10,
				duration: Infinity,
				gravity: L7.p(0, 0),
				centerOfGravity: L7.p(),
				angle: - 70,
				angleVar: 30,
				speed: 40,
				speedVar: 3,
				radialAccel: 10,
				radialAccelVar: 2,
				tangentialAccel: 0,
				tangentialAccelVar: 0,
				position: position,
				posVar: L7.p(),
				life: 0.3,
				lifeVar: 0,
				emissionRate: 10,
				startColor: [255, 255, 200, 1],
				startColorVar: [10, 10, 0, 0],
				endColor: [255, 255, 255, 0.25],
				endColorVar: [0, 0, 0, 0],
				active: true,
				startSize: 0.75,
				startSizeVar: 0,
				endSize: 0.75,
				endSizeVar: 0
			});

			board.addDaemon(sparks);
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

			var shape = [];
			for (var i = 0; i < height; ++i) {
				var row = [];
				for (var k = 0; k < width; ++k) {
					row.push(1);
				}
				shape.push(row);
			}

			shape[0][0] = 5;

			var blueScreen = new L7.Actor({
				shape: shape,
				position: position
			});

			board.addActor(blueScreen);

			function doBlueScreen() {
				for (var c = position.x, cl = position.x + width; c < cl; ++c) {
					for (var r = position.y, rl = position.y + height; r < rl; ++r) {
						var piece = blueScreen.pieceAt(c, r);

						var rand = L7.rand(0, 100);

						if (rand < 33) {
							piece.color = whiteColor;
							piece.scale = 0.60;
						} else {
							piece.color = blueColor;
							piece.scale = 0;
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

			var shape = [];
			for (var i = 0; i < height; ++i) {
				var row = [];
				for (var k = 0; k < width; ++k) {
					row.push(1);
				}
				shape.push(row);
			}

			shape[0][0] = 5;

			var barGraph = new L7.Actor({
				shape: shape,
				position: position
			});

			board.addActor(barGraph);

			function doBarGraph() {
				for (var c = position.x, cl = position.x + width; c < cl; ++c) {
					var max = L7.rand(0, height) + position.y;
					for (var r = position.y, rl = position.y + height; r < rl; ++r) {
						var piece = barGraph.pieceAt(c, r);

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

			var shape = [];
			for (var i = 0; i < height; ++i) {
				var row = [];
				for (var k = 0; k < width; ++k) {
					row.push(1);
				}
				shape.push(row);
			}

			shape[0][0] = 5;

			var heartWave = new L7.Actor({
				shape: shape,
				position: position
			});

			board.addActor(heartWave);

			var blipPosition = position.add(0, 1);
			var nonBlipHeight = position.y + 2;

			function doHeartWave() {
				for (var c = position.x, cl = position.x + width; c < cl; ++c) {
					for (var r = position.y, rl = position.y + height; r < rl; ++r) {
						var piece = heartWave.pieceAt(c, r);

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
			var barColor2 = [0, 0, 255, 1];
			var backColor = [100, 100, 100, 1];

			var shape = [];
			for (var i = 0; i < height; ++i) {
				var row = [];
				for (var k = 0; k < width; ++k) {
					row.push(1);
				}
				shape.push(row);
			}

			shape[0][0] = 5;

			var sinWave = new L7.Actor({
				shape: shape,
				position: position
			});

			board.addActor(sinWave);

			var sinCounter = 0;

			function doSinWave() {
				var l = sinWave.pieces.length;
				while (l--) {
					sinWave.pieces[l].color = backColor;
				}

				for (var i = 0; i < width; ++i) {
					var x = position.x + i;
					var yOffset = (Math.sin(sinCounter + i) * ((height - 1) / 2)) | 0;
					var y = (position.y + (height / 2) + yOffset) | 0;
					var piece = sinWave.pieceAt(x, y);
					piece.color = barColor;

					yOffset = (Math.cos(sinCounter + i) * ((height - 1) / 2)) | 0;
					y = (position.y + (height / 2) + yOffset) | 0;
					piece = sinWave.pieceAt(x, y);
					piece.color = barColor2;
				}++sinCounter;
			}

			sinWave.ani.repeat(Infinity, function(ani) {
				ani.invoke(doSinWave);
				ani.wait(600);
			});
		}

	};
})();

