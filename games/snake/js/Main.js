(function() {
	function rand(min, max) {
		var range = max - min;
		return Math.floor(Math.random() * range) + min;
	}

	window.snk = window.snk || {};

	snk.go = function(containerId) {
		var board = new L7.Board({
			width: 20,
			height: 20,
			tileSize: 30,
			defaultTileColor: [50, 50, 50, 1],
			borderWidth: 6,
			//container: document.getElementById(containerId)
		});

		var snake = new snk.Snake({
			position: L7.p(4, 4),
			direction: snk.Direction.East,
			rate: 200
		});

		board.addActor(snake);

		board.column(0).forEach(function(position) {
			board.addActor(new snk.Wall({
				position: position
			}));
		});

		board.column(-1).forEach(function(position) {
			board.addActor(new snk.Wall({
				position: position
			}));
		});

		board.row(0).forEach(function(position) {
			if(position.x > 0 && position.x < board.width - 1) {
				board.addActor(new snk.Wall({
					position: position
				}));
			}
		});

		board.row(-1).forEach(function(position) {
			if(position.x > 0 && position.x < board.width - 1) {
				board.addActor(new snk.Wall({
					position: position
				}));
			}
		});

		board.column(7).forEach(function(position) {
			if(position.y > 0 && position.y < 8) {
				board.addActor(new snk.Wall({
					position: position
				}));
			}
		});

		for(var i = 0; i < 10; ++i) {
			board.addActor(new snk.Apple({
				position: L7.p(rand(1, board.width - 1), rand(1, board.height - 1))
			}));
		};

		new L7.Kernel(board).go();
	};

})();
