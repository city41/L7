describe('Bootstrapper', function() {
	it('should only allow useWebGL to be set once', function() {
		var fn = function() {
			// want to stick with canvas for the specs
			L7.useWebGL = false;
		};

		expect(fn).not.toThrow();
		expect(fn).toThrow();
	});
});

