(function() {
	var _remainingApples;
	var _game;

	window.snk = window.snk || {};

	function showCongrats() {
		var image = new Image();
		image.onload = function() {
			var loader = new L7.LevelLoader({
				boardConfig: {
					tileSize: 9,
					defaultTileColor: [20, 30, 40, 1],
					borderWidth: 1,
					borderFill: 'black'
				},
				legend: {
					'#000000': {
						constructor: snk.Water
					},
					'#FF0000': {
						constructor: snk.Island
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
				rateVariance: .2
			});

			level.board.addDaemon(shimmer);
			colorIslands(level.board);

			_game.replaceBoard(level.board);
		};

		image.src = 'GoodJob.png';
	}

	function colorIslands(board) {
		var islandTiles = board.query(function(tile) {
			return tile.has('island');
		});

		islandTiles.forEach(function(tile) {
			tile.inhabitants.first.color = [L7.rand(160, 190), L7.rand(160, 190), L7.rand(100, 120), 1];
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
			// Hole
			'#000000': {
				constructor: snk.Hole
			},

			// Island
			'#FF0000': {
				constructor: snk.Island
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
			tileSize: 16,
			borderWidth: 3,
			borderFill: 'black',
			parallaxRatio: 1
		};

		image.onload = function() {
			var loader = new L7.LevelLoader({
				boardConfig: boardConfig,
				legend: legend,
				image: image
			});

			var level = loader.load();

			var waterBoard = new L7.Board({
				width: 400,
				height: 400,
				tileSize: 8,
				borderWidth: 1,
				parallaxRatio: 0.25
			});

			waterBoard.tiles.forEach(function(tile) {
				tile.add(new snk.Water({
					position: tile.position.clone()
				}));
			});

			var shimmer = new Shimmer({
				tiles: waterBoard.tiles,
				minAlpha: 0.3,
				maxAlpha: 0.6,
				baseRate: 700,
				rateVariance: .2
			});

			waterBoard.addDaemon(shimmer);

			colorIslands(level.board);
			hookIntoApples(level.board);

			var p = new L7.ParallaxBoard({
				boards: [waterBoard, level.board]
			});

			_game = new L7.Game({
				board: p,
				width: 300,
				height: 300
			});

			_game.go();
		};

		image.src = 'BridgeLevel.png';
	};
})();

