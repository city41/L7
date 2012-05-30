(function() {
	var _hitManager = new L7.HitManager();
	var _bulletConfig = {
		shape: [[1], [1], [1], [5]],
		color: [255, 255, 255, 1],
		team: 'playerBullet',
	
		hitDetection: {
			alien: function(tile, alien) {
				alien.die();
				this.die();
			},
			barrier: function(tile, barrier) {
				this.die(true);
				barrier.takeDamageAt(tile.position);
			}
		},

		timers: {
			move: {
				enabled: function() {
					return ! this.dead;
				},
				handler: function() {
					this.up(2);
					if (this.position.y < 17) {
						this.die(true);
					}
				},
				interval: 1
			}
		},
		dead: true,
		launchFrom: function(position) {
			this.dead = false;
			this.goTo(position);
		},
		die: function(shouldExplode) {
			L7.Actor.prototype.die.apply(this, arguments);

			if (shouldExplode) {
				var explosionPosition = this.position.add(L7.pr(-this.explosionConfig.framesConfig.width / 2, 0));
				this.board.addActor(new SI.Explosion(this.explosionConfig, explosionPosition));
			}
		},
		update: function() {
			L7.Actor.prototype.update.apply(this, arguments);
			_hitManager.detectHitsForActor(this);
		}
	};

	SI.PlayerBullet = function() {
		return new L7.Actor(_bulletConfig);
	};

})();

