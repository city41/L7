(function() {
	var _majorOverlayColor = [255, 255, 255, 0.9];
	var _minorOverlayColor = [255, 255, 255, 0.6];

	L7.Disco = function(config) {
		_.extend(this, config);
		this.reset();
	}

	L7.Disco.prototype = {
		reset: function() {
			this.done = false;
			this.even = true;
			this._elapsed = 0;
			this._discoCount = 0;
		},

		update: function(delta, timestamp, board) {
			if(this.done) {
				return;
			}

			this._elapsed += delta;

			if (this._elapsed >= this.rate) {
				this.even = !this.even;
				this._doDisco(this.even, this.targets, this.width);
				this._elapsed -= this.rate;
				++this._discoCount;
			}

			this.done = this._discoCount >= 2;
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



