(function() {
	L7.ImageLoader = function(config) {
		_.extend(this, config);

		if(this.loadNow) {
			this.load();
		}
	};

	L7.ImageLoader.prototype = {
		load: function() {
			this._pendingCount = this.srcs.length;
			this._images = [];
			var me = this;

			this.srcs.forEach(function(src) {
				var image = new Image();
				image.onload = function() {
					var index = me.srcs.indexOf(src);
					me._images[index] = image;
					--me._pendingCount;
					if(me._pendingCount === 0) {
						me.handler(me._images);
					}
				};
				image.src = src;
			});
		}
	};

})();

