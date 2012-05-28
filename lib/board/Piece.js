(function() {
	L7.Piece = function(config) {
		_.extend(this, config || {});
	};

	Object.defineProperty(L7.Piece.prototype, "position", {
		get: function() {
			if(this.owner) {
				return this.owner.position.add(this.anchorDelta);
			}
		},
		enumerable: true
	});

})();

