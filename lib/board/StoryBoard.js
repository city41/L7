(function() {
	L7.StoryBoard = function(boardConfigs) {
		this.boardConfigs = boardConfigs;

		this._currentBoardConfig = boardConfigs[0];
		var currentBoard = this._currentBoardConfig.board;

		this.width = currentBoard.width;
		this.height = currentBoard.height;
		this.tileSize = currentBoard.tileSize;
		this.borderWidth = currentBoard.borderWidth;
	};

	L7.StoryBoard.prototype = {
		update: function(delta, timestamp) {
			if(this._currentBoardConfig) {
				this._currentBoardConfig.board.update(delta, timestamp);
			}
		},

		render: function() {
			if(this._currentBoardConfig) {
				this._currentBoardConfig.board.render.apply(this._currentBoardConfig.board, arguments);
			}
		},

		clicked: function() {
			if(this._currentBoardConfig) {
				this._currentBoardConfig.board.clicked.apply(this._currentBoardConfig.board, arguments);
			}
		}
	};

	Object.defineProperty(L7.StoryBoard.prototype, 'pixelHeight', {
		get: function() {
			return this.height * (this.tileSize + this.borderWidth) + this.borderWidth;
		},
		enumerable: true
	});

	Object.defineProperty(L7.StoryBoard.prototype, 'pixelWidth', {
		get: function() {
			return this.width * (this.tileSize + this.borderWidth) + this.borderWidth;
		},
		enumerable: true
	});

	Object.defineProperty(L7.StoryBoard.prototype, 'viewport', {
		get: function() {
			return this._viewport;
		},
		set: function(v) {
			this._viewport = v;
			if(this._currentBoardConfig) {
				this._currentBoardConfig.board.viewport = v;
			}
		}
	});

	Object.defineProperty(L7.StoryBoard.prototype, 'game', {
		get: function() {
			return this._game;
		},
		set: function(g) {
			this._game = g;
			if(this._currentBoardConfig) {
				this._currentBoardConfig.board.game = g;
			}
		}
	});

})();

