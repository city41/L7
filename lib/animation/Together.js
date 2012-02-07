(function() {
	L7.Together = function() {
		this.children = [];
	};

	L7.Together.prototype = {
		reset: function() {
			this.done = false;
			this.children.forEach(function(child) {
				child.reset();
			});
		},

		update: function() {
			// TODO: problem, this is causing "time leak"
			// children might have less than delta to go, if so, they will only
			// go as far as they need to, and the rest of the delta gets thrown away
			// if there is left over delta, it should go to the next child

			if(this.done) {
				return;
			}

			var args = _.toArray(arguments);
			var childNotDone = false;

			this.children.forEach(function(child) {
				child.update.apply(child, args);
				if(!child.done) {
					childNotDone = true;
				}
			});

			this.done = !childNotDone;
		}
	};
})();


