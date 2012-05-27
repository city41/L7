(function() {
	var _bulletConfig = {
		shape: [[1], [1], [1], [5]],
		color: [255, 255, 255, 1],
		timers: {
			move: {
				enabled: function() {
					return this.alive;
				},
				handler: function() {
					this.up(2);
					if(this.position.y < 0) {
						this.alive = false;
					}
				},
				interval: 1
			}
		},
		alive: false,
		launchFrom: function(position) {
			this.goTo(position);
			this.alive = true;
		}
	};

	SI.PlayerBullet = function() {
		return new L7.Actor(_bulletConfig);
	};

})();

