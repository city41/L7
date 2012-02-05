(function() {
	Shimmer = function(config) {
		_.extend(this, config);

		this._initTiles(this.tiles);
	};

	Shimmer.prototype= {
		_initTiles: function(tiles) {
			var fullRange = this.maxAlpha - this.minAlpha;

			var color = this.color || [255, 255, 255, 1];

			tiles.forEach(function(tile) {
				tile.overlayColor = color.slice(0);
				tile.overlayColor[3] = L7.rand(this.minAlpha, this.maxAlpha);
				tile.shimmerRate = Math.floor(L7.rand(this.baseRate - this.baseRate * this.rateVariance, this.baseRate + this.baseRate * this.rateVariance));
				tile.shimmerAlphaPerMilli = fullRange / tile.shimmerRate;
				tile.shimmerDirection = 1;
			}, this);
		},

		update: function(delta, timestamp, board) {
			this.tiles.forEach(function(tile) {
				var rate = tile.shimmerAlphaPerMilli * tile.shimmerDirection;
				var alphaChange = delta * rate;
				tile.overlayColor[3] += alphaChange;
				var alpha = tile.overlayColor[3];

				if(alpha > this.maxAlpha) {
					tile.shimmerDirection = -1;
					tile.overlayColor[3] = this.maxAlpha;
				}

				if(alpha < this.minAlpha) {
					tile.shimmerDirection = 1;
					tile.overlayColor[3] = this.minAlpha;
				}
			}, this);
		}
	};

})();

