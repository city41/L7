(function() {
	L7.ParallaxBoard = function(config) {
		_.extend(this, config);
		this.boards = this.boards || [];

		this.boards.forEach(function(board, i) {
			board.parallaxRatio = board.parallaxRatio || 0;
			if (!_.isNumber(board.depth)) {
				board.depth = i;
			}
		},
		this);
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
				if(board.visible !== false) {
					board.render(delta, context, anchorX * board.parallaxRatio, anchorY * board.parallaxRatio, timestamp);
				}
			});
		},

		clicked: function(position) {
			var l = this.boards.length;
			while(l--) {
				if(this.boards[l].clicked(position)) {
					return;
				}
			}
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

	Object.defineProperty(L7.ParallaxBoard.prototype, 'game', {
		get: function() {
			return this.game;
		},
		set: function(game) {
			this.boards.forEach(function(board) {
				board.game = game;
			});
		},
		enumerable: true
	});

})();

