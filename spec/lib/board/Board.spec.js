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

			var x = -1;
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

			var y = -1;
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
			var y2 =2;
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
			expect(tiles.indexOf(board.tileAt(1, 1)) > -1).toBe(true);
			expect(tiles.indexOf(board.tileAt(1, 2)) > -1).toBe(true);
			expect(tiles.indexOf(board.tileAt(2, 2)) > -1).toBe(true);
			expect(tiles.indexOf(board.tileAt(2, 1)) > -1).toBe(true);
		});

		it('should return tiles based on the predicate', function() {
			var board = new L7.Board({
				width: 3,
				height: 3
			});

			var actor = new L7.Actor({
				team: 'foo',
				position: L7.p(1,1)
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
				expect(tile.inhabitants.indexOf(piece) > -1).toBe(true);
			});

			expect(actor.board).toEqual(board);

			board.removeActor(actor);

			expect(board.actors.length).toBe(0);

			actor.pieces.forEach(function(piece) {
				var tile = board.tileAt(piece.position);
				expect(tile.inhabitants.indexOf(piece) < 0).toBe(true);
			});

			expect(actor.board).toBeFalsy();
		});

		it("should move an actor", function() {
			var board = new L7.Board({
				width: 3,
				height: 3
			});

			var actor = {
				pieces: [{
					position: L7.p(1, 1)
				}]
			};

			board.moveActor({
				actor: actor,
				delta: L7.p(1, 1)
			});

			expect(actor.pieces[0].position.x).toEqual(2);
			expect(actor.pieces[0].position.y).toEqual(2);
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
	});

	describe('rendering', function() {
		it('should render the border fill', function() {
			var borderFill = '#ff0000';
			var board = new L7.Board({
				width: 1,
				height: 1,
				tileSize: 1,
				borderWidth: 1,
				borderFill: borderFill
			});

			var canvas = document.createElement('canvas');
			var context = canvas.getContext('2d');

			spyOn(context, 'fillRect');

			board.render(0, context, 0, 0, 0);

			expect(context.fillRect).toHaveBeenCalled();

			expect(context.fillStyle).toEqual(borderFill);
		});

		it('should clear rect if the border has no color', function() {
			var board = new L7.Board({
				width: 1,
				height: 1,
				tileSize: 1,
				borderWidth: 1
			});

			var canvas = document.createElement('canvas');
			var context = canvas.getContext('2d');

			spyOn(context, 'fillRect');
			spyOn(context, 'clearRect');

			board.render(0, context, 0, 0, 0);
			expect(context.fillRect).not.toHaveBeenCalled();
			expect(context.clearRect).toHaveBeenCalled();

		});
		
		it('should ask each tile for its color', function() {
			var board = new L7.Board({
				width: 2,
				height: 2
			});

			board.tiles.forEach(function(tile) {
				spyOn(tile, 'getColor');
			});

			var canvas = document.createElement('canvas');
			var context = canvas.getContext('2d');
			board.render(0, context, 0, 0, 0);

			board.tiles.forEach(function(tile) {
				expect(tile.getColor).toHaveBeenCalled();
			});
		});

		it('should ask each tile for its scale', function() {
			var board = new L7.Board({
				width: 2,
				height: 2
			});

			board.tiles.forEach(function(tile) {
				spyOn(tile, 'getScale');
			});

			var canvas = document.createElement('canvas');
			var context = canvas.getContext('2d');
			board.render(0, context, 0, 0, 0);

			board.tiles.forEach(function(tile) {
				expect(tile.getScale).toHaveBeenCalled();
			});
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

