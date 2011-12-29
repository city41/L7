describe("Row", function() {
	describe("construction", function() {
		it("should throw if no y is provided", function() {
			var noY = function() {
				new L7.Row(undefined, 1);
			};

			expect(noY).toThrow();
		});

		it("should create as many tiles as tileCount", function() {
			var y = 3;
			var tileCount = 4;

			var row = new L7.Row(y, tileCount);

			expect(row.tiles).toBeDefined();
			expect(row.tiles.length).toEqual(tileCount);
			
			row.tiles.forEach(function(tile) {
				expect(tile.y).toEqual(y);
			});
		});
	});

	describe("traversal", function() {
		it("should return tiles with at", function() {
			var row = new L7.Row(3, 4);

			var tile = row.at(2);

			expect(tile).toBeDefined();
			expect(tile.x).toEqual(2);

			tile = row.at(55);
			expect(tile).toBeUndefined();
		});

		it("should iterate the tiles with each", function() {
			var row = new L7.Row(3, 5);

			var x = 0;
			row.each(function(tile) {
				expect(tile.x).toEqual(x);
				x += 1;
			});
		});
	});

});

