describe("Pair", function() {

	describe("construction", function() {
		it("should default to 0x0", function() {
			var pair = new L7.Pair();
			expect(pair.width).toEqual(0);
			expect(pair.height).toEqual(0);
			expect(pair.x).toEqual(0);
			expect(pair.y).toEqual(0);
		});

		it("should set itself to the constructor args", function() {
			var w = 7;
			var h = 12;

			var pair = new L7.Pair(w,h);
			expect(pair.width).toEqual(w);
			expect(pair.height).toEqual(h);
			expect(pair.x).toEqual(w);
			expect(pair.y).toEqual(h);
		});
	});

	describe("mutability", function() {
		it("should be immutable", function() {
			var w = 7, h = 12, pair = new L7.Pair(w,h);
			pair.width = 44;
			pair.height = 1222;

			expect(pair.width).toEqual(w);
			expect(pair.height).toEqual(h);
		});
	});

	describe("equals", function() {
		it("should be equal to itself", function() {
			var pair = new L7.Pair(3, 4);

			expect(pair.equals(pair)).toEqual(true);
		});

		it("should equal another pair with the same points", function() {
			var pair1 = new L7.Pair(3,5);
			var pair2 = new L7.Pair(3,5);

			expect(pair1.equals(pair2)).toEqual(true);
		});

		it("should not be equal to another pair with different points", function() {
			var pair1 = new L7.Pair(3,5);
			var pair2 = new L7.Pair(4,9);

			expect(pair1.equals(pair2)).toEqual(false);
		});

		it("should not be equal to null", function() {
			var pair1 = new L7.Pair(3,4);

			expect(pair1.equals(null)).toEqual(false);
		});

		it("should not be equal to undefined", function() {
			var pair1 = new L7.Pair(3,4);

			expect(pair1.equals(undefined)).toEqual(false);
		});

		it("should be equal to an equivalent point object", function() {
			var pair1 = new L7.Pair(3,4);

			expect(pair1.equals({ x: 3, y: 4})).toEqual(true);
		});

		it("should be equal to an equivalent size object", function() {
			var pair1 = new L7.Pair(3,4);

			expect(pair1.equals({ width: 3, height: 4})).toEqual(true);
		});
	});

	describe("utility functions", function() {
		it("L7.s should create a pair object", function() {
			var w = 44;
			var h = 22;
			var pair = L7.s(w, h);
			expect(pair.width).toEqual(w);
			expect(pair.height).toEqual(h);
			expect(typeof pair).toEqual('object');
		});
		it("L7.p should create a pair object", function() {
			var w = 44;
			var h = 22;
			var pair = L7.p(w, h);
			expect(pair.width).toEqual(w);
			expect(pair.height).toEqual(h);
			expect(typeof pair).toEqual('object');
		});

		it("L7.sr should create a rounded pair object", function() {
			var w = 12.3;
			var h = 13.8;
			var pair = L7.sr(w, h);

			expect(pair.width).toEqual(Math.round(w));
			expect(pair.height).toEqual(Math.round(h));
		});
		it("L7.pr should create a rounded pair object", function() {
			var w = 12.3;
			var h = 13.8;
			var pair = L7.pr(w, h);

			expect(pair.width).toEqual(Math.round(w));
			expect(pair.height).toEqual(Math.round(h));
		});
	});
});


