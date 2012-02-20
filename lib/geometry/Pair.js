(function() {
	var _pi = Math.PI;
	var _twoPi = _pi * 2;
	var _piOver2 = _pi / 2;


	L7.Pair = function Pair(a, b) {
		this._a = a || 0;
		this._b = b || 0;
	};

	L7.Pair.prototype = {
		clone: function() {
			return L7.p(this.x, this.y);
		},

		equals: function(other) {
			if (other) {
				return (other === this) || (other._a === this._a && other._b == this._b) || (other.x === this._a && other.y == this._b) || (other.width == this._a && other.height == this._b);
			}
			return false;
		},
		up: function() {
			return L7.p(this.x, this.y - 1);
		},
		left: function() {
			return L7.p(this.x - 1, this.y);
		},
		right: function() {
			return L7.p(this.x + 1, this.y);
		},
		down: function() {
			return L7.p(this.x, this.y + 1);
		},
		add: function(otherPairOrNumber, numberOrUndefined) {
			var x, y;

			if (typeof otherPairOrNumber.x === 'number') {
				x = otherPairOrNumber.x;
			} else {
				x = otherPairOrNumber || 0;
			}

			if (typeof otherPairOrNumber.y === 'number') {
				y = otherPairOrNumber.y;
			} else {
				y = numberOrUndefined || 0;
			}

			return L7.p(this.x + x, this.y + y);
		},
		subtract: function(otherPairOrNumber, numberOrUndefined) {
			if (typeof otherPairOrNumber.x === 'number') {
				x = otherPairOrNumber.x;
			} else {
				x = otherPairOrNumber || 0;
			}

			if (typeof otherPairOrNumber.y === 'number') {
				y = otherPairOrNumber.y;
			} else {
				y = numberOrUndefined || 0;
			}

			return L7.p(this.x - x, this.y - y);
		},
		negate: function() {
			return L7.p(-this.x, - this.y);
		},
		multiply: function(scalar) {
			return L7.p(this.x * scalar, this.y * scalar);
		},
		round: function() {
			return L7.pr(this.x, this.y);
		},
		dot: function(other) {
			return this.x * other.x + this.y * other.y;
		},
		length: function() {
			return Math.sqrt(this.dot(this));
		},
		normalize: function() {
			return this.multiply(1.0 / this.length());
		},
		distanceFrom: function(other) {
			var delta = this.delta(other);

			return Math.sqrt(delta.dot(delta));
		},
		degreeAngleFrom: function(other) {
			return L7.radiansToDegrees(this.radianAngleFrom(other));
		},
		radianAngleFrom: function(other) {
			var x = this.x - other.x;
			var y = this.y - other.y;

			// special case for x equals zero, division by zero
			if (x === 0) {
				if (y < 0) {
					return _piOver2 * 3;
				} else {
					return _piOver2;
				}
			}

			// special case for y equals zero, the negative gets lost
			if (y === 0) {
				if (x < 0) {
					return _pi;
				} else {
					return 0;
				}
			}

			var tan = y / x;
			var radians = Math.atan(tan);

			// quad 1
			if (x > 0 && y > 0) {
				return radians;

				// quad 2, add 180
			} else if (x < 0 && y > 0) {
				return radians + _pi;

				// quad 3, add 180
			} else if (x < 0 && y < 0) {
				return radians + _pi;

				// if(x > 0 && y < 0) {
			} else {
				return radians + _twoPi;
			}
		},
		toString: function() {
			return "[" + this._a + "," + this._b + "]";
		}
	};

	L7.Pair.prototype.delta = L7.Pair.prototype.subtract;

	Object.defineProperty(L7.Pair.prototype, "width", {
		get: function() {
			return this._a;
		}
	});

	Object.defineProperty(L7.Pair.prototype, "height", {
		get: function() {
			return this._b;
		}
	});

	Object.defineProperty(L7.Pair.prototype, "x", {
		get: function() {
			return this._a;
		},
		set: function(nx) {
			this._a = nx;
		}
	});

	Object.defineProperty(L7.Pair.prototype, "y", {
		get: function() {
			return this._b;
		},
		set: function(ny) {
			this._b = ny;
		}
	});

	// simple utility methods
	L7.s = function(w, h) {
		return new L7.Pair(w, h);
	};

	L7.p = L7.s;

	L7.sr = function(w, h) {
		return new L7.Pair(Math.round(w), Math.round(h));
	};

	L7.pr = L7.sr;
})();

