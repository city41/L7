describe("Board", function() {
	describe("construction", function() {
		it("should default to 0x0 and 0 border", function() {
			var board = new L7.Board();

			expect(board).toBeDefined();
			expect(board.borderWidth).toBe(0);
			expect(board.size.width).toBe(0);
			expect(board.size.height).toBe(0);
		});

		it("should set itself up from the config", function() {
			var borderWidth = 12;
			var width = 8;
			var height = 10;

			var board = new L7.Board({
				borderWidth: borderWidth,
				width: width,
				height: height
			});

			expect(board.size.width).toEqual(width);
			expect(board.size.height).toEqual(height);
			expect(board.borderWidth).toEqual(borderWidth);
		});

		it("should create tiles from its config", function() {
			var width = 3;
			var height = 2;

			var board = new L7.Board({
				width: width,
				height: height
			});

			for(var i = 0; i < height; ++i) {
				expect(board.row(i)).toBeDefined();
				for(var k = 0; k < width; ++k) {
					expect(board.row(i).at(k)).toBeDefined();
				}
			}

			expect(board.row(30)).toBeUndefined();
			expect(board.row(0).at(50)).toBeUndefined();

			expect(board.tiles.length).toEqual(width * height);
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
			expect(tile2).toBeUndefined();
		});

		it("should return rows with each", function() {
			var width = 3, height = 2;
			var board = new L7.Board({ width: width, height: height });
			var expectedTileCount = width * height;

			var count = 0;
			board.each(function(row) {
				row.each(function(tile) {
					expect(tile).toBeDefined();
					++count;
				});
			});

			expect(count).toEqual(expectedTileCount);
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
});

