(function() {
	var _delay = 400;
	function getExplosionConfig() {
		return {
			onBoardSet: function() {
				var me = this;
				this.ani.sequence(function(ani) {
					ani.wait(_delay);
					ani.invoke(function() {
						me.board.removeActor(me);
					});
				});
			}
		};
	}

	SI.AlienExplosion = function(spriteConfig, position) {
		var config = _.extend(getExplosionConfig(), spriteConfig);
		config.position = position;

		return new L7.Actor(config);
	};

})();

