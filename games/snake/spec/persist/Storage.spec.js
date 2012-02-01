describe('Storage', function() {
	it('should store a value', function() {
		var value = 123;
		snake.Storage.set('foo', value);

		expect(snake.Storage.get('foo')).toEqual(value);

		var value2 = {
			foo: 'bar'
		};

		snake.Storage.set('foo2', value2);
		expect(snake.Storage.get('foo2').foo).toEqual(value2.foo);

		// a string that could be a number too
		var value3 = "456";
		snake.Storage.set('foo3', value3);
		expect(snake.Storage.get('foo3')).toEqual(value3);
	});

	it('should return undefined if no value is present', function() {
			expect(snake.Storage.get('dontexist')).not.toBeDefined();
	});

	it('should indicate if a value exists', function() {
		snake.Storage.set('foo', 123);
		expect(snake.Storage.present('foo')).toBe(true);

		expect(snake.Storage.present('notthereisit')).toBe(false);
	});
});
