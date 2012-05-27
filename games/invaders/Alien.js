(function() {
	var _alienConfig = {
		onBoardSet: function() {
			this.ani.frame({
				targets: [this],
				pieceSetIndex: 0,
				rate: 1000,
				looping: 'circular',
				loops: Infinity
			});
		},

		timers: {
			move: {
				interval: 200,
				handler: function() {
					this.right(1);
				}
			}
		}
	};

	SI.Alien = function(spriteConfig, position) {
		var config = _.extend(_alienConfig, spriteConfig);
		config.position = position;

		return new L7.Actor(config);
	};

})();

