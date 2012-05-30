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

		barrier: function() {
			return {
				framesConfig: {
					src: this.image,
					width: 22,
					height: 16,
					direction: 'horizontal',
					sets: [[0]],
					initialSet: 0,
					initialFrame: 0,
					anchor: L7.p(0, 0),
					offset: L7.p(0, 8)
				}
			};
		},

		barrierDamage: function() {
			return {
				framesConfig: {
					src: this.image,
					width: 6,
					height: 7,
					direction: 'horizontal',
					sets: [[0]],
					initialSet: 0,
					initialFrame: 0,
					anchor: L7.p(0, 0),
					offset: L7.p(13, 0)
				}
			};
		},

		playerExplosion: function() {
			return {
				framesConfig: {
					src: this.image,
					width: 15,
					height: 8,
					direction: 'horizontal',
					sets: [[0, 1]],
					initialSet: 0,
					initialFrame: 0,
					anchor: L7.p(0,0),
					offset: L7.p(0, 64)
				}
			};
		},

		playerBulletExplosion: function() {
			return {
				framesConfig: {
					src: this.image,
					width: 8,
					height: 8,
					direction: 'horizontal',
					sets: [[0]],
					initialSet: 0,
					initialFrame: 0,
					anchor: L7.p(0,0),
					offset: L7.p(0, 48)
				}
			};
		},

		alienSquiggleBullet: function() {
			return {
				framesConfig: {
					src: this.image,
					width: 3,
					height: 7,
					direction: 'horizontal',
					sets: [[0, 1]],
					initialSet: 0,
					initialFrame: 0,
					anchor: L7.p(1, 0),
					offset: L7.p(8, 48)
				}
			};
		},

		alienExplosion: function() {
			return {
				framesConfig: {
					src: this.image,
					width: 13,
					height: 8,
					direction: 'horizontal',
					sets: [[0]],
					initialSet: 0,
					initialFrame: 0,
					anchor: L7.p(0,0),
					offset: L7.p(0, 56)
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

