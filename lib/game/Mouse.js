(function() {
	L7.Mouse = {
		init: function(hook) {
			this._hook = hook;
			this._mouseMoveListener = _.bind(this._onMouseMove, this);
			this._hook.addEventListener('mousemove', this._mouseMoveListener, false);
			this._pos = L7.p();
		},

		_onMouseMove: function(e) {
			this._pos = L7.p(e.offsetX, e.offsetY);
		}
	};

	Object.defineProperty(L7.Mouse, 'position', {
		get: function() {
			return this._pos;
		},
		enumerable: true
	});
})();

