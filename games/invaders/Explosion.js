(function() {
	var _delay = 400;
	function getExplosionConfig() {
		return {
			onBoardSet: function() {
				var me = this;
				this.ani.together(function(ani) {
					ani.frame({
						targets: [me],
						pieceSetIndex: 0,
						rate: 100,
						looping: 'circular',
						loops: Infinity
					});
					ani.sequence(function(ani) {
						ani.wait(_delay);
						ani.invoke(function() {
							me.die();
						});
					});
				});
			}
		};
	}

	SI.Explosion = function(spriteConfig, position) {
		var config = _.extend(getExplosionConfig(), spriteConfig);
		config.position = position;

		return new L7.Actor(config);
	};

})();

