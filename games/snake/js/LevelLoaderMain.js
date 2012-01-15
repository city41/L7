(function() {
	function rand(min, max) {
		var range = max - min;
		return Math.floor(Math.random() * range) + min;
	}

	window.snk = window.snk || {};

	snk.go = function() {
		var legend = {
			// water
			'#000000': {
				constructor: snk.Water
			},

			// bridge
			'#00FF00': {
				constructor: snk.Bridge,
			},

			// apple
			'#FF0000': {
				constructor: snk.Apple
			},

			// snake
			'#0000FF': {
				constructor: snk.Snake,
				config: {
					direction: snk.Direction.East,
					rate: 100,
					size: 3,
					shouldGrow: true
				}
			}
		};

		var image = new Image();

		var boardConfig = {
			viewportAnchor: L7.p(0, 90),
			viewportWidth: 30,
			viewportHeight: 30,
			preventOverscroll: true,
			tileSize: 24,
			defaultTileColor: [20, 30, 40, 1],
			borderWidth: 6
		};

		image.onload = function() {
			var loader = new L7.LevelLoader({
				boardConfig: boardConfig,
				legend: legend,
				image: image
			});

			var level = loader.load();

			level.board.addDaemon(new snk.RadarDaemon({
				apples: _.clone(level.actors['#FF0000']),
				snake: level.actors['#0000FF'].first
			}));

			new L7.Kernel(level.board).go();
		};

		image.src = 'BridgeLevel.png';
	};
})();

