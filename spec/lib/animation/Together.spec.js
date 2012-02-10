describe('Together', function() {
	var children, together;

	beforeEach(function() {
		children = [{
			reset: function() {},
			update: function() {}
		},
		{
			reset: function() {},
			update: function() {}
		},
		{
			reset: function() {},
			update: function() {}
		}];

		together = new L7.Together({
		});
		together.children = children;
	});

	it('should reset all its children', function() {
		children.forEach(function(c) {
			spyOn(c, 'reset');
		});

		together.reset();

		children.forEach(function(c) {
			expect(c.reset).toHaveBeenCalled();
		});
	});

	it('should update all its children', function() {
		children.forEach(function(c) {
			spyOn(c, 'update');
		});

		together.update();

		children.forEach(function(c) {
			expect(c.update).toHaveBeenCalled();
		});
	});

	it('should report its done if all its children are done', function() {
		children.forEach(function(c) {
			c.done = true;
		});

		together.update();
		
		expect(together.done).toBe(true);
	});

	it('should not report its done if all its children are not done', function() {
		children.forEach(function(c) {
			c.done = true;
		});

		children[1].done = false;

		together.update();
		
		expect(together.done).toBe(false);
	});

});

