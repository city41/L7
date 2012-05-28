(function() {
	var _bulletConfig = {
		shape: [[1], [1], [1], [5]],
		color: [255, 255, 255, 1],
		team: 'playerBullet',
		timers: {
			move: {
				enabled: function() {
					return !this.dead;
				},
				handler: function() {
					this.up(2);
					if(this.position.y < 0) {
						this.die();
					}
				},
				interval: 1
			}
		},
		dead: true,
		launchFrom: function(position) {
			this.dead = false;
			this.goTo(position);
		}
	};

	SI.PlayerBullet = function() {
		return new L7.Actor(_bulletConfig);
	};

})();

