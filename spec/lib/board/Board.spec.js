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

			for (var i = 0; i < height; ++i) {
				for (var k = 0; k < width; ++k) {
					var tile = board.tileAt(L7.p(i, k));
					expect(tile).toBeDefined();
				}
			}

			expect(board.tileAt(L7.p(5, 6))).toBeFalsy();

			expect(board.tiles.length).toEqual(width * height);
		});

		it("should not create a canvas", function() {
			var tileSize = 4;
			var borderWidth = 2;
			var board = new L7.Board({
				width: 3,
				height: 3,
				tileSize: tileSize,
				borderWidth: borderWidth
			});

			expect(board.canvas).toBeFalsy();
		});

		it('should report its pixel height and width', function() {
			var tileSize = 4;
			var borderWidth = 2;
			var board = new L7.Board({
				width: 3,
				height: 7,
				tileSize: tileSize,
				borderWidth: borderWidth
			});

			expect(board.pixelHeight).toBe(board.height * (tileSize + borderWidth) + borderWidth);
			expect(board.pixelWidth).toBe(board.width * (tileSize + borderWidth) + borderWidth);
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

	describe('tile pixel queries', function() {
		it('should return a tile with tileAtPixels', function() {
			var board = new L7.Board({
				width: 4,
				height: 4,
				tileSize: 9,
				borderWidth: 1
			});

			var tile = board.tileAtPixels(7, 6);
			expect(tile.position.x).toEqual(0);
			expect(tile.position.y).toEqual(0);

			var tile2 = board.tileAtPixels(0, 0);
			expect(tile2.position.x).toEqual(0);
			expect(tile2.position.y).toEqual(0);

			var tile3 = board.tileAtPixels(9, 9);
			expect(tile3.position.x).toEqual(0);
			expect(tile3.position.y).toEqual(0);

			var tile4 = board.tileAtPixels(10, 10);
			expect(tile4.position.x).toEqual(1);
			expect(tile4.position.y).toEqual(1);

			var tile5 = board.tileAtPixels(32, 12);
			expect(tile5.position.x).toEqual(3);
			expect(tile5.position.y).toEqual(1);
		});

		it("should return pixels with pixelsForTile", function() {
			var board = new L7.Board({
				width: 2,
				height: 2,
				tileSize: 9,
				borderWidth: 1
			});

			var tile = board.tileAt(1, 1);

			var pixels = board.pixelsForTile(tile);

			expect(pixels.x).toEqual(10);
			expect(pixels.y).toEqual(10);
		});

		it("should return the tile's top in pixels", function() {
			var board = new L7.Board({
				width: 2,
				height: 3,
				tileSize: 10,
				borderWidth: 2
			});

			var tileY = 1;
			var tile = board.tileAt(1, tileY);

			var tileTopInPixels = board.tileTopInPixels(tile);

			expect(tileTopInPixels).toEqual(tileY * (board.tileSize + board.borderWidth));
		});

		it("should return the tile's bottom in pixels", function() {
			var board = new L7.Board({
				width: 2,
				height: 3,
				tileSize: 10,
				borderWidth: 2
			});

			var tileY = 1;
			var tile = board.tileAt(1, tileY);

			var tileBottomInPixels = board.tileBottomInPixels(tile);

			expect(tileBottomInPixels).toEqual(tileY * (board.tileSize + board.borderWidth) + board.tileSize);
		});

	});

	describe("tile queries", function() {
		it('should return the column', function() {
			var board = new L7.Board({
				width: 3,
				height: 3
			});

			var x = 1;
			var column = board.column(x);

			column.forEach(function(tile, y) {
				expect(tile.position.x).toEqual(x);
				expect(tile.position.y).toEqual(y);
			});
		});

		it('should return a column using negative indexing', function() {
			var board = new L7.Board({
				width: 3,
				height: 3
			});

			var x = - 1;
			var column = board.column(x);

			column.forEach(function(tile, y) {
				expect(tile.position.x).toEqual(2);
				expect(tile.position.y).toEqual(y);
			});
		});

		it('should return the row', function() {
			var board = new L7.Board({
				width: 3,
				height: 3
			});

			var y = 1;
			var row = board.row(y);

			row.forEach(function(tile, x) {
				expect(tile.position.x).toEqual(x);
				expect(tile.position.y).toEqual(y);
			});
		});

		it('should return a row using negative indexing', function() {
			var board = new L7.Board({
				width: 3,
				height: 3
			});

			var y = - 1;
			var row = board.row(y);

			row.forEach(function(tile, x) {
				expect(tile.position.x).toEqual(x);
				expect(tile.position.y).toEqual(2);
			});
		});

		it('should return all the rows', function() {
			var board = new L7.Board({
				width: 3,
				height: 3
			});

			var y = 1;
			var y2 = 2;
			var row = board.row(y, y2);

			expect(row.length).toBe(6);

			row.forEach(function(tile) {
				expect(tile.position.y === y || tile.position.y === y2).toBe(true);
			});
		});

		it('should return the queried rect', function() {
			var board = new L7.Board({
				width: 4,
				height: 4
			});

			var tiles = board.rect(1, 1, 2, 2);

			expect(tiles.length).toEqual(4);
			expect(tiles.indexOf(board.tileAt(1, 1)) > - 1).toBe(true);
			expect(tiles.indexOf(board.tileAt(1, 2)) > - 1).toBe(true);
			expect(tiles.indexOf(board.tileAt(2, 2)) > - 1).toBe(true);
			expect(tiles.indexOf(board.tileAt(2, 1)) > - 1).toBe(true);
		});

		it('should return tiles based on the predicate', function() {
			var board = new L7.Board({
				width: 3,
				height: 3
			});

			var actor = new L7.Actor({
				team: 'foo',
				position: L7.p(1, 1)
			});

			board.addActor(actor);

			var tiles = board.query(function(tile) {
				return tile.has('foo');
			});

			expect(tiles.length).toBe(1);
			expect(tiles.first.position.x).toEqual(actor.position.x);
			expect(tiles.first.position.y).toEqual(actor.position.y);
			expect(tiles.first.inhabitants.length).toBe(1);
		});
	});

	describe("actor operations", function() {
		it("should indicate if an actor is out of bounds", function() {
			var board = new L7.Board({
				width: 3,
				height: 3
			});

			var actor = {
				pieces: [{
					position: L7.p(0, 0)
				},
				{
					position: L7.p(1, 2)
				},
				{
					position: L7.p(4, 2)
				}]
			};

			expect(board.isOutOfBounds(actor)).toBe(true);

			var actor2 = {
				pieces: [{
					position: L7.p(0, 0)
				},
				{
					position: L7.p(1, 1)
				},
				{
					position: L7.p(2, 2)
				}]
			};

			expect(board.isOutOfBounds(actor2)).toBe(false);
		});

		it("should add an actor", function() {
			var board = new L7.Board({
				width: 2,
				height: 2
			});

			var actor = {
				pieces: [{
					position: L7.p(1, 1)
				},
				{
					position: L7.p(0, 0)
				}]
			};

			board.addActor(actor);

			expect(board.actors.length).toBe(1);

			actor.pieces.forEach(function(piece) {
				var tile = board.tileAt(piece.position);
				expect(tile.inhabitants.indexOf(piece) > - 1).toBe(true);
			});

			expect(actor.board).toEqual(board);
		});

		it('should remove an actor', function() {
			var board = new L7.Board({
				width: 2,
				height: 2
			});

			var actor = {
				pieces: [{
					position: L7.p(1, 1)
				},
				{
					position: L7.p(0, 0)
				}]
			};

			board.addActor(actor);

			expect(board.actors.length).toBe(1);

			actor.pieces.forEach(function(piece) {
				var tile = board.tileAt(piece.position);
				expect(tile.inhabitants.indexOf(piece) > - 1).toBe(true);
			});

			expect(actor.board).toEqual(board);

			board.removeActor(actor);

			expect(board.actors.length).toBe(0);

			actor.pieces.forEach(function(piece) {
				var tile = board.tileAt(piece.position);
				expect(tile.inhabitants.indexOf(piece) < 0).toBe(true);
			});
		});

		it('should add a free actor', function() {
			var board = new L7.Board({
				width: 2,
				height: 2
			});

			var actor = {};

			board.addFreeActor(actor);

			expect(board.freeActors.length).toBe(1);

			expect(actor.board).toEqual(board);
		});

		it("should remove a free actor", function() {
			var board = new L7.Board({
				width: 2,
				height: 2
			});

			var actor = {};
			board.addFreeActor(actor);

			expect(board.freeActors.length).toBe(1);

			expect(actor.board).toEqual(board);

			board.removeFreeActor(actor);
			expect(board.freeActors.length).toBe(0);
			expect(actor.board).not.toBeDefined();
		});

		it("should move an actor", function() {
			var board = new L7.Board({
				width: 3,
				height: 3
			});

			var actor = new L7.Actor({
				position: L7.p(1,1),
				shape: [[5]]
			});

			board.addActor(actor);

			expect(board.tileAt(1,1).inhabitants[0]).toEqual(actor.pieces[0]);

			board.moveActor({
				actor: actor,
				delta: L7.p(1, 1)
			});

			expect(board.tileAt(2,2).inhabitants[0]).toEqual(actor.pieces[0]);
		});

		it("should invoke onOutOfBounds if it went out of bounds", function() {
			var a = new L7.Actor({
				onOutOfBounds: function() {}
			});

			spyOn(a, 'onOutOfBounds');

			var board = new L7.Board({
				width: 1,
				height: 1
			});

			board.moveActor({
				actor: a,
				from: L7.p(1, 1),
				to: L7.p(10, 10)
			});

			expect(a.onOutOfBounds).toHaveBeenCalled();
		});
	});

	describe('updating', function() {
		it("should have each actor update", function() {
			var actors = [new L7.Actor(), new L7.Actor(), new L7.Actor()];
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

		it("should have each free actor update", function() {
			var actors = [new L7.Actor(), new L7.Actor(), new L7.Actor()];
			var board = new L7.Board({
				width: 3,
				height: 3
			});

			actors.forEach(function(actor) {
				spyOn(actor, 'update');
				board.addFreeActor(actor);
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
				height: 2,
				tileSize: 2
			});

			board.tiles.forEach(function(tile) {
				spyOn(tile, 'getColor');
			});

			var canvas = document.createElement('canvas');
			canvas.width = 200;
			canvas.height = 200;

			var context = canvas.getContext('2d');
			board.render(0, context, 0, 0, 0);

			board.tiles.forEach(function(tile) {
				expect(tile.getColor).toHaveBeenCalled();
			});
		});

		it('should ask each colored tile for its scale', function() {
			var board = new L7.Board({
				width: 2,
				height: 2,
				tileSize: 2
			});

			board.tiles.forEach(function(tile) {
				tile.color = [255, 255, 255, 1];
				spyOn(tile, 'getScale');
			});

			var canvas = document.createElement('canvas');
			canvas.width = 200;
			canvas.height = 200;

			var context = canvas.getContext('2d');
			board.render(0, context, 0, 0, 0);

			board.tiles.forEach(function(tile) {
				expect(tile.getScale).toHaveBeenCalled();
			});
		});

		it('should ask each free actor for its color and position', function() {
			var board = new L7.Board({
				width: 2,
				height: 2,
				tileSize: 2
			});

			var colorAskedFor = false;
			var positionAskedFor = false;

			var actor = {

			};
			Object.defineProperty(actor, 'color', {
				get: function() {
					colorAskedFor = true;
					return [255, 0, 0, 1];
				}
			});
			Object.defineProperty(actor, 'position', {
				get: function() {
					positionAskedFor = true;
					return L7.p(1, 1);
				}
			});

			board.addFreeActor(actor);

			var canvas = document.createElement('canvas');
			canvas.width = 200;
			canvas.height = 200;

			var context = canvas.getContext('2d');
			board.render(0, context, 0, 0, 0);

			expect(colorAskedFor).toBe(true);
			expect(positionAskedFor).toBe(true);
		});
	});

	describe('scrolling', function() {
		it('should scroll in the y direction', function() {
			var board = new L7.Board({
				width: 2,
				height: 2,
				tileSize: 10,
				borderWidth: 1
			});

			var viewport = {
				scrollY: function(amount) {}
			};

			spyOn(viewport, 'scrollY');
			board.viewport = viewport;

			board.scrollY(1);

			expect(viewport.scrollY).toHaveBeenCalledWith(11);
		});

		it('should scroll in the x direction', function() {
			var board = new L7.Board({
				width: 2,
				height: 2,
				tileSize: 10,
				borderWidth: 1
			});

			var viewport = {
				scrollX: function(amount) {}
			};

			spyOn(viewport, 'scrollX');
			board.viewport = viewport;

			board.scrollX(1);

			expect(viewport.scrollX).toHaveBeenCalledWith(11);
		});

	});
});

