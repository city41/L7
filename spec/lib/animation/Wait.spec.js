describe('Wait', function() {
	it('should say its not done if not enough time has elapsed', function() {
		var duration = 2000;

		var wait = new L7.Wait({
			duration: duration
		});

		expect(wait.done).toBe(false);

		wait.update(100);
		expect(wait.done).toBe(false);

		wait.update(100);
		expect(wait.done).toBe(false);

		wait.update(100);
		expect(wait.done).toBe(false);
	});

	it('should say its done once enough time has elapsed', function() {
		var duration = 2000;

		var wait = new L7.Wait({
			duration: duration
		});

		expect(wait.done).toBe(false);

		wait.update(100);
		expect(wait.done).toBe(false);

		wait.update(100);
		expect(wait.done).toBe(false);

		wait.update(2000);
		expect(wait.done).toBe(true);
	});

	it('should support a min and max instead of duration', function() {
		var min = 1000;
		var max = 2000;

		spyOn(L7, 'rand');

		var wait = new L7.Wait({
			min: min,
			max: max
		});

		expect(L7.rand).toHaveBeenCalled();
	});
});


