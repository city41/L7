(function() {
	var _idCounter = 0;
	L7.Tween = function(config) {
		_.extend(this, config);
		this.reset();

		this._saveProperty = this.property + "_save_" + (_idCounter++);
		this._nonJitteredProperty = this.property + "_nonJittered_" + (_idCounter++);

		this._easeFunc = L7.Easing[this.easing || 'linearTween'] || L7.Easing.linearTween;
	};

	L7.Tween.prototype = {
		reset: function() {
			this._elapsed = 0;
			this.done = this._elapsed >= this.duration;
			this._initted = false;
		},

		_initTargets: function() {
			this.targets.forEach(function(target) {
				if(_.isArray(target[this._saveProperty])) {
					target[this._saveProperty] = target[this._saveProperty].slice(0);
				} else {
					target[this._saveProperty] = target[this.property];
				}

				var value = this.hasOwnProperty('from') ? this.from : target[this.property];

				if (!_.isUndefined(value)) {
					if (_.isArray(value)) {
						value = value.slice(0);
					}

					target[this.property] = value;
				}
			},
			this);
		},

		update: function(delta, timestamp, board) {
			if (!this._initted) {
				this._initTargets();
				this._initted = true;
			}

			if (this.done || this.disabled) {
				return;
			}

			this._elapsed += delta;
			if (this._elapsed > this.duration) {
				this._elapsed = this.duration;
				this.done = true;
			}

			this.targets.forEach(function(target) {
				this._tween(target);
			},
			this);

			if (this.done) {
				this.targets.forEach(function(target) {
					if (this.restoreAfter) {
						target[this.property] = target[this._saveProperty];
					}
					delete target[this._saveProperty];
					delete target[this._nonJitteredProperty];
				},
				this);
			}
		},

		_tween: function(target) {
			if (_.isArray(target[this.property])) {
				var array = target[this.property];
				for (var i = 0; i < array.length; ++i) {
					var from = this.from || target[this._saveProperty];
					array[i] = this._tweenValue(this._elapsed, from[i], this.to[i], this.duration);
				}
			} else if (_.isNumber(target[this.property])) {
				target[this.property] = this._tweenValue(this._elapsed, this.from, this.to, this.duration);
			}
		},

		_tweenValue: function(elapsed, from, to, duration) {
			var position = this._easeFunc(elapsed, from, to - from, duration);

			if (_.isNumber(this.jitterMin)) {
				position += L7.rand(this.jitterMin, this.jitterMax || 0);
			}

			return position;
		}
	};
})();

