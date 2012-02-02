(function() {
	snake.SplashBoard = function(config) {
		_.extend(this, config);
	};

	snake.SplashBoard.prototype = {
		update: function(delta) {
		},
		render: function(delta, context) {
			context.fillStyle = 'black';
			context.fillRect(0, 0, context.canvas.width, context.canvas.height);
			context.fillStyle = 'red';
			context.font = '40px sans-serif';
			context.fillText('city41', 100, 100);
		}
	};
})();

