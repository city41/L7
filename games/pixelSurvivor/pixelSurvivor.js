window.p = {};

p.go = function() {
	var board = new L7.Board({
		width: 40,
		height: 40,
		tileSize: 7,
		borderWidth: 1,
		borderFill: 'black'
	});

	board.tiles.forEach(function(t) {
		t.color = [30,30,30,1];
	});

	board.addActor(new p.Player({
		position: L7.pr(board.width/2, board.height/2)
	}));

	new L7.Game(board).go();
};

