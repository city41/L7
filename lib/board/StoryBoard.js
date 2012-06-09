(function() {
	L7.StoryBoard = function(boardConfigs) {
		this.boardConfigs = boardConfigs;

		this._setCurrentBoard(0);

	};

	L7.StoryBoard.prototype = {
		_setCurrentBoard: function(index) {
			this._currentBoardIndex = index;
			var boardConfig = this.boardConfigs[index];

			if (boardConfig) {
				this._currentBoardConfig = boardConfig;
				var currentBoard = this._currentBoardConfig.board;

				this.width = currentBoard.width;
				this.height = currentBoard.height;
				this.tileSize = currentBoard.tileSize;
				this.borderWidth = currentBoard.borderWidth;

				this._currentDuration = boardConfig.duration;
				currentBoard.viewport = this.viewport;
				currentBoard.game = this.game;
			}
		},

		_setNextBoard: function() {
			if(this._currentBoardConfig.board && this._currentBoardConfig.board.destroy) {
				this._currentBoardConfig.board.destroy();
			}
			this._setCurrentBoard(this._currentBoardIndex + 1);
		},

		update: function(delta, timestamp) {
			if (this._currentBoardConfig) {
				this._currentBoardConfig.board.update(delta, timestamp);

				this._currentDuration -= delta;
				if(this._currentDuration <= 0) {
					this._setNextBoard();
				}
			}
		},

		render: function() {
			if (this._currentBoardConfig) {
				this._currentBoardConfig.board.render.apply(this._currentBoardConfig.board, arguments);
			}
		},

		clicked: function() {
			if (this._currentBoardConfig) {
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
			if (this._currentBoardConfig) {
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
			if (this._currentBoardConfig) {
				this._currentBoardConfig.board.game = g;
			}
		}
	});

})();

