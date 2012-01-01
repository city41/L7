describe("Actor", function() {
	describe("construction", function() {
		
		it("should apply everything to itself", function() {
			var foo = '123';
			var bar = function() {};
			var baz = {
				a: 1
			};

			var a = new L7.Actor({
				foo: foo,
				bar: bar,
				baz: baz
			});

			expect(a.foo).toEqual(foo);
			expect(a.bar).toEqual(bar);
			expect(a.baz).toEqual(baz);
		});

		it("should have reasonable defaults", function() {
			var a = new L7.Actor();

			expect(a.position.x).toEqual(0);
			expect(a.position.y).toEqual(0);
			expect(a.sprite).toBeDefined();
			expect(a.sprite.length > 0).toBe(true);
			expect(a.shape[0][0]).toEqual(L7.Actor.ANCHOR);
		});
	});
});
