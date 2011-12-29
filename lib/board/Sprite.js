(function() {
	L7.Sprite = function(color) {
		this._color = color;
	};

	L7.Sprite.prototype = {
		render: function(context, timestamp, delta) {
			context.save();
			context.fillStyle = this._color;
			context.fillRect(0, 0, L7.TileSize, L7.TileSize);
			context.restore();

			if (this.overlay) {
				context.save();
				context.fillStyle = this.overlay;
				context.fillRect(0, 0, L7.TileSize, L7.TileSize);
				context.restore();
			}
		}
	};

	Object.defineProperty(L7.Sprite.prototype, 'color', {
		get: function() {
			return this._color;
		},
		enumerable: true
	});
})();


