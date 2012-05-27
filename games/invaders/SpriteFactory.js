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
		},

		stingray: function() {
			return {
				framesConfig: {
					src: this.image,
					width: 11,
					height: 7,
					direction: 'horizontal',
					sets: [[0, 1]],
					initialSet: 0,
					initialFrame: 0,
					anchor: L7.p(0, 0),
					offset: L7.p(0, 41)
				}
			};
		},

		octopus: function() {
			return {
				framesConfig: {
					src: this.image,
					width: 8,
					height: 8,
					direction: 'horizontal',
					sets: [[0, 1]],
					initialSet: 0,
					initialFrame: 0,
					anchor: L7.p(0, 0),
					offset: L7.p(0, 32)
				}
			};
		},

		skull: function() {
			return {
				framesConfig: {
					src: this.image,
					width: 12,
					height: 8,
					direction: 'horizontal',
					sets: [[0, 1]],
					initialSet: 0,
					initialFrame: 0,
					anchor: L7.p(0, 0),
					offset: L7.p(0, 24)
				}
			};
		}
	}

})();
