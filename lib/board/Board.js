(function() {
	L7.Board = function(config) {
		_.extend(this, config || {});
		this.size = new L7.Pair(this.width || 0, this.height || 0);
		this.borderWidth = this.borderWidth || 0;

		this._rows = [];
		for(var y = 0; y < this.size.height; ++y) {
			this._rows.push(new L7.Row(y, this.size.width));
		}

		var tiles = [];
		this.each(function(row) {
			row.each(function(tile) {
				tiles.push(tile);
			});
		});

		this.tiles = tiles;
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
		}
	};

})();

