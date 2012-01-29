describe("Array", function() {
	describe("added functions", function() {
		describe("last", function() {
			it("should return the last item", function() {
				var a = [1, 2, 3, 4];

				var last = a.last;

				expect(last).toBe(4);
			});
			it("should return undefined if there is no last item", function() {
				var a = [];

				expect(a.last).not.toBeDefined();
			});
		});
		describe("first", function() {
			it("should return the first item", function() {
				var a = [1,2,3];
				expect(a.first).toBe(1);
			});
			it("should return undefined if there is no first item", function() {
				var a = [];
				expect(a.first).not.toBeDefined();
			});
		});
		describe("remove", function() {
			it("should remove an item", function() {

				var a = [1, 2, 3, 4];

				a.remove(3);

				expect(a[0]).toBe(1);
				expect(a[1]).toBe(2);
				expect(a[2]).toBe(4);
				expect(a.length).toBe(3);
			});
			it("should return the array", function() {
				var a = [1, 2, 3];
				var ret = a.remove(4);

				expect(ret).toBe(a);
			});
		});
		describe("add", function() {
			it("should add an item", function() {
				var a = [1, 2, 4, 5];
				a.add(7);

				expect(a[a.length - 1]).toEqual(7);
				expect(a.length).toEqual(5);
			});
			it("should return the array", function() {
				var a = [1, 2, 3];
				var ret = a.add(6);

				expect(ret).toBe(a);
			});
		});
	});
});

