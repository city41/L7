(function() {
	AppleDeath = function(config) {
		_.extend(this, config);
		this.apple.pieces[0].scale = 1;
		this.apple._deathCount = 150;
		this.apple.board.promote(this.apple);
	};

	AppleDeath.prototype.update = function(delta, timestamp, board) {
		this.apple._deathCount -= delta;
		this.apple.pieces[0].scale -= (.02 * delta);

		if(this.apple._deathCount < 0) {
			this.callback.call(this.apple);
			board.removeDaemon(this);
		}
	};
})();

