(function() {
	p.ZombieDaemon = function(config) {
		_.extend(this, config);
		this._elapsed = 0;
	};

	p.ZombieDaemon.prototype = {
		update: function(delta, timestamp, board) {
			this._elapsed += delta;
			if(this._elapsed > this.rate) {
				this._elapsed -= this.rate;
				this._releaseZombie(board);
			}
		},

		_releaseZombie: function(board) {
			var x = L7.rand(0, board.width);
			var y;
			if(x > 0 && x < board.width - 1) {
				y = L7.coin() ? 0 : board.height - 1;
			} else {
				y = L7.rand(0, board.height);
			}

			board.addActor(new p.Zombie({
				position: L7.p(x, y),
				player: this.player,
				rate: 1000
			}));
		}
	};
})();

