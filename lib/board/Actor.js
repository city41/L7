(function() {
	var _defaults = {
			position: L7.p(0, 0),
			shape: [[5]],
			color: [255, 128, 0, 1],
			keyInputs: {}
	};

	L7.Actor = function(config) {
		_.extend(this, _defaults, config || {});

		this.pieces = this._createPieces();
	};

	L7.Actor.prototype = {
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
			return this.color;
			var color;
			if (_.isString(this.color)) {
				color = this.color;
			} else if (_.isArray(this.color)) {
				color = this.color[y][x];
			}
			return color;
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
							owner: this
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
			this.goTo(this.position.add(0, -amount));
		},

		down: function(amount) {
			this.goTo(this.position.add(0, amount));
		},

		goBack: function() {
			this.goTo(this._lastPosition.clone());
		},

		goTo: function(pos) {
			if(this.onGoTo) {
				if(!this.onGoTo(this._getPiecePositionsAnchoredAt(this.position), this._getPiecePositionsAnchoredAt(pos), this.board)) {
					return;
				}
			}

			this._lastPosition = this.position.clone();

			this.position = pos;

			if(this.board) {
				this.board.moveActor({
					actor: this,
					from: this._lastPosition,
					to: this.position
				});
			}

			if (this.onOutOfBounds && this.board.isOutOfBounds(this)) {
				this.onOutOfBounds.call(this);
			}
		},
		update: function(delta, timestamp) {
			_(this.keyInputs).each(function(value, key) {
				if (value.repeat && L7.Keys.down(key) || L7.Keys.downSince(key, this._lastTimestamp || 0)) {
					if (typeof value.enabled === 'undefined' || value.enabled.call(this)) {
						value.handler.call(this);
					}
				}
			},
			this);

			this._updateTimers(delta);

			this._lastTimestamp = timestamp;
		},

		_updateTimers: function(delta) {
			if (!this.timers) {
				return;
			}

			_.each(this.timers, function(timer) {
				if (typeof timer.enabled === 'undefined'
					|| timer.enabled === true 
					|| (typeof timer.enabled === 'function' && timer.enabled.call(this))) {

					timer.elapsed = timer.elapsed || 0;
					timer.elapsed += delta;
					if (timer.elapsed >= timer.interval) {
						timer.elapsed -= timer.interval;
						timer.handler.call(this);
					}
				}
			},
			this);
		}
	};

	Object.defineProperty(L7.Actor, 'ANCHOR', {
		get: function() {
			return 5
		},
		enumerable: false
	});

})();

