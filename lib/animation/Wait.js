(function() {
	var _idCounter = 0;
	L7.Wait = function(duration) {
		this.duration = duration;
		this.reset();
	}

	L7.Wait.prototype = {
		reset: function() {
			this._elapsed = 0;
			this.done = this._elapsed >= this.duration;
		},

		update: function(delta, timestamp, board) {
			if(this.done) {
				return;
			}

			this._elapsed += delta;
			if(this._elapsed > this.duration) {
				this.done = true;
			}
		}
	};
})();

