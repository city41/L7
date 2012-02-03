describe('Storage', function() {
	it('should store a value', function() {
		var value = 123;
		sg.Storage.set('foo', value);

		expect(sg.Storage.get('foo')).toEqual(value);

		var value2 = {
			foo: 'bar'
		};

		sg.Storage.set('foo2', value2);
		expect(sg.Storage.get('foo2').foo).toEqual(value2.foo);

		// a string that could be a number too
		var value3 = "456";
		sg.Storage.set('foo3', value3);
		expect(sg.Storage.get('foo3')).toEqual(value3);
	});

	it('should return undefined if no value is present', function() {
			expect(sg.Storage.get('dontexist')).not.toBeDefined();
	});

	it('should indicate if a value exists', function() {
		sg.Storage.set('foo', 123);
		expect(sg.Storage.present('foo')).toBe(true);

		expect(sg.Storage.present('notthereisit')).toBe(false);
	});
});
