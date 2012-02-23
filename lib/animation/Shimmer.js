(function() {
	var _idCounter = 0;
	L7.Shimmer = function(config) {
		_.extend(this, config);
		this.reset();
	}

	L7.Shimmer.prototype = {
		reset: function() {
			this.done = false;
		},

		_initTargets: function() {
			var fullRange = this.maxAlpha - this.minAlpha;

			var color = this.color || [255, 255, 255, 1];

			this.targets.forEach(function(target) {
				target.opaque = true;
				target.overlayColor = color.slice(0);
				target.overlayColor[3] = L7.rand(this.minAlpha, this.maxAlpha);
				target.shimmerRate = Math.floor(L7.rand(this.baseRate - this.baseRate * this.rateVariance, this.baseRate + this.baseRate * this.rateVariance));
				target.shimmerAlphaPerMilli = fullRange / target.shimmerRate;
				target.shimmerDirection = 1;
			},
			this);
		},

		update: function(delta, timestamp, board) {
			if(!this._initted) {
				this._initTargets();
				this._initted = true;
			}

			if(this.done) {
				return;
			}

			this.targets.forEach(function(target) {
				var rate = target.shimmerAlphaPerMilli * target.shimmerDirection;
				var alphaChange = delta * rate;
				target.overlayColor[3] += alphaChange;
				var alpha = target.overlayColor[3];

				if (alpha > this.maxAlpha) {
					target.shimmerDirection = - 1;
					target.overlayColor[3] = this.maxAlpha;
				}

				if (alpha < this.minAlpha) {
					target.shimmerDirection = 1;
					target.overlayColor[3] = this.minAlpha;
				}
			},
			this);

			this.done = true;
		}
	};
})();


