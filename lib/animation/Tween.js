(function() {
	L7.Tween = function(config) {
		_.extend(this, config);
		this.reset();
	}

	L7.Tween.prototype = {
		reset: function() {
			this._elapsed = 0;
			this.done = this._elapsed >= this.duration;
			this._initted = false;
		},

		_initTargets: function() {
			this.targets.forEach(function(target) {
				var value = this.from;
				if(_.isArray(value)) {
					value = value.slice(0);
				}
				target[this.property] = value;
			}, this);
		},

		update: function(delta, timestamp, board) {
			if(!this._initted) {
				this._initTargets();
				this._initted = true;
			}

			if(this.done) {
				return;
			}

			var remaining = this.duration - this._elapsed;
			delta = Math.min(remaining, delta);

			this.targets.forEach(function(target) {
				this._tween(target, delta);
			}, this);

			this._elapsed += delta;
			this.done = this._elapsed >= this.duration;
		},

		_tween: function(target, delta) {
			if(_.isArray(target[this.property])) {
				this._tweenArray(target, delta);
			} else if(_.isNumber(target[this.property])) {
				this._tweenNumber(target, delta);
			}
		},

		_tweenNumber: function(target, delta) {
			var value = target[this.property];

			var range = this.to - this.from;
			var rate = range / this.duration;
			var amount = rate * delta;
			target[this.property] = value + amount;
		},

		_tweenArray: function(target, delta) {
			var array = target[this.property];

			array.forEach(function(value, i, a) {
				var range = this.to[i] - this.from[i];
				var rate = range / this.duration;
				var amount = rate * delta;
				a[i] = value + amount;
			}, this);
		}
	};
})();

