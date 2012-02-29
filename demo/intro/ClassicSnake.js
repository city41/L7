(function() {
	var _snakeConfig = {
		keyInputs: {
			left: {
				repeat: false,
				handler: function() {
					this.setDirection(i.Direction.West);
				}
			},
			right: {
				repeat: false,
				handler: function() {
					this.setDirection(i.Direction.East);
				}
			},
			up: {
				repeat: false,
				handler: function() {
					this.setDirection(i.Direction.North);
				}
			},
			down: {
				repeat: false,
				handler: function() {
					this.setDirection(i.Direction.South);
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
					//this.moveSnake();
				}
			}
		},
		team: 'snake',
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
			this.dead = true;
			this.board.borderFill = 'red';
		},
		color: [0, 255, 0, 1],
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
				var delta = piece.position.delta(piece.lastPosition);
				piece.nextPosition = piece.position.add(delta);
			}

			this._directionPending = false;
		},

		addPiece: function() {
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

		grow: function() {
			if (this.board) {
				this.doEatAnimation();
			} else {
				this.addPiece();
			}
		},

		doEatAnimation: function() {
			var me = this;
			this.ani.sequence(function(ani) {
				me.pieces.forEach(function(piece) {
					ani.tween({
						targets: [piece],
						property: 'scale',
						from: 1,
						to: 1.5,
						duration: 75
					});
					ani.tween({
						targets: [piece],
						property: 'scale',
						from: 1.5,
						to: 1,
						duration: 75
					});
				});
				ani.invoke(function() {
					me.addPiece();
				});
				ani.die();
			});
		},
		update: function(delta, timestamp) {
			L7.Actor.prototype.update.call(this, delta, timestamp);

			this._offsetElapsed += delta;

			if(this._offsetElapsed >= this.rate) {
				this._offsetElapsed -= this.rate;
				this.moveSnake();
			}

			var offset = this._offsetElapsed / this.rate;

			this.pieces.forEach(function(piece) {
				if(piece.nextPosition) {
					var towards = piece.nextPosition.delta(piece.position);
					piece.offset = {
						x: offset * towards.x,
						y: offset * towards.y
					};
				}
			});
		}
	};

	i.ClassicSnake = function(config) {
		config = _.extend({
			rate: 1000,
			direction: window.i.Direction.East,
			active: false
		},
		config);

		var actor = new L7.Actor(_.extend(config, _snakeConfig));
		actor._offsetElapsed = 0;

		actor.timers.move.interval = config.rate;

		actor.pieces = [new L7.Piece({
			position: actor.position,
			color: [0, 150, 0, 1],
			owner: actor
		})];

		var size = config.size || 1;
		for (var i = 1; i < size; ++i) {
			actor.grow();
		}

		if (config.dontGrow) {
			actor.grow = function() {};
		}

		return actor;
	};

})();

