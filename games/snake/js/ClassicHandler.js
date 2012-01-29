(function() {
	snk.ClassicHandler = function(config) {
		_.extend(this, config);
	};

	snk.ClassicHandler.prototype = {
		keyInputs: {
			left: {
				repeat: false,
				handler: function() {
					this.setDirection(snk.Direction.West);
				}
			},
			right: {
				repeat: false,
				handler: function() {
					this.setDirection(snk.Direction.East);
				}
			},
			up: {
				repeat: false,
				handler: function() {
					this.setDirection(snk.Direction.North);
				}
			},
			down: {
				repeat: false,
				handler: function() {
					this.setDirection(snk.Direction.South);
				}
			},
		},
		setDirection: function(dir) {
			if (!this._directionPending) {
				var added = this.direction.add(dir);

				if (added.x !== 0 && added.y !== 0) {
					this.direction = dir;
					this._directionPending = true;
				}
			}
		},
		timers: {
			move: {
				enabled: function() {
					return this.active;
				},
				handler: function() {
					this.moveSnake();
				},
				interval: 200
			}
		},
		hitDetection: {
			enabled: function() {
				return this.active;
			},
			snake: function() {
				this.die();
			},
			apple: function(tile, actor) {
				this.grow();
				actor.die();
			},
			wall: function() {
				this.die();
			}
		},
		die: function() {
			this.goSnakeBack();
			this.pieces.forEach(function(piece) {
				piece.color = [0, 0, 0, 1];
			});
			this.active = false;
			this.board.borderFill = 'red';
		},
		goSnakeBack: function() {
			this.pieces.forEach(function(piece) {
				this.board.movePiece({
					piece: piece,
					from: piece.position,
					to: piece.lastPosition
				});
			},
			this);
		},

		moveSnake: function() {
			this._lastPosition = this.position;
			this.position = this.position.add(this.direction);

			var lastPiecePosition = this.position;
			for (var i = 0; i < this.pieces.length; ++i) {
				var piece = this.pieces[i];
				var nextPosition = lastPiecePosition;
				lastPiecePosition = piece.position;
				this.board.movePiece({
					piece: piece,
					from: piece.position,
					to: nextPosition
				});
				piece.lastPosition = lastPiecePosition;
			}

			if (this._shouldGrow) {
				this._shouldGrow = false;
				this.grow();
			}
			this._directionPending = false;

			this.board.scrollCenterOn(this.position);
		},

		grow: function() {
			var position;
			if (this.pieces.length === 1) {
				var position = this.pieces.last.position.add(this.direction.negate());
			} else {
				delta = this.pieces.last.position.delta(this.pieces[this.pieces.length - 2].position);
				position = this.pieces.last.position.add(delta);
			}
			this.pieces.push({
				position: position,
				color: this.color,
				owner: this
			});
		},



		init: function(snake, isFirstTime) {
			_.extend(snake, this);

			delete snake.update;

			snake.position = snake.positionInTiles();
			snake.pieces.first.position = snake.position;
			snake.isTilePositioned = true;

			snake.direction = snk.Direction.East;

			this.board.removeActor(snake);
			this.board.removeFreeActor(snake);
			this.board.addActor(snake);
		}
	};
})();

