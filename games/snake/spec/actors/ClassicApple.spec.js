describe("ClassicApple", function() {
	describe('construction', function() {
		it('should be on team apple', function() {
			var apple = new sg.ClassicApple();
			expect(apple.team).toEqual('apple');
		});
		it('should set its position from the config', function() {
			var p = L7.p(4, 5);
			var apple = new sg.ClassicApple({
				position: p
			});
			expect(apple.position).toEqual(p);
		});
		it('should have a color', function() {
			var apple = new sg.ClassicApple();
			expect(apple.color).toBeDefined();
			expect(apple.color.length).toBe(4);
		});
	});
	describe('dying', function() {
		it('should remove itself form the board when it dies', function() {
			var apple = new sg.ClassicApple();
			var board = new L7.Board({
				width: 3,
				height: 3
			});

			board.addActor(apple);
			spyOn(board, 'removeActor');

			apple.die();

			expect(board.removeActor).toHaveBeenCalled();
		});
		it('should fire the death event when it dies', function() {
			function onDeath() {
				onDeath.called = true;
			}

			var apple = new sg.ClassicApple();

			apple.on('death', onDeath);
			apple.die();

			expect(onDeath.called).toBe(true);
		});
	});
});

