(function() {
	L7.CopyProperty = function(config) {
		_.extend(this, config);
	};

	L7.CopyProperty.prototype = {
		reset: function() {
		},

		update: function() {
			if(this.done || this.disabled) {
				return;
			}

			var target;
			for(var i = 0; i < this.targets.length; ++i) {
				target = this.targets[i];
				target[this.destProperty] = target[this.srcProperty];
			}

			this.done = true;
		}
	};
})();

