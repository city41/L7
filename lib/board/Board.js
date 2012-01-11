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
			for(var x = 0; x < this.width; ++x) {
				var tile = new L7.Tile({
					x: x, 
					y: y
				});
				if(this.defaultTileColor) {
					tile.color = this.defaultTileColor;
				}
				row.push(tile);
				this.tiles.push(tile);
			}
			this._rows.push(row);
		}

		this.actors = [];
		this.daemons = [];

		this.canvas = this._createCanvas(this.tileSize, this.width, this.height, this.borderWidth, this.container || document.body);
		this._hitManager = new L7.HitManager();
	};

	L7.Board.prototype = {
		column: function(index) {
			if(index < 0) {
				index = this.width + index;
			}
			var positions = [];

			for(var y = 0; y < this.height; ++y) {
				positions.push(L7.p(index, y));
			}
			return positions;
		},

		row: function(index) {
			if(index < 0) {
				index = this.height + index;
			}
			var positions = [];
			
			for(var x = 0; x < this.width; ++x) {
				positions.push(L7.p(x, index));
			}
			return positions;
		},

		tileAt: function(position) {
			if(position.y < 0 || position.y >= this.height || position.x < 0 || position.x >= this.width) {
				return null;
			}

			var offset = position.y * this.width + position.x;
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
				if(tile) {
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
			if(actor.pieces) {
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
			var c = this.canvas.getContext('2d')
				,bw = this.borderWidth
				,ts = this.tileSize
				,y
				,yl = this._rows.length
				,x
				,xl = this._rows[0].length
				,tile
				,color
				,lastColor
				,row;

			for(y = 0; y < yl; ++y) {
				row = this._rows[y];
				for(x = 0; x < xl; ++x) {
					tile = row[x];
					color = tile.getColor();

					c.fillStyle = color;
					c.fillRect(x * (ts + bw) + bw, y * (ts + bw) + bw, ts, ts);
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

			canvas.getContext('2d').fillStyle = this.borderFill || 'black';
			canvas.getContext('2d').fillRect(0, 0, canvas.width, canvas.height);

			container.appendChild(canvas);

			return canvas;
		}
	};

})();

