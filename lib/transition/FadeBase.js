(function() {
	L7.FadeBase = function(config) {
		_.extend(this, config);
		this.elapsed = 0;
		if(this.color) {
			this.color = L7.Color.toArray(this.color);
		}	
	};

	L7.FadeBase.prototype = {
		update: function(delta, timestamp) {
			this.elapsed += delta;
			var percentage = this.elapsed / this.duration;
			this.updateColor(this.color, percentage);

			if(percentage > 1 && this.onComplete) {
				this.onComplete(this);
			}

			this.board.update(delta, timestamp);
		},

		render: function(delta, context, anchorX, anchorY, timestamp) {
			this.board.render(delta, context, anchorX, anchorY, timestamp);
			context.save();
			context.fillStyle = L7.Color.toCssString(this.color);
			context.fillRect(0, 0, context.canvas.width, context.canvas.height);
			context.restore();
		}
	};

	Object.defineProperty(L7.FadeBase.prototype, 'viewport', {
			set: function(viewport) {
				this._viewport = viewport;
				if(this.board) {
					this.board.viewport = viewport;
				}
			},
			get: function() {
				return this._viewport;
			},
			enumerable: true
	});
})();


