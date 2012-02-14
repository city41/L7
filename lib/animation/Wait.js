(function() {
	var _idCounter = 0;
	L7.Wait = function(config) {
		_.extend(this, config);
		this._specifiedDuration = this.duration;
		this.reset();
	}

	L7.Wait.prototype = {
		reset: function() {
			this.duration = this._specifiedDuration || L7.rand(this.min, this.max);
			this._elapsed = 0;
			this.done = this._elapsed >= this.duration;
		},

		update: function(delta, timestamp, board) {
			if(this.done) {
				return;
			}

			this._elapsed += delta;
			this.done = this._elapsed >= this.duration;
		}
	};
})();

