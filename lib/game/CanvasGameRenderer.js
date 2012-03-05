(function() {
	L7.CanvasGameRenderer = function(viewport) {
		this.viewport = viewport;
	};

	L7.CanvasGameRenderer.prototype = {
		init: function(canvas) {
			canvas.style.imageRendering = '-webkit-optimize-contrast';
		},

		renderFrame: function(canvas, board, delta, anchorXpx, anchorYpx, timestamp) {
			var context = canvas.getContext('2d');
			context.clearRect(0, 0, canvas.width, canvas.height);
			board.render(delta, context, anchorXpx, anchorYpx, timestamp);
		}
	};

})();

