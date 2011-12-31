(function() {
	L7.Board = function(config) {
		_.extend(this, config || {});
		this.size = new L7.Pair(this.width || 0, this.height || 0);
		this.borderWidth = this.borderWidth || 0;

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
				this._movePiece(piece, options.delta);
			},
			this);
		}
	};

})();

