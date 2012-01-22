describe('Game', function() {
	it('should have a requestAnimationFrame', function() {
		expect(window.requestAnimationFrame).toBeDefined();
	});

	describe('construction', function() {
		it('should create a viewport', function() {
			var w = 100, h = 200, initialAnchor = L7.p(2, 3);
			var game = new L7.Game({
				width: w,
				height: h,
				initialAnchor: initialAnchor
			});

			expect(game.viewport.width).toEqual(w);
			expect(game.viewport.height).toEqual(h);
			expect(game.viewport.anchorX).toEqual(initialAnchor.x);
			expect(game.viewport.anchorY).toEqual(initialAnchor.y);
		});

		it('should create a canvas', function() {
			var w = 10, h = 6;

			var game = new L7.Game({
				width: w,
				height: h
			});

			expect(game.canvas.width).toEqual(w);
			expect(game.canvas.height).toEqual(h);
			expect(game.canvas.parentElement).toEqual(document.body);
		});
	});
});
