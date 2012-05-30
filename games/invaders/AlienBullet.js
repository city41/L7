(function() {
	var _hitManager = new L7.HitManager();

	function getBulletConfig() {
		return {
			team: 'alienBullet',
			hitDetection: {
				barrier: function(tile, barrier) {
					this.die();
					barrier.takeDamageAt(tile.position);
				},
				player: function(tile, player) {
					this.die();
					player.die();
				},
				floor: function(tile, floor) {
					this.die();
					floor.takeDamageAt(tile.position);
				}
			},

			onBoardSet: function() {
				this.ani.frame({
					targets: [this],
					pieceSetIndex: 0,
					rate: 200,
					looping: 'circular',
					loops: Infinity
				});
			},

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
			dead: false,
			update: function() {
				L7.Actor.prototype.update.apply(this, arguments);
				_hitManager.detectHitsForActor(this);
			}
		};
	}

	SI.AlienBullet = function(spriteConfig, position) {
		var config = _.extend(getBulletConfig(), spriteConfig);
		config.position = position;

		return new L7.Actor(config);
	};

})();

