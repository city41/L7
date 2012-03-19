i.ChromeFiller = {
	fill: function(board) {
		this._board = board;

		this._addPlayButton(board);

		this._addProgressBar(board);

	},

	_addProgressBar: function(board) {},

	_addPlayButton: function(board) {
		if (!this.playButton) {
			this.playButton = new L7.Actor({
				color: [212, 212, 212, 1],
				shape: [[5, 0, 0, 0, ], [1, 1, 1, 0], [1, 1, 1, 1], [1, 1, 1, 0], [1, 0, 0, 0]],
				position: L7.p(2, 3)
			});
			this.playButton.on('click', this._togglePause, this);
		}

		board.addActor(this.playButton);
	},

	_addPauseButton: function(board) {
		if (!this.pauseButton) {
			this.pauseButton = new L7.Actor({
				color: [212, 212, 212, 1],
				shape: [[5, 1, 0, 1, 1], [1, 1, 0, 1, 1], [1, 1, 0, 1, 1], [1, 1, 0, 1, 1], [1, 1, 0, 1, 1]],
				position: L7.p(2, 3)
			});
			this.pauseButton.on('click', this._togglePause, this);
		}

		board.addActor(this.pauseButton);
	},

	_togglePause: function(actor) {
		actor.board.game.paused = ! actor.board.game.paused;

		if (actor.board.game.paused) {
			if(this.pauseButton) {
				this._board.removeActor(this.pauseButton);
			}
			this._addPlayButton(this._board);
		} else {
			if(this.playButton) {
				this._board.removeActor(this.playButton);
			}
			this._addPauseButton(this._board);
		}
	}
};

