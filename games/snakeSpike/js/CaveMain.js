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

			'#0000FF': {
				constructor: snk.Island
			},

			// Wall
			'#00FF00': {
				constructor: snk.Hole
			},

			// finish area
			'#CC00FF': {
				constructor: snk.FinishArea
			},

			// apple
			'#FF0000': {
				constructor: [snk.Island, snk.Apple]
			},

			// snake
			//'#0000FF': {
			//constructor: snk.PullSnake,
			//config: {
			//direction: snk.Direction.East,
			//rate: 200,
			//size: 2,
			//shouldGrow: true
			//}
			//}
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
			window.board = level.board;
			var snake = new snk.SnakeShell({
				position: L7.p(10, 120),
				positioningType: 'pixel',
				handler: new snk.HorizontalPullHandler({
					board: level.board
				}),
				active: true,
				color: [0, 0, 255, 1]
			});

			var handlers = [
				snake.handler,
				new snk.VerticalPullHandler({
						board: level.board
				}),
				new snk.ClassicHandler({
						board: level.board
				})
			];
			var curHandler = 0;

			level.board.addActor(new L7.Actor({
				keyInputs: {
					t: {
						repeat: false,
						handler: function() {
							curHandler += 1;
							curHandler = curHandler % (handlers.length);
							snake.popHandler();
							snake.pushHandler(handlers[curHandler]);
						}
					}
				}
			}));

			level.board.query(function(tile) {
				return tile.has('finish');
			}).forEach(function(tile, index) {
				if (index & 1 === 1) {
					tile.inhabitants.last.color = [0, 0, 0, 1];
				}
			});

			var wallBoard = new L7.Board({
				width: 300,
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
				width: 40 * (level.board.tileSize + level.board.borderWidth),
				height: 20 * (level.board.tileSize + level.board.borderWidth)
			});

			_game.go();
		};

		image.src = 'CaveLevel.png';
	};
})();

