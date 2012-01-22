describe('Viewport', function() {
	describe('construction', function() {
		it('should have reasonable defaults', function() {
			var v = new L7.Viewport();

			expect(v.preventOverscroll).toBe(false);
			expect(v.anchorX).toBe(0);
			expect(v.anchorY).toBe(0);
			expect(v.width > 0).toBe(true);
			expect(v.height > 0).toBe(true);
		});
	});

	describe('scrolling', function() {
		it('should scroll y', function() {
			var v = new L7.Viewport({
				width: 100,
				height: 100,
				initialAnchor: L7.p(0, 0)
			});

			v.scrollY(10);
			expect(v.anchorY).toBe(10);
			expect(v.anchorX).toBe(0);
		});
		
		it('should scroll x', function() {
			var v = new L7.Viewport({
				width: 100,
				height: 100,
				initialAnchor: L7.p(0, 0)
			});

			v.scrollX(20);
			expect(v.anchorX).toBe(20);
			expect(v.anchorY).toBe(0);
		});

		it('should center on', function() {
			var v = new L7.Viewport({
				width: 200,
				height: 400
			});

			v.centerOn(150, 150);
			expect(v.anchorX).toBe(50);
			expect(v.anchorY).toBe(-50);
		});
	});
});

