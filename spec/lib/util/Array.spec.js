describe("Array", function() {
	describe("added functions", function() {
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
	});
});

