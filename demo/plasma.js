L7.Keys.init();

var board = new L7.Board({
	tileSize: 10,
	borderWidth: 2,
	width: 20,
	height: 20,
	borderFill: 'black'
});

board.ani.repeat(Infinity, function(ani) {
	ani.plasma({
		rate: 120
	});
});

var game = new L7.Game({
	board: board,
	container: document.getElementById('plasmaContainer'),
	width: board.width * (board.tileSize + board.borderWidth) + board.borderWidth,
	height: board.height * (board.tileSize + board.borderWidth) + board.borderWidth
});

game._doFrame(Date.now());
game.paused = true;

game.canvas.onclick = function() {
	game.paused = ! game.paused;
};

