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
				}
			},
			die: function() {
				L7.Actor.prototype.die.apply(this, arguments);
				this.board.addActor(new SI.AlienExplosion(this.explosionConfig, this.position));
			},
			update: function() {
				L7.Actor.prototype.update.apply(this, arguments);
				_hitManager.detectHitsForActor(this);
			}
		};
	}

	SI.Alien = function(spriteConfig, explosionConfig, position) {
		var config = _.extend(getAlienConfig(), spriteConfig);
		config.position = position;
		config.explosionConfig = explosionConfig;

		return new L7.Actor(config);
	};

})();

