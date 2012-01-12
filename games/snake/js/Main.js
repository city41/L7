(function() {
	function rand(min, max) {
		var range = max - min;
		return Math.floor(Math.random() * range) + min;
	}

	window.snk = window.snk || {};

	snk.go = function(containerId) {
		var board = new L7.Board({
			width: 20,
			height: 60,
			viewportAnchor: L7.p(0, 0),
			viewportWidth: 20,
			viewportHeight: 20,
			preventOverscroll: true,
			tileSize: 30,
			defaultTileColor: [50, 50, 50, 1],
			borderWidth: 6,
			//container: document.getElementById(containerId)
		});

		var snake = new snk.Snake({
			position: L7.p(4, 4),
			direction: snk.Direction.East,
			rate: 150
		});

		board.addActor(snake);

		board.column(0).forEach(function(tile) {
			board.addActor(new snk.Wall({
				position: tile.position
			}));
		});

		board.column(-1).forEach(function(tile) {
			board.addActor(new snk.Wall({
				position: tile.position
			}));
		});

		board.row(0).forEach(function(tile) {
			if(tile.position.x > 0 && tile.position.x < board.width - 1) {
				board.addActor(new snk.Wall({
					position: tile.position
				}));
			}
		});

		board.row(-1).forEach(function(tile) {
			if(tile.position.x > 0 && tile.position.x < board.width - 1) {
				board.addActor(new snk.Wall({
					position: tile.position
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
