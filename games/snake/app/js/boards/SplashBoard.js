(function() {
	snake.SplashBoard = function(config) {
		_.extend(this, config);
		this.elapsed = 0;
	};

	snake.SplashBoard.prototype = {
		update: function(delta) {
			this.elapsed += delta;

			if(this.elapsed >= this.duration) {
				if(this.onComplete) {
					this.onComplete();
				}
			}
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

