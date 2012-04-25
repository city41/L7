(function() {
	function _strip(src) {
		var lastPeriod = src.lastIndexOf('.');
		var lastSlash = src.lastIndexOf('/');

		if(lastPeriod > -1) {
			src = src.substring(0, lastPeriod);
		}
		if(lastSlash > -1) {
			src = src.substring(lastSlash + 1);
		}

		return src.replace(/[^a-zA-Z0-9]/g, '');
	}

	L7.ImageLoader = function(config) {
		_.extend(this, config);

		if(this.loadNow) {
			this.load();
		}
	};

	L7.ImageLoader.prototype = {
		load: function() {
			this._pendingCount = this.srcs.length;
			this._images = {};
			var me = this;

			this.srcs.forEach(function(src) {
				var image = new Image();
				image.onload = function() {
					me._images[_strip(src)] = image;
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

