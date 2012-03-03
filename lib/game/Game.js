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
		this.canvas = this._createCanvas();

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
			var canvas = document.createElement('canvas');
			canvas.width = this.viewport.width;
			canvas.height = this.viewport.height;
			canvas.style.imageRendering = '-webkit-optimize-contrast';

			this.container.appendChild(canvas);
			return canvas;
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

		_updateFps: function(end) {
			var seconds = (end - this._frameCountStart) / 1000;
			var fps = this._frameCount / seconds;

			if(this.fpsContainer) {
				this.fpsContainer.innerHTML = fps;
			} else {
				console.log('fps: ' + fps);
			}
		},

		_doFrame: function(timestamp) {
			if(!this._frameCountStart) {
				this._frameCountStart = timestamp;
				this._frameCount = 1;
			} else {
				++this._frameCount;
				if(this._frameCount === 100) {
					this._updateFps(timestamp);
					delete this._frameCountStart;
				}
			}

			var fullDelta = timestamp - (this._lastTimestamp || timestamp);
			this._lastTimestamp = timestamp;

			var delta = fullDelta;
			while (delta > 0) {
				var step = Math.min(_maxDelta, delta);
				this._updateDelays(step);
				this.board.update(step, timestamp);
				delta -= step;
			}

			var context;

			if(this.webgl) {
				context = this.canvas.getContext('experimental-webgl');
				context.viewportWidth = this.canvas.width;
				context.viewportHeight = this.canvas.height;
			} else {
				context = this.canvas.getContext('2d');
				context.clearRect(0, 0, this.canvas.width, this.canvas.height);
			}

			var renderMethod = this.webgl ? 'rendergl' : 'render';

			this.board[renderMethod](fullDelta, context, this.viewport.anchorX, this.viewport.anchorY, timestamp);

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

