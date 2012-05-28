(function() {
	L7.Board = function(config) {
		_.extend(this, config || {});

		if (L7.useWebGL) {
			_.extend(L7.Board.prototype, L7.WebGLBoardRenderMixin);
		} else {
			_.extend(L7.Board.prototype, L7.CanvasBoardRenderMixin);
		}

		this.ani = new L7.AnimationFactory(this, this);
		this.size = new L7.Pair(this.width || 0, this.height || 0);
		this.borderWidth = this.borderWidth || 0;
		this.tileSize = this.tileSize || 0;

		this._rows = [];
		this.tiles = [];
		for (var y = 0; y < this.height; ++y) {
			var row = [];
			for (var x = 0; x < this.width; ++x) {
				var tile = new L7.Tile({
					x: x,
					y: y,
					board: this
				});
				tile.color = _.clone(this.defaultTileColor);
				row.push(tile);
				this.tiles.push(tile);
			}
			this._rows.push(row);
		}

		this.actors = [];
		this.freeActors = [];
		this.daemons = [];

		this.viewportWidth = Math.min(this.viewportWidth || this.width, this.width);
		this.viewportHeight = Math.min(this.viewportHeight || this.height, this.height);
		this.viewportAnchorX = (this.viewportAnchor && this.viewportAnchor.x) || 0;
		this.viewportAnchorY = (this.viewportAnchor && this.viewportAnchor.y) || 0;
		delete this.viewportAnchor;

		this._hitManager = new L7.HitManager();
	};

	L7.Board.prototype = {
		clicked: function(position) {
			var tile = this.tileAtPixels(position);

			if (tile && tile.inhabitants.length > 0) {
				tile.inhabitants.last.owner.clicked();
				return true;
			} else {
				return false;
			}
		},

		dump: function() {
			console.log('');
			console.log('');
			this._rows.forEach(function(row) {
				var rs = '';
				row.forEach(function(tile) {
					var color = tile.getColor();
					if (!color) {
						rs += '.';
					} else {
						if (tile.inhabitants.length) {
							rs += 'a';
						} else {
							rs += 't'
						}
					}
				});
				console.log(rs);
			});
		},

		actorsOnTeam: function(team) {
			return this.actors.filter(function(actor) {
				return actor.team === team;
			});
		},
		tilesTagged: function(tag) {
			return this.tiles.filter(function(tile) {
				return tile.tag === tag;
			});
		},
		getAnimationTargets: function(filter) {
			// TODO: support more intelligent filters like:
			// 'tiles=disco'
			// 'actors=apple'
			// 'tiles=disco&&water'
			// 'tiles = disco || water'
			// etc
			if (filter === 'tiles') {
				return this.tiles;
			}
			if (filter === 'actors') {
				return this.actors;
			}
			if (filter === 'board') {
				return [this];
			}
			if (_.isArray(filter)) {
				return filter;
			}
			return this.tiles;
		},

		destroy: function() {},

		_clamp: function(value, min, max) {
			if (value < min) {
				return min;
			}
			if (value >= max) {
				return max;
			}
			return value;
		},
		_tileToPixels: function(quantity) {
			return (this.tileSize + this.borderWidth) * quantity;
		},
		scrollCenterOn: function(position) {
			var x = this._tileToPixels(position.x) + this.tileSize / 2;
			var y = this._tileToPixels(position.y) + this.tileSize / 2;
			this.viewport.centerOn(x, y);
		},
		scrollY: function(amount) {
			if (this.viewport) {
				this.viewport.scrollY(this._tileToPixels(amount));
			}
		},
		scrollX: function(amount) {
			if (this.viewport) {
				this.viewport.scrollX(this._tileToPixels(amount));
			}
		},
		scrollXY: function(xamount, yamount) {
			this.scrollX(xamount);
			this.scrollY(yamount);
		},
		column: function(index) {
			if (index < 0) {
				index = this.width + index;
			}
			var tiles = [];

			for (var y = 0; y < this.height; ++y) {
				tiles.push(this.tileAt(L7.p(index, y)));
			}
			return tiles;
		},

		row: function(varArgIndices) {
			var tiles = [];

			_.each(arguments, function(index) {
				if (index < 0) {
					index = this.height + index;
				}

				for (var x = 0; x < this.width; ++x) {
					tiles.push(this.tileAt(L7.p(x, index)));
				}
			},
			this);

			return tiles;
		},

		rect: function(x, y, w, h) {
			var tiles = [];

			for (var yy = y; yy < y + h; ++yy) {
				for (var xx = x; xx < x + w; ++xx) {
					tiles.push(this.tileAt(xx, yy));
				}
			}

			return tiles;
		},

		query: function(predicate) {
			var tiles = [];

			this.tiles.forEach(function(tile) {
				if (predicate(tile)) {
					tiles.push(tile);
				}
			});

			return tiles;
		},

		tileAt: function(positionOrX, yOrUndefined) {
			var x = _.isObject(positionOrX) ? positionOrX.x: positionOrX;
			var y = _.isNumber(yOrUndefined) ? yOrUndefined: positionOrX.y;

			if (y < 0 || y >= this.height || x < 0 || x >= this.width) {
				return null;
			}

			var offset = y * this.width + x;
			return this.tiles[offset];
		},

		tileAtPixels: function(positionOrX, yOrUndefined) {
			var x = _.isObject(positionOrX) ? positionOrX.x: positionOrX;
			var y = _.isNumber(yOrUndefined) ? yOrUndefined: positionOrX.y;

			var ox = this.offsetX || 0;
			var oy = this.offsetY || 0;

			var tileX = Math.floor((x + ox) / (this.tileSize + this.borderWidth));
			var tileY = Math.floor((y + oy) / (this.tileSize + this.borderWidth));

			return this.tileAt(tileX, tileY);
		},
		pixelsForTile: function(tile) {
			return L7.p(this._tileToPixels(tile.x), this._tileToPixels(tile.y));
		},

		tileTopInPixels: function(tile) {
			return this._tileToPixels(tile.y);
		},

		tileBottomInPixels: function(tile) {
			return this.tileTopInPixels(tile) + this.tileSize;
		},

		each: function(operation, scope) {
			this.tiles.forEach(operation, scope);
		},

		// Actor related function
		_addPieces: function(pieces) {
			pieces.forEach(function(piece) {
				var tile = this.tileAt(piece.position);
				if (tile) {
					tile.add(piece);
				}
			},
			this);
		},
		_removePieces: function(pieces) {
			pieces.forEach(function(piece) {
				var tile = this.tileAt(piece.position);
				if (tile) {
					tile.remove(piece);
				}
			},
			this);
		},
		promote: function(actor) {
			if (actor.pieces) {
				this._removePieces(actor.pieces);
				this._addPieces(actor.pieces);
			}
		},
		addActors: function(varargs) {
			var args = _.toArray(arguments);
			args.forEach(function(arg) {
				this.addActor(arg);
			},
			this);
		},
		addActor: function(actor) {
			if (actor.pieces) {
				this._addPieces(actor.pieces);
			}

			this.actors.push(actor);
			actor.board = this;
		},
		addFreeActor: function(freeActor) {
			this.freeActors.push(freeActor);
			freeActor.board = this;
		},
		removeFreeActor: function(freeActor) {
			this.freeActors.remove(freeActor);
			delete freeActor.board;
		},
		removeActor: function(actor) {
			if (actor.pieces) {
				this._removePieces(actor.pieces);
			}
			this.actors.remove(actor);
		},

		addDaemon: function(daemon) {
			this.daemons.push(daemon);
		},
		removeDaemon: function(daemon) {
			if (this.daemons.indexOf(daemon) > - 1 && daemon.onRemove) {
				daemon.onRemove(this);
			}
			this.daemons.remove(daemon);
		},

		isOutOfBounds: function(actor) {
			for (var i = 0, l = actor.pieces.length; i < l; ++i) {
				var p = actor.pieces[i].position;

				if (p.x < 0 || p.y < 0 || p.x >= this.width || p.y >= this.height) {
					return true;
				}
			}

			return false;
		},
		_movePiece: function(piece, delta) {
			var from = piece.position;
			var to = piece.position.add(delta);

			var fromTile = this.tileAt(from);
			if (fromTile) {
				fromTile.remove(piece);
			}

			var toTile = this.tileAt(to);
			if (toTile) {
				toTile.add(piece);
			}
		},

		movePiece: function(options) {
			this._movePiece(options.piece, options.delta || options.to.delta(options.from));
		},

		moveActor: function(options) {
			var delta = options.delta || options.to.delta(options.from);

			options.actor.pieces.forEach(function(piece) {
				this._movePiece(piece, delta);
			},
			this);

			options.actor._lastPosition = options.actor.position;
			options.actor.position = options.actor.position.add(delta);

			if (options.actor.onOutOfBounds && this.isOutOfBounds(options.actor)) {
				options.actor.onOutOfBounds.call(options.actor);
			}
		},

		update: function(delta, timestamp) {
			this.actors.forEach(function(actor) {
				actor.update(delta, timestamp);
			});

			this.freeActors.forEach(function(actor) {
				actor.update(delta, timestamp);
			});

			this.daemons.forEach(function(daemon) {
				daemon.update(delta, timestamp, this);
			},
			this);

			if (!this.disableHitDetection) {
				this._hitManager.detectHits(this.tiles);
			}
		}
	};

	Object.defineProperty(L7.Board.prototype, 'pixelHeight', {
		get: function() {
			return this.height * (this.tileSize + this.borderWidth) + this.borderWidth;
		},
		enumerable: true
	});

	Object.defineProperty(L7.Board.prototype, 'pixelWidth', {
		get: function() {
			return this.width * (this.tileSize + this.borderWidth) + this.borderWidth;
		},
		enumerable: true
	});
})();

