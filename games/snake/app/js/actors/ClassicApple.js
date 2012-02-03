(function() {
	var _appleConfig = {
		team: 'apple',
		color: [160, 165, 159, 1],
		die: function() {
			this.board.removeActor(this);
			this.fireEvent('death', this);
		}
	};

	sg.ClassicApple = function(config) {
		var actor = new L7.Actor(_.extend(config, _appleConfig));
		return actor;
	};

})();

