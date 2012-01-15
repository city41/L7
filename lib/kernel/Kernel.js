(function() {
	window.requestAnimationFrame = window.requestAnimationFrame ||
		window.mozRequestAnimationFrame ||  
   	window.webkitRequestAnimationFrame || 
		window.msRequestAnimationFrame;

	L7.Kernel = function(board) {
		this.board = board;
		_.bindAll(this, '_doFrame');
	};

	L7.Kernel.prototype = {
		go: function() {
			this._doFrame(Date.now());
		},

		replaceBoard: function(newBoard) {
			this.board.destroy();
			this.board = newBoard;
		},

		_doFrame: function(timestamp) {
			var delta = timestamp - (this._lastTimestamp || timestamp);

			this.board.update(delta, timestamp);
			this.board.render(delta, timestamp);
			requestAnimationFrame(this._doFrame);

			this._lastTimestamp = timestamp;
		}
	};

})();

