describe('Tween', function() {
	var obj, tween;

	beforeEach(function() {
		obj = {
			foo: 12
		};

		tween = new L7.Tween({
			targets: [obj],
			property: 'foo',
			from: 1,
			to: 10,
			duration: 1000
		});
	});

	it('should set the property to the from value and not be done', function() {
		tween.update(0);
		expect(obj.foo).toEqual(tween.from);
		expect(tween.done).toBe(false);
	});

	it('should set the property to the to value after the duration has elapsed and be done', function() {
		tween.update(tween.duration + 10);
		expect(obj.foo).toEqual(tween.to);
		expect(tween.done).toBe(true);
	});

	it('should use the specified easing function', function() {
		var easedValue = 12;
		var easingFunc = 'testEasingFunc';
		L7.Easing[easingFunc] = function() { return easedValue; };

		var tween = new L7.Tween({
			targets: [obj],
			property: 'foo',
			easing: easingFunc,
			from: 1,
			to: 10,
			duration: 2000
		});

		tween.update(100);

		expect(obj.foo).toEqual(easedValue);
	});

	it('should tween all targets', function() {
		var objCount = 3;
		var objs = [];
		for(var i = 0; i < objCount; ++i) {
			objs.push({});
		}

		var fromValue = 23;
		var tween = new L7.Tween({
			targets: objs,
			property: 'foo',
			from: fromValue,
			to: 2000,
			duration: 1000
		});

		tween.update(0);

		objs.forEach(function(obj) {
			expect(obj.foo).toEqual(fromValue);
		});
	});
});


