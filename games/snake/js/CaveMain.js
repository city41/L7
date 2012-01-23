(function() {
	var _remainingApples;
	var _game;

	window.snk = window.snk || {};

	snk.go = function() {
		var legend = {
			// Back of cave
			'#FFFF00': {
				constructor: snk.Island
			},

			// Wall
			'#00FF00': {
				constructor: snk.Hole
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
					rate: 200,
					size: 2,
					shouldGrow: true
				}
			}
		};

		var image = new Image();

		var boardConfig = {
			tileSize: 12,
			borderWidth: 2,
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

			var wallBoard = new L7.Board({
				width: 100,
				height: 20,
				tileSize: 24,
				borderWidth: 2,
				borderFill: 'black',
				parallaxRatio: 1.45
			});

			wallBoard.tiles.forEach(function(tile) {
				tile.add(new snk.Wall({
					position: tile.position
				}));
			});

			var shimmer = new Shimmer({
				tiles: wallBoard.tiles,
				minAlpha: 0.3,
				maxAlpha: 0.6,
				baseRate: 700,
				rateVariance: .2
			});

			wallBoard.addDaemon(shimmer);

			var p = new L7.ParallaxBoard({
				boards: [wallBoard, level.board]
			});

			_game = new L7.Game({
				board: p,
				width: 20 * (level.board.tileSize + level.board.borderWidth),
				height: 20 * (level.board.tileSize + level.board.borderWidth)
			});

			_game.go();
		};

		image.src = 'CaveLevel.png';
	};
})();


