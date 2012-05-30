(function() {
	var _interval = 500;

	var _hitManager = new L7.HitManager();

	function getAlienConfig() {
		return {
			team: 'alien',
			hitDetection: {
				enabled: function() {
					return !this.dead;
				},
				playerBullet: function(tile, bullet) {
					bullet.die();
					this.die();
				}
			},
			onBoardSet: function() {
				this.ani.frame({
					targets: [this],
					pieceSetIndex: 0,
					rate: _interval,
					looping: 'circular',
					loops: Infinity
				});
			},

			timers: {
				move: {
					interval: _interval,
					handler: function() {
						this.right(1);
					}
				},
				fire: {
					interval: L7.rand(8000, 15000),
					handler: function() {
						this.fire();
						this.timers.fire.interval = L7.rand(8000, 15000);
						this.timers.fire.elapsed = 0;
					}
				}
			},
			fire: function() {
				var bulletPosition = this.position.add(L7.pr(this.framesConfig.width / 2, 0));
				this.board.addActor(new SI.AlienBullet(this.bulletConfig, bulletPosition));
			},
			die: function() {
				L7.Actor.prototype.die.apply(this, arguments);
				this.board.addActor(new SI.Explosion(this.explosionConfig, this.position));
			},
			update: function() {
				L7.Actor.prototype.update.apply(this, arguments);
				_hitManager.detectHitsForActor(this);
			}
		};
	}

	SI.Alien = function(spriteConfig, explosionConfig, bulletConfig, position) {
		var config = _.extend(getAlienConfig(), spriteConfig);
		config.position = position;
		config.explosionConfig = explosionConfig;
		config.bulletConfig = bulletConfig;

		return new L7.Actor(config);
	};

})();

