(function() {
	L7.Repeat = function(count) {
		this.children = [];
		this._currentChild = 0;
		this._curCount = 0;
		this.count = count;
	};

	L7.Repeat.prototype = {
		reset: function() {
			this.done = false;
			this._currentChild = 0;
			this._curCount = 0;

			this.children.forEach(function(child) {
				child.reset();
			});
		},

		update: function() {
			// TODO: problem, this is causing "time leak"
			// children might have less than delta to go, if so, they will only
			// go as far as they need to, and the rest of the delta gets thrown away
			// if there is left over delta, it should go to the next child

			this.done = this._curCount >= this.count;

			if(this.done) {
				return;
			}

			var curChild = this.children[this._currentChild];

			curChild.update.apply(curChild, arguments);


			if(curChild.done) {
				++this._currentChild;
				if(this._currentChild >= this.children.length) {
					this._currentChild = 0;
					++this._curCount;
					this.children.forEach(function(child) {
						child.reset();
					});
				}
			}
			this.done = this._curCount >= this.count;
		}
	};
})();


