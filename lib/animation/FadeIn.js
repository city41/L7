(function() {
	var _idCounter = 0;
	L7.FadeIn = function(config) {
		_.extend(this, config);
		this.reset();

		this._easeFunc = Math[this.easing || 'linearTween'];
		this._easeFunc = this._easeFunc || Math.linearTween;
	};

	L7.FadeIn.prototype = {
		reset: function() {
			this._elapsed = 0;
			this.done = this._elapsed >= this.duration;
			this._initted = false;
		},

		_initTargets: function() {
			this.targets.forEach(function(target) {
				target.color[3] = 0;
			});
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

			var l = this.targets.length;

			var alpha = this._easeFunc(this._elapsed, 0, 1, this.duration);
			while (l--) {
				this.targets[l].color[3] = alpha;
			}
		}
	};
})();

