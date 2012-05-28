(function() {
	var _noOffset = {
		x: 0,
		y: 0
	};

	L7.Actor = function(config) {
		_.extend(this, L7.Observable);
		_.extend(this, config);
		this.ani = new L7.AnimationFactory(this);

		this.position = this.position || L7.p(0, 0);
		this.keyInputs = this.keyInputs || {};

		if (this.framesConfig) {
			this.pieces = this._initFrames();
		} else {
			this.shape = this.shape || [[5]];
			this.pieces = this._createPieces();
		}

		this._listeners = {};

		this._offsetElapsed = 0;
	};

	L7.Actor.prototype = {
		setFrame: function(setIndex, frameIndex) {
			if(this.board) {
				this.board.removeActor(this);
				this.pieces = this.pieceSets[setIndex][frameIndex];
				this.board.addActor(this);
			} else {
				this.pieces = this.pieceSets[setIndex][frameIndex];
			}
		},

		_getMaxFrame: function(sets) {
			var maxFrame = 0;
			sets = sets || [];

			sets.forEach(function(set) {
				set.forEach(function(index) {
					if(index > maxFrame) {
						maxFrame = index;
					}
				});
			});

			return maxFrame + 1;
		},

		_createPiecesFromImagehorizontal: function() {
			var offset = this.framesConfig.offset || L7.p(0,0);
			var me = this;
			var pieceSources = [];

			var canvas = document.createElement('canvas');
			var context = canvas.getContext('2d');
			context.drawImage(this.framesConfig.src, 0, 0);

			var anchorOffset = this.framesConfig.anchor;
			var anchorPosition = this.position;

			function getRelPos(i) {
				i = i / 4;
				var x = i % me.framesConfig.width;
				var y = Math.floor(i / me.framesConfig.width);

				return L7.p(x, y);
			}

			var maxFrame = this._getMaxFrame(this.framesConfig.sets);
			var maxWidth = maxFrame * this.framesConfig.width;

			for (var x = 0; x < maxWidth; x += this.framesConfig.width) {
				var imageData = context.getImageData(x + offset.x,
																						 0 + offset.y, 
																						 this.framesConfig.width, this.framesConfig.height);
				var pieceSource = [];

				for (var i = 0; i < imageData.data.length; i += 4) {
					var alpha = imageData.data[i + 3] / 255;

					if (alpha) {
						var relPos = getRelPos(i);
						var anchorDelta = relPos.delta(anchorOffset);
						var piece = new L7.Piece({
							anchorDelta: anchorDelta,
							color: [imageData.data[i], imageData.data[i+1], imageData.data[i+2], alpha],
							owner: this,
							scale: _.isNumber(this.scale) ? this.scale: 1
						});
						pieceSource.push(piece);
					}
				}
				pieceSources.push(pieceSource);
			}

			return pieceSources;
		},

		_initFrames: function() {
			var pieceSources = this['_createPiecesFromImage' + this.framesConfig.direction]();

			this.pieceSets = [];

			this.framesConfig.sets.forEach(function(set) {
				var pieces = [];
				for (var i = 0; i < set.length; ++i) {
					pieces.push(pieceSources[set[i]]);
				}
				this.pieceSets.push(pieces);
			},
			this);

			return this.pieceSets[this.framesConfig.initialSet][this.framesConfig.initialFrame];
		},

		getAnimationTargets: function(filter) {
			if (filter) {
				return this.pieces.filter(filter);
			} else {
				return this.pieces;
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
						var color = this._getColor(x, y);
						var piece = new L7.Piece({
							anchorDelta: anchorDelta,
							color: color,
							owner: this,
							scale: _.isNumber(this.scale) ? this.scale: 1
						});
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
				positions.push(this.position.add(delta).add(piece.anchorDelta));
			}, this);

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

		goTo: function(newPosition) {
			if (this.onGoTo) {
				if (!this.onGoTo(this._getPiecePositionsAnchoredAt(this.position), this._getPiecePositionsAnchoredAt(newPosition), this.board)) {
					return;
				}
			}

			if (!this.smoothMovement && this.board) {
				this.board.moveActor({
					actor: this,
					from: this.position,
					to: newPosition
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
				var position = this.position.add(p.anchorDelta);
				if (position.x === x && position.y === y) {
					return p;
				}
			}
		}
	};

	Object.defineProperty(L7.Actor, 'ANCHOR', {
		get: function() {
			return 5;
		},
		enumerable: false
	});

	Object.defineProperty(L7.Actor.prototype, 'board', {
		get: function() {
			return this._board;
		},
		set: function(board) {
			var origBoard = this._board;
			this._board = board;

			if(board && board != origBoard && this.onBoardSet) {
				this.onBoardSet();
			}
		},
		enumerable: true
	});

})();

