(function() {
	L7.ParallaxBoard = function(config) {
		_.extend(this, config);
		this.boards = this.boards || [];

		this.boards.forEach(function(board, i) {
			if (!_.isNumber(board.parallaxRatio)) {
				throw new Error("ParallaxBoard: given a board that lacks a parallax ratio");
			}
			if (!_.isNumber(board.depth)) {
				board.depth = i;
			}
		}, this);
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

	Object.defineProperty(L7.ParallaxBoard.prototype, 'viewport', {
		get: function() {
			return this.viewport;
		},
		set: function(viewport) {
			this.boards.forEach(function(board) {
				board.viewport = viewport;
			});
		},
		enumerable: true
	});
})();

