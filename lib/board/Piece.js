(function() {
	L7.Piece = function(config) {
		_.extend(this, config || {});
	};

	L7.Piece.prototype = {
		render: function() {
			if(this.sprite) {
				this.sprite.overlay = this._overlay;
				this.sprite.render.apply(this.sprite, arguments);
			}
		}
	};

	Object.defineProperty(L7.Piece.prototype, 'overlay', {
		get: function() {
			return this._overlay;
		},
		set: function(overlay) {
			this._overlay = overlay;
		},
		enumerable: true
	});

})();

