describe('ClassicSnake', function() {
	describe('construction', function() {
			it('should have a default size of 1', function() {
					var snake = new sg.ClassicSnake();

					expect(snake.pieces.length).toEqual(1);
			});
	});
})();

