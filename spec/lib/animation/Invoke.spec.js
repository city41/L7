describe("Invoke", function() {
	it('should invoke the provided function', function() {
		var obj = {
			func: function() {}
		};

		spyOn(obj, 'func');

		var invoke = new L7.Invoke({
			func: obj.func
		});

		invoke.update();

		expect(obj.func).toHaveBeenCalled()
		expect(invoke.done).toBe(true);
	});

	it('should reset', function() {
		var invoke = new L7.Invoke({
			func: function() {}
		});

		invoke.done = true;

		invoke.reset();

		expect(invoke.done).toBe(false);
	});
});


