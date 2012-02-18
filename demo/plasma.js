L7.Keys.init();

var board = new L7.Board({
	tileSize: 10,
	borderWidth: 2,
	width: 20,
	height: 20,
	borderFill: 'black'
});

board.ani.together(function(ani) {
	ani.repeat(Infinity, function(ani) {
		ani.plasma({
			rate: 120,
			filter: board.rect(0, 0, 10, 10),
			weights: [0.8, 0.2, 0.1]
		});
	});
	ani.repeat(Infinity, function(ani) {
		ani.plasma({
			rate: 120,
			filter: board.rect(0, 10, 10, 10),
			weights: [0.2, 0.6, 0.2]
		});
	});
	ani.repeat(Infinity, function(ani) {
		ani.plasma({
			rate: 120,
			filter: board.rect(10, 0, 10, 10),
			weights: [0.3, 0.3, 0.8]
		});
	});
	ani.repeat(Infinity, function(ani) {
		ani.plasma({
			rate: 120,
			filter: board.rect(10, 10, 10, 10)
		});
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

