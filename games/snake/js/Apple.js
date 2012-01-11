(function() {
	var _appleConfig = {
		team: 'apple',
		color: [150, 20, 0, 1],
		die: function() {
			this.board.removeActor(this);
		}
	};

	snk.Apple = function(config) {
		var actor = new L7.Actor(_.extend(config, _appleConfig));
		return actor;
	};

})();


