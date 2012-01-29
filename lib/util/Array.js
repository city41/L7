(function() {
	if(typeof Array.prototype.add === 'undefined') {
		Array.prototype.add = function(item) {
			this.push(item);
			return this;
		};
	}

	if(typeof Array.prototype.remove === 'undefined') {
		Array.prototype.remove = function(item) {
			var index = this.indexOf(item);

			if(index >= 0) {
				this.splice(index, 1);
			}
			return this;
		};
	}

	if(typeof Array.prototype.last === 'undefined') {
		Object.defineProperty(Array.prototype, 'last', {
			get: function() {
				return this[this.length - 1];
			},
			enumerable: false
		});
	}

	if(typeof Array.prototype.first === 'undefined') {
		Object.defineProperty(Array.prototype, 'first', {
			get: function() {
				return this[0];
			},
			enumerable: false
		});
	}

})();

