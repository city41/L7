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

	_global.L7.isFirefox = window.navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
	_global.L7.isChrome = window.navigator.userAgent.toLowerCase().indexOf('chrome') > -1;

	_global.L7.isSupportedBrowser = _global.L7.isFirefox || _global.L7.isChrome;

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

