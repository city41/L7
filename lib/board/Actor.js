(function() {
	var _noOffset = { x: 0, y: 0 };

	L7.Actor = function(config) {
		_.extend(this, config);
		this.ani = new L7.AnimationFactory(this);

		this.position = this.position || L7.p(0, 0);
		this.shape = this.shape || [[5]];
		this.keyInputs = this.keyInputs || {};

		this.pieces = this._createPieces();
		this._listeners = {};

		this._offsetElapsed = 0;
	};

	L7.Actor.prototype = {
		getAnimationTargets: function(filter) {
			if (filter) {
				return this.pieces.filter(filter);
			} else {
				return this.pieces;
			}
		},

		on: function(eventName, handler, scope) {
			if (!this._listeners[eventName]) {
				this._listeners[eventName] = [];
			}

			this._listeners[eventName].push({
				handler: handler,
				scope: scope
			});
		},

		fireEvent: function(eventName, varargs) {
			var listeners = this._listeners[eventName];

			if (_.isArray(listeners)) {
				var args = _.toArray(arguments);
				args.shift();
				_.each(listeners, function(listener) {
					listener.handler.apply(listener.scope, args);
				});
			}
		},

		clicked: function() {
			this.fireEvent('click', this);
		},


		_getAnchorOffset: function() {
			var x, y;

			for (y = 0; y < this.shape.length; ++y) {
				for (x = 0; x < this.shape[y].length; ++x) {
					if (this.shape[y][x] === L7.Actor.ANCHOR) {
						return L7.p(x, y);
					}
				}
			}

			throw new Error("shape specified but lacks an anchor");
		},

		_getColor: function(x, y) {
			if (!this.color) {
				return;
			}

			if (_.isNumber(this.color[0])) {
				return this.color.slice(0);
			} else {
				return this.color[y][x].slice(0);
			}
		},

		_createPieces: function() {
			var pieces = [];

			var anchorOffset = this._getAnchorOffset();
			var anchorPosition = this.position;

			for (var y = 0; y < this.shape.length; ++y) {
				var srow = this.shape[y];
				for (var x = 0; x < srow.length; ++x) {
					if (this.shape[y][x]) {
						var anchorDelta = L7.p(x, y).delta(anchorOffset);
						var piecePosition = anchorPosition.add(anchorDelta);
						var color = this._getColor(x, y);
						var piece = new L7.Piece({
							position: piecePosition,
							color: color,
							isAnchor: this.shape[y][x] === L7.Actor.ANCHOR,
							owner: this,
							scale: _.isNumber(this.scale) ? this.scale: 1
						});
						if (piece.isAnchor) {
							this.anchorPiece = piece;
						}
						pieces.push(piece);
					}
				}
			}

			return pieces;
		},

		_getPiecePositionsAnchoredAt: function(pos) {
			var delta = pos.delta(this.position);
			var positions = [];

			_.each(this.pieces, function(piece) {
				positions.push(piece.position.add(delta));
			});

			return positions;
		},

		left: function(amount) {
			this.goTo(this.position.add(-amount, 0));
		},

		right: function(amount) {
			this.goTo(this.position.add(amount, 0));
		},

		up: function(amount) {
			this.goTo(this.position.add(0, - amount));
		},

		down: function(amount) {
			this.goTo(this.position.add(0, amount));
		},

		goBack: function() {
			this.goTo(this._lastPosition.clone());
		},

		goTo: function(pos) {
			if (this.onGoTo) {
				if (!this.onGoTo(this._getPiecePositionsAnchoredAt(this.position), this._getPiecePositionsAnchoredAt(pos), this.board)) {
					return;
				}
			}

			this._lastPosition = this.position;

			this.position = pos;

			if (!this.smoothMovement && this.board) {
				this.board.moveActor({
					actor: this,
					from: this._lastPosition,
					to: this.position
				});
			}
		},
		update: function(delta, timestamp) {
			this._updateKeyInputs(delta, timestamp);
			this._updateTimers(delta);
			this._lastTimestamp = timestamp;

			if (this.smoothMovement && this._lastPosition) {
				this._offsetElapsed += delta;
				if (this._offsetElapsed >= this.rate) {
					this._offsetElapsed -= this.rate;
					this.board.moveActor({
						actor: this,
						from: this._lastPosition,
						to: this.position
					});
					this._lastPosition = null;
				}

				var offsets = _noOffset;

				if (this._lastPosition) {
					var offset = this._offsetElapsed / this.rate;
					var towards = this.position.delta(this._lastPosition);
					offsets = {
						x: offset * towards.x,
						y: offset * towards.y
					};
				} 

				this.pieces.forEach(function(piece) {
					piece.offset = offsets;
				});
			}
		},

		_updateKeyInputs: function(delta, timestamp) {
			var keyWasDown = false;
			_(this.keyInputs).each(function(value, key) {
				if (value.repeat && L7.Keys.down(key) || L7.Keys.downSince(key, this._lastTimestamp || 0)) {
					keyWasDown = true;
					value._elapsed = value._elapsed || 0;
					value._elapsed += delta;

					if (typeof value.enabled === 'undefined' || value.enabled.call(this)) {
						if (!value.rate || value._elapsed > value.rate) {
							value.handler.call(this, delta);
							value._elapsed -= (value.rate || 0);
						}
					}
				} else {
					value._elapsed = 0;
				}
			},
			this);

			if (!keyWasDown && this.onNoKeyDown) {
				this.onNoKeyDown(delta);
			}
		},

		_updateTimers: function(delta) {
			if (!this.timers) {
				return;
			}

			_.each(this.timers, function(timer) {
				if (typeof timer.enabled === 'undefined' || timer.enabled === true || (typeof timer.enabled === 'function' && timer.enabled.call(this))) {

					timer.elapsed = timer.elapsed || 0;
					timer.elapsed += delta;
					if (timer.elapsed >= timer.interval) {
						timer.elapsed -= timer.interval;
						timer.handler.call(this);
					}
				}
			},
			this);
		},

		pieceAt: function(x, y) {
			var l = this.pieces.length,
			p;

			while (l--) {
				p = this.pieces[l];
				if (p.position.x === x && p.position.y === y) {
					return p;
				}
			}
		}
	};

	Object.defineProperty(L7.Actor, 'ANCHOR', {
		get: function() {
			return 5
		},
		enumerable: false
	});

})();

