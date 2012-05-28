describe("Piece", function() {
	describe("construction", function() {
		it("should apply everything in its config", function() {
			var config = {
				a: 'a',
				b: 1, 
				c: function() {}
			};

			var piece = new L7.Piece(config);

			expect(piece.a).toEqual(config.a);
			expect(piece.b).toEqual(config.b);
			expect(piece.c).toEqual(config.c);
		});
	});

	describe("properties", function() {
		it("should report its position correctly", function() {
			var ownerPosition = L7.p(2,5);
			var owner = {
				position: ownePosition
			});

			var pieceDelta = L7.p(-1, 4);

			var piece = new L7.Piece({
				owner: owner
			});

			expect(piece.position).toEqual(ownerPosition.add(pieceDelta));
		});

});
