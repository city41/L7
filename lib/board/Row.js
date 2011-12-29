(function() {
	L7.Row = function(y, tileCount) {
		if(!_.isNumber(y)) {
			throw new Error("Row: y is required");
		}

		this.tiles = [];

		for(var i = 0; i < tileCount; ++i) {
			this.tiles.push(new L7.Tile({
				x: i,
				y: y
			}));
		}
	};

	L7.Row.prototype = {
		at: function(index) {
			return this.tiles[index];
		},
		each: function(operation) {
			this.tiles.forEach(operation);
		}
	};

})();

