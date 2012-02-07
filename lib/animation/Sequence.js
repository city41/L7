(function() {
	L7.Sequence = function() {
		this.children = [];
		this._currentChild = 0;
	};

	L7.Sequence.prototype = {
		reset: function() {
			this.done = false;
			this._currentChild = 0;

			this.children.forEach(function(child) {
				child.reset();
			});
		},

		update: function() {
			// TODO: problem, this is causing "time leak"
			// children might have less than delta to go, if so, they will only
			// go as far as they need to, and the rest of the delta gets thrown away
			// if there is left over delta, it should go to the next child
			this.done = this._currentChild >= this.children.length;

			if (this.done) {
				return;
			}

			var curChild = this.children[this._currentChild];

			curChild.update.apply(curChild, arguments);

			if (curChild.done) {++this._currentChild;
			}
			this.done = this._currentChild >= this.children.length;
		}
	};
})();

