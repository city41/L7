(function() {
	var _idCounter = 0;
	L7.Invoke = function(func) {
		_.extend(this, config);
		this.reset();
	}

	L7.Invoke.prototype = {
		reset: function() {
			this.done = false;
		},

		update: function(delta, timestamp, board) {
			if(this.done) {
				return;
			}

			this.func();
			this.done = true;
		}
	};
})();


