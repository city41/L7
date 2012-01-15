(function() {
	var _majorOverlayColor = [255, 255, 255, 0.7];
	var _minorOverlayColor = [255, 255, 255, 0.3];

	Disco = function(config) {
		_.extend(this, config);
		this.even = true;
		this._elapsed = 0;
		this._doDisco(this.even, this.tiles, this.width);
	};

	Disco.prototype = {
		update: function(delta, timestamp, board) {
			this._elapsed += delta;

			if (this._elapsed >= this.rate) {
				this._elapsed -= this.rate;
				this.even = !this.even;
				this._doDisco(this.even, this.tiles, this.width);
			}
		},

		_doDisco: function(even, tiles, width) {
			for(var i = 0; i < tiles.length; ++i) {
				var x = i % width;
				if(x === 0) {
					even = !even;
				}

				if(even) {
					if((x & 1) === 0) {
						tiles[i].overlayColor = _majorOverlayColor;
					} else {
						tiles[i].overlayColor = _minorOverlayColor;
					}
				} else {
					if((x & 1) === 1) {
						tiles[i].overlayColor = _majorOverlayColor;
					} else {
						tiles[i].overlayColor = _minorOverlayColor;
					}
				}
			}
		}
	};

})();

