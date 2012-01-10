describe("Board", function() {
	describe("construction", function() {
		it("should default to 0x0 and 0 border", function() {
			var board = new L7.Board();

			expect(board).toBeDefined();
			expect(board.borderWidth).toBe(0);
			expect(board.size.width).toBe(0);
			expect(board.size.height).toBe(0);
			expect(board.tileSize).toBe(0);
		});

		it("should set itself up from the config", function() {
			var borderWidth = 12;
			var width = 8;
			var height = 10;
			var tileSize = 4;

			var board = new L7.Board({
				borderWidth: borderWidth,
				width: width,
				height: height,
				tileSize: tileSize
			});

			expect(board.size.width).toEqual(width);
			expect(board.size.height).toEqual(height);
			expect(board.borderWidth).toEqual(borderWidth);
			expect(board.tileSize).toEqual(tileSize);
		});

		it("should create tiles from its config", function() {
			var width = 3;
			var height = 2;
			var tileSize = 24;

			var board = new L7.Board({
				width: width,
				height: height,
				tileSize: tileSize
			});

			for(var i = 0; i < height; ++i) {
				for(var k = 0; k < width; ++k) {
					var tile = board.tileAt(L7.p(i, k));
					expect(tile).toBeDefined();
				}
			}

			expect(board.tileAt(L7.p(5, 6))).toBeFalsy();

			expect(board.tiles.length).toEqual(width * height);
		});

		it("should create a canvas", function() {
			var tileSize = 4;
			var borderWidth = 2;
			var board = new L7.Board({
				width: 3,
				height: 3,
				tileSize: tileSize,
				borderWidth: borderWidth
			});

			expect(board.canvas).toBeDefined();
			expect(board.canvas.width).toEqual(board.size.width * tileSize + ((board.size.width + 1) * borderWidth));
			expect(board.canvas.height).toEqual(board.size.height * tileSize + ((board.size.height + 1) * borderWidth));
			expect(board.canvas.parentElement).toEqual(document.body);
		});
	});

	describe("tile traversal", function() {
		it("should return a tile with tileAt", function() {
			var board = new L7.Board({
				width: 3,
				height: 4
			});

			var tile = board.tileAt(L7.p(2, 1));
			expect(tile).toBeDefined();

			var tile2 = board.tileAt(L7.p(20, 0));
			expect(tile2).toBeFalsy();
		});
	});

	describe("actor operations", function() {
		it("should indicate if an actor is out of bounds", function() {
			var board = new L7.Board({
				width: 3,
				height: 3
			});

			var actor = {
				pieces: [
					{ position: L7.p(0, 0) },
					{ position: L7.p(1, 2) },
					{ position: L7.p(4, 2) }
				]
			};

			expect(board.isOutOfBounds(actor)).toBe(true);

			var actor2 = {
				pieces: [
					{ position: L7.p(0, 0) },
					{ position: L7.p(1, 1) },
					{ position: L7.p(2, 2) }
				]
			};

			expect(board.isOutOfBounds(actor2)).toBe(false);
		});

		it("should add an actor properly", function() {
			var board = new L7.Board({ width: 2, height: 2 });

			var actor = {
				pieces: [
					{ position: L7.p(1, 1) },
					{ position: L7.p(0, 0) }
				]
			};

			board.addActor(actor);

			expect(board.actors.length).toBe(1);
			
			actor.pieces.forEach(function(piece) {
				var tile = board.tileAt(piece.position);
				expect(tile.inhabitants.indexOf(piece) > -1 ).toBe(true);
			});

			expect(actor.board).toEqual(board);
		});

		it("should move an actor", function() {
			var board = new L7.Board({
				width: 3,
				height: 3
			});

			var actor = {
				pieces: [
					{ position: L7.p(1,1) }
				]
			};

			board.moveActor({
				actor: actor,
				delta: L7.p(1,1)
			});

			expect(actor.pieces[0].position.x).toEqual(2);
			expect(actor.pieces[0].position.y).toEqual(2);
		});
		
	});

	describe('updating', function() {
		it("should have each actor update", function() {
			var actors = [ new L7.Actor(), new L7.Actor(), new L7.Actor() ];
			var board = new L7.Board({
				width: 3,
				height: 3
			});

			actors.forEach(function(actor) {
				spyOn(actor, 'update');
				board.addActor(actor);
			});

			board.update(0);

			actors.forEach(function(actor) {
				expect(actor.update).toHaveBeenCalled();
			});
		});
	});

	describe('rendering', function() {
		it('should ask each tile for its color', function() {
			var board = new L7.Board({
				width: 2,
				height: 2
			});

			board.tiles.forEach(function(tile) {
				spyOn(tile, 'getColor');
			});

			board.render(0);

			board.tiles.forEach(function(tile) {
				expect(tile.getColor).toHaveBeenCalled();
			});
		});
	});
});

