(function() {
	var _global = this;

	_global.L7 = _global.L7 || {};

	_global.L7.global = _global;

	Object.defineProperty(_global.L7, 'useWebGL', {
		get: function() {
			return this._useWebGL;
		},
		set: function(useWebGL) {
			if(this.hasOwnProperty('_useWebGL')) {
				throw new Error('You can only set useWebGL once');
			}
			this._useWebGL = useWebGL;
		}
	});

	_global.L7.isSupportedBrowser = (function() {
		var ua = window.navigator.userAgent.toLowerCase();

		return ua.indexOf('chrome') > -1 || ua.indexOf('firefox') > -1;
	})();

	_global.L7.isWebGLAvailable = (function() {
		var canvas = document.createElement('canvas');

		if(!canvas) {
			return false;
		}

		try {
			return !!canvas.getContext('experimental-webgl');
		} catch(e) {
			return false;
		}
	})();

})();

