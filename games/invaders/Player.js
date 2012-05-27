(function() {
	var _moveRepeatRate = 10;

	var _playerConfig = {
		anchor: L7.p(0,0),
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
			}
		},
		onOutOfBounds: L7.Actor.prototype.goBack,
		team: 'player',
	};

	SI.Player = function(spriteConfig) {
		var config = _.extend(_playerConfig, spriteConfig);

		return new L7.Actor(config);
	};

})();

