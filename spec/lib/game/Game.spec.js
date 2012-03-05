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

		it('should create everything it needs from just a board', function() {
			var board = new L7.Board({
				width: 5,
				height: 5,
				borderWidth: 2,
				tileSize: 10
			});
		
			var game = new L7.Game(board);

			expect(game.viewport.width).toEqual(board.width * (board.tileSize + board.borderWidth) + board.borderWidth);
			expect(game.viewport.height).toEqual(board.height * (board.tileSize + board.borderWidth) + board.borderWidth);
			expect(game.renderer).toBeTruthy();
			expect(game.canvas).toBeTruthy();
			expect(game.board).toEqual(board);
			expect(board.viewport).toEqual(game.viewport);
		});
	});
});
