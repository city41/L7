(function() {
	function rand(min, max) {
		var range = max - min;
		return Math.floor(Math.random() * range) + min;
	}

	window.snk = window.snk || {};

	snk.go = function() {
		var board = new L7.Board({
			width: 40,
			height: 20,
			viewportAnchor: L7.p(0, 0),
			viewportWidth: 20,
			viewportHeight: 20,
			preventOverscroll: true,
			tileSize: 24,
			defaultTileColor: [20, 30, 40, 1],
			borderWidth: 6
		});

		var snake = new snk.Snake({
			position: L7.pr(4, board.height / 2),
			direction: snk.Direction.East
		});

		board.addActor(snake);
		board.addDaemon(new snk.Wind());

		function getEmptyPosition() {
			var position;
			do {
				position = L7.p(rand(1, board.width - 1), rand(1, board.height - 1))
			} while (board.tileAt(position).inhabitants.length > 0);

			return position;
		}

		function onAsteroidOutOfBounds() {
			board.removeActor(this);

			board.addActor(new snk.Asteroid({
				onOutOfBounds: onAsteroidOutOfBounds,
				size: rand(2, 6),
				position: L7.p(board.width - 10, rand(1, board.height)),
				color: [rand(90, 150), rand(100, 110), rand(30, 70), 1]
			}));
		}

		for (var i = 0; i < 12; ++i) {
			var asteroid = new snk.Asteroid({
				size: rand(2, 6),
				position: getEmptyPosition(),
				color: [rand(90, 150), rand(100, 110), rand(30, 70), 1],
				onOutOfBounds: onAsteroidOutOfBounds,
			});

			board.addActor(asteroid);
		}

		function onAppleOutOfBounds() {
			board.removeActor(this);
			var newApple = new snk.Apple({
				position: L7.p(board.width - 1, rand(1, board.height)),
				weight: rand(1, 3),
				onOutOfBounds: onAppleOutOfBounds
			});

			board.addActor(newApple);
		}

		for (var i = 0; i < 20; ++i) {
			var apple = new snk.Apple({
				position: getEmptyPosition(),
				weight: rand(1, 3),
				onOutOfBounds: onAppleOutOfBounds
			});

			board.addActor(apple);
		}

		new L7.Kernel(board).go();
	};

})();

