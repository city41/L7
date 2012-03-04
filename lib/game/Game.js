(function() {
	var _maxDelta = (1 / 60) * 1000;

	window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame || window.oRequestAnimationFrame || function(callback) {
		window.setTimeout(callback, _maxDelta);
	};

	function _getConfig(configOrBoard) {
		if (typeof configOrBoard.render !== 'function' && typeof configOrBoard.update !== 'function') {
			return configOrBoard;
		}
		var b = configOrBoard;

		return {
			width: b.width * (b.tileSize + b.borderWidth) + b.borderWidth,
			height: b.height * (b.tileSize + b.borderWidth) + b.borderWidth,
			board: b
		};
	}

	L7.Game = function(configOrBoard) {
		var config = _getConfig(configOrBoard);
		_.extend(this, config);
		_.bindAll(this, '_doFrame');
		this.viewport = new L7.Viewport(this);

		if (this.board) {
			this.board.viewport = this.viewport;
		}
		this.container = this.container || document.body;
		this.renderer = L7.useWebGL ? new L7.WebGLGameRenderer(this.viewport) : new L7.CanvasGameRenderer(this.viewport);
		this._createCanvas();
		this.renderer.init(this.canvas);

		L7.Keys.init(this.canvas);
		L7.Mouse.init(this.canvas);

		this.delays = [];

		var me = this;
		L7.global.addEventListener('blur', function() {
			delete me._lastTimestamp;
		});
	};

	L7.Game.prototype = {
		_createCanvas: function() {
			this.canvas = document.createElement('canvas');
			this.canvas.width = this.viewport.width;
			this.canvas.height = this.viewport.height;

			this.container.appendChild(this.canvas);
		},

		go: function() {
			delete this._lastTimestamp;
			this._doFrame(Date.now());
		},

		after: function(millis, callback) {
			this.delays.add({
				remaining: millis,
				handler: callback
			});
		},

		replaceBoard: function(newBoard) {
			if (this.board && this.board.destroy) {
				this.board.destroy();
			}
			this.board = newBoard;
			this.board.viewport = this.viewport;
			this.viewport.reset();
		},

		_updateDelays: function(delta) {
			var toDelete = [];
			this.delays.forEach(function(delay) {
				delay.remaining -= delta;
				if (delay.remaining <= 0) {
					delay.handler.call(delay.scope, this);
					toDelete.push(delay);
				}
			},
			this);

			toDelete.forEach(function(deleteMe) {
				this.delays.remove(deleteMe);
			},
			this);
		},

		_displayFps: function(end) {
			var seconds = (end - this._frameCountStart) / 1000;
			var fps = this._frameCount / seconds;

			if(this.fpsContainer) {
				this.fpsContainer.innerHTML = fps;
			} else {
				console.log('fps: ' + fps);
			}
		},

		_updateFps: function(timestamp) {
			if(!this._frameCountStart) {
				this._frameCountStart = timestamp;
				this._frameCount = 1;
			} else {
				++this._frameCount;
				var delta = timestamp - this._frameCountStart;
				if(delta > 4000) {
					this._displayFps(timestamp);
					delete this._frameCountStart;
				}
			}
		},

		_doFrame: function(timestamp) {
			this._updateFps(timestamp);

			var fullDelta = timestamp - (this._lastTimestamp || timestamp);
			this._lastTimestamp = timestamp;

			var delta = fullDelta;
			while (delta > 0) {
				var step = Math.min(_maxDelta, delta);
				this._updateDelays(step);
				this.board.update(step, timestamp);
				delta -= step;
			}

			this.renderer.renderFrame(this.canvas, this.board, fullDelta, this.viewport.anchorX, this.viewport.anchorY, timestamp);

			if (!this.paused) {
				requestAnimationFrame(this._doFrame);
			}
		}
	};

	Object.defineProperty(L7.Game.prototype, 'paused', {
		get: function() {
			return this._paused;
		},
		set: function(paused) {
			var curPaused = this._paused;
			this._paused = paused;

			if (!paused) {
				this.go();
			}
		}
	});
})();

