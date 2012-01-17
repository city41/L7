(function() {
	var _remainingApples;
	var _kernel;

	function rand(min, max) {
		var range = max - min;
		return Math.floor(Math.random() * range) + min;
	}

	window.snk = window.snk || {};

	function showCongrats() {
		var image = new Image();
		image.onload = function() {
			var loader = new L7.LevelLoader({
				boardConfig: {
					tileSize: 16,
					defaultTileColor: [20, 30, 40, 1],
					borderWidth: 2
				},
				legend: {
					'#000000': {
						constructor: snk.Water
					}
				},
				image: image
			});

			var level = loader.load();

			var waterTiles = level.board.query(function(tile) {
				return tile.has('water');
			});

			var shimmer = new Shimmer({
				tiles: waterTiles,
				minAlpha: 0.3,
				maxAlpha: 0.9,
				baseRate: 500,
				rateVariance: .2,
				color: [0, 0, 100, 1]
			});

			level.board.addDaemon(shimmer);
			colorIslands(level.board);

			_kernel.replaceBoard(level.board);
		};

		image.src = 'GoodJob.png';
	}

	function colorIslands(board) {
		var islandTiles = board.query(function(tile) {
			return (!tile.has('water') && ! tile.has('bridge'));
		});

		islandTiles.forEach(function(tile) {
			tile.color = [L7.rand(160, 190), L7.rand(160, 190), L7.rand(100, 120), 1];
		});

		var appleTiles = board.query(function(tile) {
			return tile.has('apple');
		});

		appleTiles.forEach(function(tile) {
			tile.color = [118, 117, 114, 1];
		});

		board.query(function(tile) {
			return tile.has('bridge');
		}).forEach(function(tile) {
			tile.inhabitants.first.color = [L7.rand(180, 193), L7.rand(60, 120), L7.rand(30, 69), 1];
		});
	}

	function hookIntoApples(board) {
		var appleTiles = board.query(function(tile) {
			return tile.has('apple');
		});

		_remainingApples = appleTiles.length;

		appleTiles.forEach(function(tile) {
			var apple = tile.inhabitants.first.owner;
			apple.on('death', function(apple) {--_remainingApples;
				if (_remainingApples === 0) {
					showCongrats();
				}
			});
		});
	}

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
			'#FFFF00': {
				constructor: snk.Apple
			},

			// snake
			'#0000FF': {
				constructor: snk.Snake,
				config: {
					direction: snk.Direction.East,
					rate: 200,
					size: 2,
					shouldGrow: true
				}
			}
		};

		var image = new Image();

		var boardConfig = {
			viewportAnchor: L7.p(0, 20),
			viewportWidth: 30,
			viewportHeight: 30,
			preventOverscroll: true,
			tileSize: 16,
			defaultTileColor: [20, 30, 40, 1],
			borderWidth: 2
		};

		image.onload = function() {
			var loader = new L7.LevelLoader({
				boardConfig: boardConfig,
				legend: legend,
				image: image
			});

			var level = loader.load();

			var waterTiles = level.board.query(function(tile) {
				return tile.has('water');
			});

			var shimmer = new Shimmer({
				tiles: waterTiles,
				minAlpha: 0.3,
				maxAlpha: 0.6,
				baseRate: 700,
				rateVariance: .2
			});

			colorIslands(level.board);
			hookIntoApples(level.board);

			level.board.addDaemon(shimmer);

			_kernel = new L7.Kernel(level.board);
			_kernel.go();
		};

		image.src = 'BridgeLevel.png';
	};
})();

