describe('ParallaxBoard', function() {
	describe('construction', function() {
		it('should default to an empty boards array', function() {
			var p = new L7.ParallaxBoard();
			expect(p.boards.length).toBe(0);
		});

		it('should set a default parallax ratio if given boards lack one', function() {
			var boards = [{}];

			var parallax = new L7.ParallaxBoard({
				boards: boards
			});

			expect(boards[0].parallaxRatio).toBeDefined();
		});
	});

	describe('update', function() {
		it('should have its children boards update', function() {
			function createBoard() {
				var b = {
					parallaxRatio: 1,
					update: function() {}
				};
				spyOn(b, 'update');
				return b;
			};

			var board1 = createBoard();
			var board2 = createBoard();

			var p = new L7.ParallaxBoard({
				boards: [board1, board2]
			});

			p.update();

			expect(board1.update).toHaveBeenCalled();
			expect(board1.update).toHaveBeenCalled();
		});
	});

	describe('render', function() {
		it('should have its children boards render, in order', function() {
			var callCount = 0;
			function createBoard() {
				var b = {
					parallaxRatio: 1,
					render: function() {
						this.callOrder = ++callCount;
					}
				};
				return b;
			};

			var board1 = createBoard();
			var board2 = createBoard();

			var p = new L7.ParallaxBoard({
				boards: [board1, board2]
			});

			p.render();

			expect(board1.callOrder).toEqual(1);
			expect(board2.callOrder).toEqual(2);
		});

		it('should use the boards parallaxRatio', function() {
			var board = {
				parallaxRatio: 0.45,
				render: function() {

				}
			};

			spyOn(board, 'render');

			var p = new L7.ParallaxBoard({
				boards: [board]
			});

			var delta = 0;
			var context = {};
			var anchorX = 10;
			var anchorY = 20;
			var timestamp = 1;

			p.render(delta, context, anchorX, anchorY, timestamp);

			expect(board.render).toHaveBeenCalledWith(delta, context, anchorX * board.parallaxRatio, anchorY * board.parallaxRatio, timestamp);
		});
	});

});

