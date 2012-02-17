(function() {
	var _palettes = []

	for (var i = 0, r, g, b; i < 256; i++) {
		r = ~~ (128 + 128 * Math.sin(Math.PI * i / 32));
		g = ~~ (128 + 128 * Math.sin(Math.PI * i / 64));
		b = ~~ (128 + 128 * Math.sin(Math.PI * i / 128));
		_palettes[i] = [r, g, b, 1];
	}

	function dist(a, b, c, d) {
		return Math.sqrt((a - c) * (a - c) + (b - d) * (b - d));
	}

	function color(x, y, time, width, height) {
		// plasma function
		return (128 + (128 * Math.sin(x * 0.0625)) + 128 + (128 * Math.sin(y * 0.03125)) + 128 + (128 * Math.sin(dist(x + time, y - time, width, height) * 0.125)) + 128 + (128 * Math.sin(Math.sqrt(x * x + y * y) * 0.125))) * 0.25;
	}

	L7.Plasma = function(config) {
		_.extend(this, config);
		this._paletteOffset = 0;
		this._elapsed = this.rate;

		this._width = this._determineDim(this.targets, 'x');
		this._height = this._determineDim(this.targets, 'y');
	};

	L7.Plasma.prototype = {
		update: function(delta, timestamp, board) {
			this._elapsed += delta;
			if (this._elapsed >= this.rate) {
				this._doPlasma(this._width, this._height, this.targets, this._paletteOffset);
				this._elapsed -= this.rate;
				this._paletteOffset += 1;
			}
		},

		_determineDim: function(targets, dim) {
			var min = Math.min.apply(null, targets.map(function(t) { return t.position[dim] }));
			var max = Math.max.apply(null, targets.map(function(t) { return t.position[dim] }));

			return max - min + 1;
		},

		_doPlasma: function(width, height, targets, time) {
			for (var y = 0, x; y < height; ++y) {
				for (x = 0; x < width; ++x) {
					targets[width * y + x].overlayColor = _palettes[~~ (color(x, y, time, width, height) + time) % 256];
				}
			}
		}
	};
})();

