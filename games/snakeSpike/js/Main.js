(function() {
	function rand(min, max) {
		var range = max - min;
		return Math.floor(Math.random() * range) + min;
	}

	window.snk = window.snk || {};

	snk.go = function(containerId) {
		var _level = 1;
		var _appleCount;

		var board = new L7.Board({
			width: 20,
			height: 20,
			//viewportAnchor: L7.p(0, 0),
			//viewportWidth: 20,
			//viewportHeight: 20,
			preventOverscroll: true,
			tileSize: 24,
			defaultTileColor: [20, 30, 40, 1],
			borderWidth: 6,
			//container: document.getElementById(containerId)
		});

		var snake = new snk.Snake({
			position: L7.p(4, 4),
			direction: snk.Direction.East,
			rate: 250
		});

		board.addActor(snake);

		board.row(10, 11, 12).forEach(function(tile) {
			board.addActor(new snk.Water({
				position: tile.position
			}));
		});

		board.rect(5, 10, 2, 3).forEach(function(tile) {
			board.addActor(new snk.Bridge({
				position: tile.position
			}));
		});

		board.rect(12, 10, 1, 3).forEach(function(tile) {
			board.addActor(new snk.Bridge({
				position: tile.position
			}));
		});


		board.column(0).forEach(function(tile) {
			board.addActor(new snk.Wall({
				position: tile.position
			}));
		});

		board.column( - 1).forEach(function(tile) {
			board.addActor(new snk.Wall({
				position: tile.position
			}));
		});

		board.row(0).forEach(function(tile) {
			if (tile.position.x > 0 && tile.position.x < board.width - 1) {
				board.addActor(new snk.Wall({
					position: tile.position
				}));
			}
		});

		board.row( - 1).forEach(function(tile) {
			if (tile.position.x > 0 && tile.position.x < board.width - 1) {
				board.addActor(new snk.Wall({
					position: tile.position
				}));
			}
		});

		var portal = new snk.Portal({
			orangePosition: L7.p(8, 6),
			bluePosition: L7.p(2, 17)
		});

		board.addActor(portal);

		function getEmptyPosition() {
			var position;
			do {
				position = L7.p(rand(1, board.width - 1), rand(1, board.height - 1))
			} while (board.tileAt(position).inhabitants.length > 0);

			return position;
		}

		function _setUpLevel(level) {
			var appleCount = 0;
			for (var i = 0; i < level + 1; ++i) {
				var position = getEmptyPosition();
				var apple = new snk.Apple({
					position: position
				});
				apple.on('death', function() {--_appleCount;
					if (_appleCount <= 0) {++_level;
						_appleCount = _setUpLevel(_level, board);

						if (snake.timers.move.interval > 50) {
							snake.timers.move.interval -= 20;
						}

						board.movePiece({
							piece: portal.orangePiece,
							from: portal.orangePiece.position,
							to: L7.p(rand(1, board.width - 1), rand(1, board.height - 1))
						});

						board.movePiece({
							piece: portal.bluePiece,
							from: portal.bluePiece.position,
							to: L7.p(rand(1, board.width - 1), rand(1, board.height - 1))
						});
					}
				});
				board.addActor(apple); ++appleCount;
			}
			return appleCount;
		}

		_appleCount = _setUpLevel(_level);

		new L7.Kernel(board).go();
	};

})();

