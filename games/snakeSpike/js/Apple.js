(function() {
	var _appleConfig = {
		team: 'apple',
		color: [150, 20, 0, 1],
		die: function() {
			if (!this.dying) {
				this.dying = true;
				this.board.addDaemon(new AppleDeath({
					apple: this,
					callback: function() {
						this.board.removeActor(this);
						this.fireEvent('death', this);
					}
				}));
			}
		}
	};

	snk.Apple = function(config) {
		var actor = new L7.Actor(_.extend(config, _appleConfig));
		return actor;
	};

})();

