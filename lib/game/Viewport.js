(function() {
	L7.Viewport = function(config) {
		config = config || {};
		_.extend(this, config);

		if(_.isUndefined(this.preventOverscroll)) {
			this.preventOverscroll = false;
		}

		this.anchorX = (config.initialAnchor && config.initialAnchor.x) || 0;
		this.anchorY = (config.initialAnchor && config.initialAnchor.y) || 0;
		this.width = this.width || 100;
		this.height = this.height || 100;
	};

	L7.Viewport.prototype = {
		scrollY: function(amount) {
			this.anchorY += amount;
		},

		scrollX: function(amount) {
			this.anchorX += amount;
		},
		
		centerOn: function(xOrPair, yOrUndefined) {
			var x = xOrPair.x || xOrPair;
			var y = xOrPair.y || yOrUndefined;

			this.anchorX = Math.floor(x - this.width / 2)
			this.anchorY = Math.floor(y - this.height / 2)
		},

		reset: function() {
			this.anchorY = this.anchorX = 0;
		}
	};

})();

