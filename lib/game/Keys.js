(function() {
	L7.Keys = {
		arrows : {
			'37' : 'left',
			'38' : 'up',
			'39' : 'right',
			'40' : 'down'
		},
		init: function() {
			this._hook = window;

			this._keyDownListener = _.bind(this._onKeyDown, this);
			this._hook.addEventListener("keydown", this._keyDownListener, false);

			this._keyUpListener = _.bind(this._onKeyUp, this);
			this._hook.addEventListener("keyup", this._keyUpListener, false);

			this._downKeys = {};
		},

		_getCharacter: function(keyCode) {
			var arrow = this.arrows[keyCode.toString()];

			return arrow || String.fromCharCode(keyCode).toLowerCase();
		},

		_onKeyDown: function(e) {
			var character = this._getCharacter(e.keyCode);

			if (!this._downKeys[character]) {
				this._downKeys[character] = Date.now();
			}
		},

		_onKeyUp: function(e) {
			var character = this._getCharacter(e.keyCode);

			delete this._downKeys[character];
		},

		down: function(key) {
			return this._downKeys[key] !== undefined;
		},

		downSince: function(key, timestamp) {
			return this.down(key) && this._downKeys[key] > timestamp;
		}
	}
})();


