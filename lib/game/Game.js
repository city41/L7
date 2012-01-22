(function() {
	window.requestAnimationFrame = window.requestAnimationFrame ||
		window.mozRequestAnimationFrame ||  
   	window.webkitRequestAnimationFrame || 
		window.msRequestAnimationFrame ||
		window.oRequestAnimationFrame ||
		function(callback) {
			window.setTimeout(callback, 1000 / 60);
		};

	L7.Game = function(config) {
		_.extend(this, config);
		this.viewport = new L7.Viewport(this);

		if(this.board) {
			this.board.viewport = this.viewport;
		}
		this.container = this.container || document.body;
		this.canvas = this._createCanvas();
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

		replaceBoard: function(newBoard) {
			if(this.board) {
				this.board.destroy();
			}
			this.board = newBoard;
			this.board.viewport = this.viewport;
		},

		_doFrame: function(timestamp) {
			var delta = timestamp - this._lastTimestamp;
			this._lastTimestamp = timestamp;

			this.board.update(delta, timestamp);
			this.board.render(delta, this.canvas.getContext('2d'), this.viewport.anchorX, this.viewport.anchorY, timestamp);
			requestAnimationFrame(this._doFrame);
		}
	};

})();

