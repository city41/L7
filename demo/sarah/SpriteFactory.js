(function() {
	SAM.SpriteFactory = function(image) {
		this.image = image;
	};

	SAM.SpriteFactory.prototype = {
		matt: function(position) {
			return new L7.Actor({
				framesConfig: {
					src: this.image,
					width: 9,
					height: 14,
					direction: 'horizontal',
					sets: [[0], [1, 2, 3]],
					initialSet: 0,
					initialFrame: 0,
					anchor: L7.p(0, 0),
					offset: L7.p(0, 0)
				},
				position: position || L7.p(0, 0)
			});
		},

		sarah: function(position) {
			return new L7.Actor({
				framesConfig: {
					src: this.image,
					width: 9,
					height: 13,
					direction: 'horizontal',
					sets: [[0], [2, 1, 2, 4, 5, 4]],
					initialSet: 0,
					initialFrame: 0,
					anchor: L7.p(0, 0),
					offset: L7.p(0, 15)
				},
				position: position || L7.p(0, 0)
			});
		},

		lucy: function(position) {
			return new L7.Actor({
				framesConfig: {
					src: this.image,
					width: 9,
					height: 8,
					direction: 'horizontal',
					sets: [[], [0, 1, 2]],
					initialSet: 0,
					initialFrame: 0,
					anchor: L7.p(0, 0),
					offset: L7.p(0, 31)
				},
				position: position || L7.p(0, 0)
			});
		},

		schoeffLump: function(position) {
			return new L7.Actor({
				framesConfig: {
					src: this.image,
					width: 16,
					height: 4,
					direction: 'horizontal',
					sets: [[0]],
					initialSet: 0,
					initialFrame: 0,
					anchor: L7.p(0, 0),
					offset: L7.p(38, 0)
				},
				position: position || L7.p(0, 0)
			});
		},

		please: function(position) {
			return new L7.Actor({
				framesConfig: {
					src: this.image,
					width: 31,
					height: 14,
					direction: 'horizontal',
					sets: [[0]],
					initialSet: 0,
					initialFrame: 0,
					anchor: L7.p(0, 0),
					offset: L7.p(42, 83)
				},
				position: position || L7.p(0, 0)
			});
		}
	};

})();

