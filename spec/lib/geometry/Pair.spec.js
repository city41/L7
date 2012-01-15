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

	describe("immutability", function() {
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

	describe("traversal", function() {
		it("should go up", function() {
			var pair = L7.p(1,2);
			var up = pair.up();

			expect(up.x).toEqual(pair.x);
			expect(up.y).toEqual(pair.y - 1);
			expect(up).not.toEqual(pair);
		});
		it("should go right", function() {
			var pair = L7.p(1,2);
			var right = pair.right();

			expect(right.x).toEqual(pair.x + 1);
			expect(right.y).toEqual(pair.y);
			expect(right).not.toEqual(pair);
		});
		it("should go left", function() {
			var pair = L7.p(1,2);
			var left = pair.left();

			expect(left.x).toEqual(pair.x - 1);
			expect(left.y).toEqual(pair.y);
			expect(left).not.toEqual(pair);
		});
		it("should go down", function() {
			var pair = L7.p(1,2);
			var down = pair.down();

			expect(down.x).toEqual(pair.x);
			expect(down.y).toEqual(pair.y + 1);
			expect(down).not.toEqual(pair);
		});
		
	});

	describe("operations", function() {
		it("should clone", function() {
			var p1 = L7.p(3, 4);
			var p2 = p1.clone();

			expect(p2.x).toEqual(p1.x);
			expect(p2.y).toEqual(p1.y);
			expect(p1 === p2).toBe(false);
		});

		it("should add", function() {
			var p = L7.p(3, 4);
			var p2 = L7.p(5, 6);
			var p3 = p.add(p2);

			expect(p3.x).toEqual(p.x + p2.x);
			expect(p3.y).toEqual(p.y + p2.y);

			var x = 4;
			var y = 6;
			var p4 = p.add(x, y);

			expect(p4.x).toEqual(p.x + x);
			expect(p4.y).toEqual(p.y + y);
		});

		it("should add when the other pair has a zero", function() {
			var p = L7.p(2, 3);
			var p2 = L7.p(0, 4);

			var p3 = p.add(p2);

			expect(p3.x).toEqual(2);
			expect(p3.y).toEqual(7);
		});

		it("should subtract", function() {
			var p = L7.p(3, 4);
			var p2 = L7.p(5, 6);
			var p3 = p.subtract(p2);

			expect(p3.x).toEqual(p.x - p2.x);
			expect(p3.y).toEqual(p.y - p2.y);

			var x = 4;
			var y = 6;
			var p4 = p.subtract(x, y);

			expect(p4.x).toEqual(p.x - x);
			expect(p4.y).toEqual(p.y - y);

			var p5 = p.delta(p3);

			expect(p5.x).toEqual(p.x - p3.x);
			expect(p5.y).toEqual(p.y - p3.y);
		});

		it("should subtract when the other pair has a zero", function() {
			var p = L7.p(3, 4);
			var p2 = L7.p(5, 0);
			var p3 = p.subtract(p2);

			expect(p3.x).toEqual(p.x - p2.x);
			expect(p3.y).toEqual(p.y - p2.y);
		});

		it('should negate', function() {
			var p = L7.p(3, 0);
			var n = p.negate();

			expect(n.x).toEqual(-p.x);
			expect(n.y).toEqual(-p.y);
		});
		it('should multiply', function() {
			var p = L7.p(3, 4);
			var scale = 3;
			var s = p.multiply(scale);

			expect(s.x).toEqual(p.x * scale);
			expect(s.y).toEqual(p.y * scale);
		});

		it('should dot', function() {
			var p = L7.p(0, 4);
			var p2 = L7.p(8, 12);

			var dot = p.dot(p2);

			expect(dot).toEqual(p.x * p2.x + p.y * p2.y);
		});

		it('should return the distanceFrom', function() {
			var p = L7.p(5, 5);
			var p2 = L7.p(5, 10);

			var actualDistance = p.distanceFrom(p2);

			expect(actualDistance).toBe(5);

			var otherWay = p2.distanceFrom(p);

			expect(otherWay).toBe(5);

			// more complex example, classic 3,4,5 triangle
			var p3 = L7.p(1, 1);
			var p4 = L7.p(4, 5);

			expect(p3.distanceFrom(p4)).toBe(5);
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


