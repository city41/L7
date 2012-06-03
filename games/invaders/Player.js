(function() {
	var _moveRepeatRate = 10;

	var _playerConfig = {
		team: 'player',
		anchor: L7.p(0, 0),
		position: L7.p(1, 216),
		keyInputs: {
			left: {
				repeat: true,
				rate: _moveRepeatRate,
				handler: function() {
					this.left(1);
				}
			},
			right: {
				repeat: true,
				rate: _moveRepeatRate,
				handler: function() {
					this.right(1);
				}
			},
			' ': {
				repeat: false,
				handler: function() {
					this.fire();
				}
			}
		},
		die: function() {
			var me = this;
			L7.Actor.prototype.die.call(me, true);

			var explosion = new SI.Explosion(this.explosionConfig, this.position);

			explosion.on('dead', function() {
				me.fireEvent('dead');
			});

			this.board.addActor(explosion);
		},
		onOutOfBounds: L7.Actor.prototype.goBack,
		fire: function() {
			if (this.bullet.dead) {
				if (!this.board.hasActor(this.bullet)) {
					this.board.addActor(this.bullet);
				}

				this.bullet.launchFrom(this.position.add(6, 0));
			}
		}
	};

	SI.Player = function(spriteConfig, explosionConfig, bulletExplosionConfig) {
		var config = _.extend(_playerConfig, spriteConfig);

		var player = new L7.Actor(config);
		player.bullet = new SI.PlayerBullet();
		player.bullet.explosionConfig = bulletExplosionConfig;
		player.explosionConfig = explosionConfig;

		return player;
	};

})();

