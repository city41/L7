(function() {
	var _evens = [];
	var _odds = [];
	function setupSlinkAnimation(snake) {
		var span = 80;
		var scale = 1.25;
		_evens = [];
		_odds = [];

		snake.pieces.forEach(function(piece, i) {
			if (i > 0) {
				if (i & 1 === 1) {
					_odds.push(piece);
				} else {
					_evens.push(piece);
				}
			}
		});

		snake.ani.repeat(Infinity, function(ani) {
			ani.together(function(ani) {
				ani.sequence({
					targets: _evens
				},
				function(ani) {
					ani.wait(span);
					ani.tween({
						property: 'scale',
						from: 1,
						to: scale,
						duration: span / 2
					});
					ani.tween({
						property: 'scale',
						from: scale,
						to: 1,
						duration: span / 2
					});
				});
				ani.sequence({
					targets: _odds
				},
				function(ani) {
					ani.tween({
						property: 'scale',
						from: 1,
						to: scale,
						duration: span / 2
					});
					ani.tween({
						property: 'scale',
						from: scale,
						to: 1,
						duration: span / 2
					});
					ani.wait(span);
				});
			});
		});
	}

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
		team: 'snake',
		hitDetection: {
			enabled: function() {
				return this.active;
			},
			apple: function(tile, actor) {
				this.grow();
				actor.die();
			}
		},
		color: [0, 255, 0, 1],

		moveSnake: function() {
			for (var i = this.pieces.length - 1; i > 0; --i) {
				var piece = this.pieces[i];

				this.board.movePiece({
					piece: piece,
					from: piece.position,
					to: piece.nextPosition
				});

				var nextPiece = this.pieces[i - 1];
				piece.nextPosition = nextPiece.nextPosition;
			}

			var firstPiece = this.pieces.first;

			this.board.movePiece({
				piece: firstPiece,
				from: firstPiece.position,
				to: firstPiece.nextPosition
			});

			firstPiece.nextPosition = firstPiece.nextPosition.add(this.direction);
			this.position = firstPiece.position;
			this._directionPending = false;
		},

		addPiece: function() {
			var position, nextPosition;
			if (this.pieces.length === 1) {
				nextPosition = this.pieces.last.position;
				position = nextPosition.add(this.direction.negate());
			} else {
				delta = this.pieces.last.position.delta(this.pieces[this.pieces.length - 2].position);
				position = this.pieces.last.position.add(delta);
				nextPosition = this.pieces.last.position;
			}

			var newPiece = {
				position: position,
				nextPosition: nextPosition,
				color: this.color,
				owner: this,
				scale: 0.85
			};

			this.pieces.push(newPiece);

			for (var i = 0; i < this.pieces.length - 1; ++i) {
				this.pieces[i].scale = 1;
			}

			if (this.board) {
				this.board.movePiece({
					piece: newPiece,
					from: newPiece.position,
					to: newPiece.position
				});
				if((this.pieces.length-1) & 1 === 1) {
					_odds.push(newPiece);	
				} else {
					_evens.push(newPiece);
				}
			}
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

			if (!this.active) {
				return;
			}

			if(this.script && this.curScript < this.script.length - 1) {
				if(this.position.equals(this.script[this.curScript].p)) {
					this.rate = this.script[this.curScript].r || this.rate;

					this.curScript += 1;
					this.direction = this.script[this.curScript].p.delta(this.script[this.curScript-1].p).normalize();
					this.pieces.first.nextPosition = this.position.add(this.direction);
				}
				if((this.curScript === this.script.length - 1) && this.stopAfterScript) {
					this.active = false;
				}
			}

			this._offsetElapsed += delta;

			if (this._offsetElapsed >= this.rate) {
				this._offsetElapsed -= this.rate;
				this.moveSnake();
			}

			var offset = this._offsetElapsed / this.rate;

			this.pieces.forEach(function(piece) {
				if (piece.nextPosition) {
					var towards = piece.nextPosition.delta(piece.position);
					piece.offset = {
						x: offset * towards.x,
						y: offset * towards.y
					};
				}
			});

			this.hitManager.detectHitsForActor(this);
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

		if(actor.script) {
			actor.curScript = 0;
		}

		actor.pieces = [new L7.Piece({
			position: actor.position,
			nextPosition: actor.position.add(actor.direction),
			color: [0, 150, 0, 1],
			owner: actor,
			scale: 1
		})];

		var size = config.size || 1;
		for (var i = 1; i < size; ++i) {
			actor.grow();
		}

		if (config.dontGrow) {
			actor.grow = function() {};
		}

		actor.hitManager = new L7.HitManager();

		Object.defineProperty(actor, 'board', {
			get: function() {
				return this._board;
			},
			set: function(b) {
				this._board = b;
				//setupSlinkAnimation(this);
			}
		});

		return actor;
	};

})();

