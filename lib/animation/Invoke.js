(function() {
	var _idCounter = 0;
	L7.Invoke = function(func) {
		this.func = func;
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


