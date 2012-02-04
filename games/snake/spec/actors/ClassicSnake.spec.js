describe('ClassicSnake', function() {

	describe('construction', function() {
		describe('defaults', function() {
			var snake;
			beforeEach(function() {
				snake = new sg.ClassicSnake();
			});

			it('should have a default size of 1', function() {
				expect(snake.pieces.length).toEqual(1);
			});

			it('should have a default rate of 1000', function() {
				expect(snake.timers.move.interval).toBe(1000);
			});
			it('should have a default direction of East', function() {
				expect(snake.direction).toEqual(sg.Direction.East);
			});
			it('should default to not being active', function() {
				expect(snake.active).toBe(false);
			});
		});

		describe("config", function() {
			it("should set its size from the config", function() {
				var size = 4;
				var snake = new sg.ClassicSnake({
					size: size
				});

				expect(snake.pieces.length).toEqual(size);
			});
			it("should set its direction from the config", function() {
				var dir = sg.Direction.North;
				var snake = new sg.ClassicSnake({
					direction: dir
				});
				expect(snake.direction).toEqual(dir);
			});
			it('should set active from the config', function() {
				var active = true;
				var snake = new sg.ClassicSnake({
					active: active
				});

				expect(snake.active).toBe(active);
			});
		});

		describe('turning', function() {
			var snake;
			beforeEach(function() {
				snake = new sg.ClassicSnake({
					direction: sg.Direction.East
				});
			});
			it('should turn 90 degrees', function() {
				snake.direction = sg.Direction.East;
				var dir = sg.Direction.South;
				snake.setDirection(dir);

				expect(snake.direction).toEqual(dir);
			});
			it('should not turn around 180', function() {
				var origDir = sg.Direction.East;
				snake.direction = origDir;
				var newDir = sg.Direction.West;
				snake.setDirection(newDir);

				expect(snake.direction).not.toEqual(newDir);
				expect(snake.direction).toEqual(origDir);
			});
			it('should turn east when right is pressed', function() {
				snake.direction = sg.Direction.North;
				snake.keyInputs.right.handler.call(snake);

				expect(snake.direction).toEqual(sg.Direction.East);
			});
			it('should turn north when up is pressed', function() {
				snake.direction = sg.Direction.West;
				snake.keyInputs.up.handler.call(snake);

				expect(snake.direction).toEqual(sg.Direction.North);
			});
		});
		describe('operations', function() {
			var snake;
			beforeEach(function() {
				snake = new sg.ClassicSnake({
					direction: sg.Direction.East
				});
			});
			it('should grow', function() {
				snake.grow();
				expect(snake.pieces.length).toBe(2);
			});
			it('should move', function() {
				var board = new L7.Board({
					width: 4,
					height: 4
				});
				board.addActor(snake);

				var position = snake.position;
				snake.setDirection(sg.Direction.North);
				snake.moveSnake();
				expect(snake.position.x).toEqual(position.x);
				expect(snake.position.y).toEqual(position.y - 1);
				expect(snake.pieces[0].lastPosition).toEqual(position);
			});
		});
		describe('hit detection', function() {
			var snake;
			beforeEach(function() {
				snake = new sg.ClassicSnake();
			});
			it('should die if it hits itself', function() {
				spyOn(snake, 'die');
				snake.hitDetection.snake.call(snake);
				expect(snake.die).toHaveBeenCalled();
			});
			it('should die if it hits a wall', function() {
				spyOn(snake, 'die');
				snake.hitDetection.wall.call(snake);
				expect(snake.die).toHaveBeenCalled();
			});
			it('should eat an apple and grow', function() {
				var apple = {
					die: function() {}
				};

				spyOn(snake, 'grow');
				spyOn(apple, 'die');

				snake.hitDetection.apple.call(snake, {}, apple);
				expect(snake.grow).toHaveBeenCalled();
				expect(apple.die).toHaveBeenCalled();
			});
		});
	});
});


