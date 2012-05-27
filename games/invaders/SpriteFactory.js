(function() {
	SI.SpriteFactory = function(image) {
		this.image = image;
	};

	SI.SpriteFactory.prototype = {
		player: function() {
			return {
				framesConfig: {
					src: this.image,
					width: 13,
					height: 8,
					direction: 'horizontal',
					sets: [[0]],
					initialSet: 0,
					initialFrame: 0,
					anchor: L7.p(0, 0),
					offset: L7.p(0, 0)
				}
			};
		}
	};

})();

