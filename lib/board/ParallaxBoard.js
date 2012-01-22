(function() {
	L7.ParallaxBoard = function(config) {
		_.extend(this, config);
	};

	L7.ParallaxBoard.prototype = {
		update: function() {
			var args = _.toArray(arguments);
			this.boards.forEach(function(board) {
				board.update.apply(board, args);
			});
		},
		render: function(delta, context, anchorX, anchorY, timestamp) {
			this.boards.forEach(function(board) {
				board.render(delta, context, anchorX * board.parallaxRatio, anchorY * board.parallaxRatio, timestamp);
			});
		}
	};
})();

