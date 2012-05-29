(function() {
	function getBulletConfig() {
		return {
			onBoardSet: function() {
				this.ani.frame({
					targets: [this],
					pieceSetIndex: 0,
					rate: 200,
					looping: 'circular',
					loops: Infinity
				});
			},

			team: 'alienBullet',
			timers: {
				move: {
					enabled: function() {
						return ! this.dead;
					},
					handler: function() {
						this.down(1);
						if (this.position.y > 260) {
							this.die();
						}
					},
					interval: 1
				}
			},
			dead: false
		};
	}

	SI.AlienBullet = function(spriteConfig, position) {
		var config = _.extend(getBulletConfig(), spriteConfig);
		config.position = position;

		return new L7.Actor(config);
	};

})();

