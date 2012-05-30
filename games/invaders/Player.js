(function() {
	var _moveRepeatRate = 10;
	var _hitManager = new L7.HitManager();

	var _playerConfig = {
		anchor: L7.p(0, 0),
		position: L7.p(1, 216),
		hitDetection: {
			alienBullet: function(tile, bullet) {
				bullet.die();
				this.die();
			}
		},
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
			L7.Actor.prototype.die.apply(this, arguments);
			this.board.addActor(new SI.Explosion(this.explosionConfig, this.position));
		},
		update: function() {
			L7.Actor.prototype.update.apply(this, arguments);
			_hitManager.detectHitsForActor(this);
		},
		onOutOfBounds: L7.Actor.prototype.goBack,
		team: 'player',
		fire: function() {
			if (this.bullet.dead) {
				if (!this.board.hasActor(this.bullet)) {
					this.board.addActor(this.bullet);
				}

				this.bullet.launchFrom(this.position.add(6, 0));
			}
		}
	};

	SI.Player = function(spriteConfig, explosionConfig) {
		var config = _.extend(_playerConfig, spriteConfig);

		var player = new L7.Actor(config);
		player.bullet = new SI.PlayerBullet();
		player.explosionConfig = explosionConfig;

		return player;
	};

})();

