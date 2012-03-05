describe('Bootstrapper', function() {
	it('should only allow useWebGL to be set once', function() {
		var fn = function() {
			L7.useWebGL = true;
		};

		expect(fn).not.toThrow();
		expect(fn).toThrow();
	});
});

