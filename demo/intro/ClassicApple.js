(function() {
	var _appleConfig = {
		team: 'apple',
		color: [255, 0, 0, 1],
		die: function() {
			if(this.board) {
				this.board.removeActor(this);
			}
			this.fireEvent('death', this);
		}
	};

	i.ClassicApple = function(config) {
		var actor = new L7.Actor(_.extend(config || {}, _appleConfig));
		return actor;
	};

})();


