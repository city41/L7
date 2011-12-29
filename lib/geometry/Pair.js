(function() {
	L7.Pair = function Pair(a, b) {
		this._a = a || 0;
		this._b = b || 0;
	};

	L7.Pair.prototype = {
		equals: function(other) {
			if(other) {
				return (other === this) || 
					(other._a === this._a && other._b == this._b) ||
					(other.x === this._a && other.y == this._b) ||
					(other.width == this._a && other.height == this._b);
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
		toString: function p_toString() {
			return "[" + this._a + "," + this._b + "]";
		}
	};

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
		}
	});

	Object.defineProperty(L7.Pair.prototype, "y", {
		get: function() {
			return this._b;
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

