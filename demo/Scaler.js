(function() {
	Scaler= function(config) {
		_.extend(this, config);

		this._initTiles(this.tiles);
	};

	Scaler.prototype= {
		_initTiles: function(tiles) {
			var fullRange = this.maxScale - this.minScale;

			tiles.forEach(function(tile) {
				tile.scale = L7.rand(this.minScale, this.maxScale);
				tile.scaleRate = Math.floor(L7.rand(this.baseRate - this.baseRate * this.rateVariance, this.baseRate + this.baseRate * this.rateVariance));
				tile.scaleChangePerMilli = fullRange / tile.scaleRate;
				tile.scaleDirection = 1;
			}, this);
		},

		update: function(delta, timestamp, board) {
			this.tiles.forEach(function(tile) {
				var rate = tile.scaleChangePerMilli * tile.scaleDirection;
				var scaleChange = delta * rate;
				tile.scale += scaleChange;

				if(tile.scale > this.maxScale || tile.scale < this.minScale) {
					tile.scaleDirection *= -1;
				} 
			}, this);
		}
	};

})();

