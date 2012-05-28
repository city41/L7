(function() {
	var _moveRepeatRate = 10;

	var _playerConfig = {
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

	SI.Player = function(spriteConfig) {
		var config = _.extend(_playerConfig, spriteConfig);

		var player = new L7.Actor(config);
		player.bullet = new SI.PlayerBullet();

		return player;
	};

})();

