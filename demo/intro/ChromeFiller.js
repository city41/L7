(function() {
	var _socialNetworks = {
		facebook: 'http://www.facebook.com/sharer.php?u=',
		twitter: 'https://twitter.com/share?url=',
		gplus: 'https://plusone.google.com/_/+1/confirm?hl=en&url='
	};

	function popup(key) {
		var url = _socialNetworks[key] + window.location;

		window.open(url, '_blank', 'channelmode=0,directories=0,fullscreen=0,location=1,width=500,height=500');
	}

	i.ChromeFiller = {
		fill: function(board) {
			this._board = board;

			board.tiles.forEach(function(tile) {
				tile.opaque = true;
			});

			this._addPlayButton(board);

			this._addClickActor(board, 'facebook', L7.p(124, 2));
			this._addClickActor(board, 'gplus', L7.p(134, 2));
			this._addClickActor(board, 'twitter', L7.p(144, 2));
		},

		_addClickActor: function(board, key, position) {
			var click = new L7.Actor({
				color: [0,0,0,0],
				position: position,
				shape: [[5, 1, 1, 1, 1, 1], [1, 1, 1, 1, 1, 1], [1, 1, 1, 1, 1, 1], [1, 1, 1, 1, 1, 1], [1, 1, 1, 1, 1, 1], [1, 1, 1, 1, 1, 1]]
			});

			board.addActor(click);

			click.on('click', function() {
				popup(key);
			});
		},

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
				if (this.pauseButton) {
					this._board.removeActor(this.pauseButton);
				}
				this._addPlayButton(this._board);
			} else {
				if (this.playButton) {
					this._board.removeActor(this.playButton);
				}
				this._addPauseButton(this._board);
			}
		}
	};
})();

