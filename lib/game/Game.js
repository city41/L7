(function() {
	var _maxDelta = (1 / 60) * 1000;

	window.requestAnimationFrame = window.requestAnimationFrame ||
		window.mozRequestAnimationFrame ||  
   	window.webkitRequestAnimationFrame || 
		window.msRequestAnimationFrame ||
		window.oRequestAnimationFrame ||
		function(callback) {
			window.setTimeout(callback, 1000 / 60);
		};

	function _getConfig(configOrBoard) {
		if(typeof configOrBoard.render !== 'function' && typeof configOrBoard.update !== 'function') {
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

		if(this.board) {
			this.board.viewport = this.viewport;
		}
		this.container = this.container || document.body;
		this.canvas = this._createCanvas();

		this.delays = [];
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
			this._lastTimestamp = Date.now();
			this._doFrame(this._lastTimestamp);
		},

		after: function(millis, callback) {
			this.delays.add({
				remaining: millis,
				handler: callback
			});
		},

		replaceBoard: function(newBoard) {
			if(this.board && this.board.destroy) {
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
				if(delay.remaining <= 0) {
					delay.handler.call(delay.scope, this);
					toDelete.push(delay);
				}
			}, this);

			toDelete.forEach(function(deleteMe) {
				this.delays.remove(deleteMe);
			}, this);
		},

		_doFrame: function(timestamp) {
			var fullDelta = timestamp - this._lastTimestamp;
			this._lastTimestamp = timestamp;
			
			var delta = fullDelta;
			while(delta > 0) {
				var step = Math.min(_maxDelta, delta);
				this._updateDelays(step);
				this.board.update(step, timestamp);
				delta -= step;
			}

			var context = this.canvas.getContext('2d');
			context.clearRect(0, 0, this.canvas.width, this.canvas.height);

			this.board.render(fullDelta, context, this.viewport.anchorX, this.viewport.anchorY, timestamp);
			requestAnimationFrame(this._doFrame);
		}
	};

})();

