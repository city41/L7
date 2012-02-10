describe('Repeat', function() {
	var children, repeat;

	beforeEach(function() {
		children = [{
			update: function() {
				this.done = true;
				this.update.called = this.update.called || 0;
				this.update.called++;
			},
			reset: function() {}
		},{
			update: function() {
				this.done = true;
				this.update.called = this.update.called || 0;
				this.update.called++;
			},
			reset: function() {}
		}];

		repeat = new L7.Repeat(2);
		repeat.children = children;
	});

	it('should update the children in sequence', function() {
		children.forEach(function(c) {
			spyOn(c, 'reset');
		});

		repeat.update();

		expect(children[0].update.called).toBe(1);
		expect(children[1].update.called).toBe(undefined);

		delete children[0].update.called;
	
		repeat.update();

		expect(children[0].update.called).toBe(undefined);
		expect(children[1].update.called).toBe(1);

		children.forEach(function(c) {
			expect(c.reset).toHaveBeenCalled();
		});
	});

	it('should repeat the cycle', function() {
		repeat.update();

		expect(children[0].update.called).toBe(1);
		expect(children[1].update.called).toBe(undefined);
	
		repeat.update();

		expect(children[0].update.called).toBe(1);
		expect(children[1].update.called).toBe(1);

		repeat.update();

		expect(children[0].update.called).toBe(2);
		expect(children[1].update.called).toBe(1);

		repeat.update();

		expect(children[0].update.called).toBe(2);
		expect(children[1].update.called).toBe(2);
	});
});


