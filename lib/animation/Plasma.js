(function() {
	function dist(a, b, c, d) {
		return Math.sqrt((a - c) * (a - c) + (b - d) * (b - d));
	}

	function color(x, y, time, width, height) {
		// plasma function
		return (128 + (128 * Math.sin(x * 0.0625)) + 128 + (128 * Math.sin(y * 0.03125)) + 128 + (128 * Math.sin(dist(x + time, y - time, width, height) * 0.125)) + 128 + (128 * Math.sin(Math.sqrt(x * x + y * y) * 0.125))) * 0.25;
	}

	L7.Plasma = function(config) {
		_.extend(this, config);

		this._width = this._determineDim(this.targets, 'x');
		this._height = this._determineDim(this.targets, 'y');
		this._paletteOffset = 0;
		this._palette = this._createPalette();
		this.reset();
	};

	L7.Plasma.prototype = {
		reset: function() {
			this.done = false;
			this._elapsed = 0;
			this._doPlasma(this._width, this._height, this.targets, this._paletteOffset);
		},
		update: function(delta, timestamp, board) {
			this._elapsed += delta;
			if (this._elapsed >= this.rate) {
				this._paletteOffset += 1;
				this.done = true;
			}
		},

		_createPalette: function() {
			var palette = [];
			var rw = (this.weights && _.isNumber(this.weights[0])) ? this.weights[0] : 1;
			var gw = (this.weights && _.isNumber(this.weights[1])) ? this.weights[1] : 1;
			var bw = (this.weights && _.isNumber(this.weights[2])) ? this.weights[2] : 1;
			var alpha = this.alpha || 1;
			var n = this.noise || 1;

			for (var i = 0, r, g, b; i < 256; i++) {
				r = ~~ (128 + 128 * Math.sin(Math.PI * i / (32 / n)));
				g = ~~ (128 + 128 * Math.sin(Math.PI * i / (64 / n)));
				b = ~~ (128 + 128 * Math.sin(Math.PI * i / (128 / n)));
				r = Math.min(255, r*rw);
				g = Math.min(255, g*gw);
				b = Math.min(255, b*bw);

				palette[i] = [r,g,b,alpha];
			}

			return palette;
		},

		_determineDim: function(targets, dim) {
			var min = Math.min.apply(null, targets.map(function(t) {
				return t.position[dim]
			}));
			var max = Math.max.apply(null, targets.map(function(t) {
				return t.position[dim]
			}));

			return max - min + 1;
		},

		_doPlasma: function(width, height, targets, time) {
			for (var y = 0, x; y < height; ++y) {
				for (x = 0; x < width; ++x) {
					var t = targets[width * y + x];
					if (t) {
						t.overlayColor = this._palette[~~ (color(x, y, time, width, height) + time) % 256];
					}
				}
			}
		}
	};
})();

