(function() {
	L7.Board = function(config) {
		_.extend(this, config || {});
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
					y: y
				});
				if (this.defaultTileColor) {
					tile.color = _.clone(this.defaultTileColor);
				}
				row.push(tile);
				this.tiles.push(tile);
			}
			this._rows.push(row);
		}

		this.actors = [];
		this.daemons = [];

		this.viewportWidth = Math.min(this.viewportWidth || this.width, this.width);
		this.viewportHeight = Math.min(this.viewportHeight || this.height, this.height);
		this.viewportAnchorX = (this.viewportAnchor && this.viewportAnchor.x) || 0;
		this.viewportAnchorY = (this.viewportAnchor && this.viewportAnchor.y) || 0;
		delete this.viewportAnchor;
		this.canvas = this._createCanvas(this.tileSize, this.viewportWidth, this.viewportHeight, this.borderWidth, this.container || document.body);

		this._hitManager = new L7.HitManager();
	};

	L7.Board.prototype = {
		_clamp: function(value, min, max) {
			if (value < min) {
				return min;
			}
			if (value >= max) {
				return max;
			}
			return value;
		},
		scrollCenterOn: function(position) {
			this.viewportAnchorY = Math.floor(position.y - this.viewportHeight / 2);
			this.viewportAnchorX = Math.floor(position.x - this.viewportHeight / 2);

			if (this.preventOverscroll) {
				this.viewportAnchorY = this._clamp(this.viewportAnchorY, 0, this.height - this.viewportHeight);
				this.viewportAnchorX = this._clamp(this.viewportAnchorX, 0, this.width - this.viewportWidth);
			}
		},
		scrollY: function(amount) {
			this.viewportAnchorY += amount;

			if (this.preventOverscroll) {
				this.viewportAnchorY = this._clamp(this.viewportAnchorY, 0, this.viewportHeight);
			}
		},
		scrollX: function(amount) {
			this.viewportAnchorX += amount;

			if (this.preventOverscroll) {
				this.viewportAnchorX = this._clamp(this.viewportAnchorX, 0, this.viewportWidth);
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
			}, this);

			return tiles;
		},

		rect: function(x, y, w, h) {
			var tiles = [];

			for(var xx = x; xx < x + w; ++xx) {
				for(var yy = y; yy < y + h; ++yy) {
					tiles.push(this.tileAt(xx, yy));
				}
			}

			return tiles;
		},

		tileAt: function(positionOrX, yOrUndefined) {
			var x = _.isObject(positionOrX) ? positionOrX.x : positionOrX;
			var y = _.isNumber(yOrUndefined) ? yOrUndefined : positionOrX.y;

			if (y < 0 || y >= this.height || x < 0 || x >= this.width) {
				return null;
			}

			var offset = y * this.width + x;
			return this.tiles[offset];
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
		addActor: function(actor) {
			if (actor.pieces) {
				this._addPieces(actor.pieces);
			}

			this.actors.push(actor);
			actor.board = this;
		},
		removeActor: function(actor) {
			if (actor.pieces) {
				this._removePieces(actor.pieces);
			}
			this.actors.remove(actor);
			delete actor.board;
		},

		addDaemon: function(daemon) {
			this.daemons.push(daemon);
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
			piece.position = to;

		},
		movePiece: function(options) {
			this._movePiece(options.piece, options.delta || options.to.delta(options.from));
		},
		moveActor: function(options) {
			options.actor.pieces.forEach(function(piece) {
				this._movePiece(piece, options.delta || options.to.delta(options.from));
			},
			this);
		},

		update: function(delta, timestamp) {
			this.actors.forEach(function(actor) {
				actor.update(delta, timestamp);
			});

			this.daemons.forEach(function(daemon) {
				daemon.update(delta, timestamp, this);
			});

			this._hitManager.detectHits(this.tiles);
		},

		render: function(delta) {
			var c = this.canvas.getContext('2d'),
			bw = this.borderWidth,
			ts = this.tileSize,
			seedy = this.viewportAnchorY,
			y,
			yl = Math.min(this._rows.length, seedy + this.viewportHeight),
			seedx = this.viewportAnchorX,
			x,
			xl = Math.min(this._rows[0].length, seedx + this.viewportWidth),
			tile,
			color,
			lastColor,
			row;

			c.fillStyle = this.borderFill || 'black';
			c.fillRect(0, 0, c.canvas.width, c.canvas.height);

			for (y = seedy; y < yl; ++y) {
				if (y >= 0) {
					row = this._rows[y];
					for (x = seedx; x < xl; ++x) {
						if (x >= 0) {
							tile = row[x];
							color = tile.getColor();

							c.fillStyle = color;
							c.fillRect((x - seedx) * (ts + bw) + bw, (y - seedy) * (ts + bw) + bw, ts, ts);
						}
					}
				}
			}
		},

		_createCanvas: function(tileSize, tilew, tileh, borderWidth, container) {
			var width = tileSize * tilew + (tilew + 1) * borderWidth;
			var height = tileSize * tileh + (tileh + 1) * borderWidth;

			var canvas = document.createElement('canvas');
			canvas.width = width;
			canvas.height = height;
			canvas.style.imageRendering = '-webkit-optimize-contrast';

			container.appendChild(canvas);

			return canvas;
		}
	};

})();

