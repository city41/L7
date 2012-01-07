(function() {
	L7.Board = function(config) {
		_.extend(this, config || {});
		this.size = new L7.Pair(this.width || 0, this.height || 0);
		this.borderWidth = this.borderWidth || 0;
		this.tileSize = this.tileSize || 0;

		this._rows = [];
		for (var y = 0; y < this.size.height; ++y) {
			this._rows.push(new L7.Row(y, this.size.width));
		}

		var tiles = [];
		this.each(function(row) {
			row.each(function(tile) {
				tiles.push(tile);
			});
		});

		this.tiles = tiles;
		this.actors = [];

		this.canvas = this._createCanvas(this.tileSize, this.width, this.height, this.borderWidth, this.container || document.body);
	};

	L7.Board.prototype = {
		row: function(index) {
			return this._rows[index];
		},

		tileAt: function(position) {
			var row = this.row(position.y);
			return row && row.at(position.x);
		},

		each: function(operation) {
			this._rows.forEach(operation);
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
		addActor: function(actor) {
			if (actor.pieces) {
				this._addPieces(actor.pieces);
			}

			this.actors.push(actor);
			actor.board = this;
		},

		isOutOfBounds: function(actor) {
			for (var i = 0, l = actor.pieces.length; i < l; ++i) {
				var p = actor.pieces[i].position;

				if (p.x < 0 || p.y < 0 || p.x >= this.size.width || p.y >= this.size.height) {
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
		},

		render: function(delta) {
			var c = this.canvas.getContext('2d');
			if (!this._borderFilled) {
				c.fillStyle = this.borderFill || 'black';
				c.fillRect(0, 0, c.canvas.width, c.canvas.height);
				this._borderFilled = true;
			}

			var bw = this.borderWidth;
			var ts = this.tileSize;

			c.save();

			for(var y = 0, rl = this._rows.length; y < rl; ++y) {
				var row = this._rows[y];
				for(var x = 0, tl = row.tiles.length; x < tl; ++x) {
					var tile = row.tiles[x];
					var color = tile.getColor();

					if(color) {
						c.fillStyle = color;
						c.fillRect(x * (ts + bw) + bw, y * (ts + bw) + bw, ts, ts);
					}
				}
			}

			c.restore();
		},

		_createCanvas: function(tileSize, tilew, tileh, borderWidth, container) {
			var width = tileSize * tilew + (tilew + 1) * borderWidth;
			var height = tileSize * tileh + (tileh + 1) * borderWidth;

			var canvas = document.createElement('canvas');
			canvas.width = width;
			canvas.height = height;

			container.appendChild(canvas);

			return canvas;
		}
	};

})();

