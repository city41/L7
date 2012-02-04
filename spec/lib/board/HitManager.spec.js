describe('HitManager', function() {
	var hitManager;

	beforeEach(function() {
		hitManager = new L7.HitManager();
	});

	describe('detectHits', function() {
		it('should skip an inhabitant if its hit detection is not enabled', function() {
			var inhab1 = new L7.Actor({
				team: 'foo',
				hitDetection: {
					enabled: function() {
						return false;
					},
					bar: function() {}
				}
			});

			var inhab2 = new L7.Actor({
				team: 'bar'
			});

			var board = new L7.Board({
				width: 1,
				height: 1
			});

			board.addActor(inhab1);
			board.addActor(inhab2);

			spyOn(inhab1.hitDetection, 'bar');

			hitManager.detectHits(board.tiles);

			expect(inhab1.hitDetection.bar).not.toHaveBeenCalled();
		});

		it('should call an inhabitant if its hit detection is enabled', function() {
			var inhab1 = new L7.Actor({
				team: 'foo',
				hitDetection: {
					enabled: function() {
						return true;
					},
					bar: function() {}
				}
			});

			var inhab2 = new L7.Actor({
				team: 'bar'
			});

			var board = new L7.Board({
				width: 1,
				height: 1
			});

			board.addActor(inhab1);
			board.addActor(inhab2);

			spyOn(inhab1.hitDetection, 'bar');

			hitManager.detectHits(board.tiles);

			expect(inhab1.hitDetection.bar).toHaveBeenCalled();
		});

		it('should not have inhabitants hit themselves', function() {
			var inhab1 = new L7.Actor({
				team: 'foo',
				hitDetection: {
					enabled: function() {
						return true;
					},
					foo: function() {}
				}
			});

			var board = new L7.Board({
				width: 1,
				height: 1
			});

			board.addActor(inhab1);

			spyOn(inhab1.hitDetection, 'foo');

			hitManager.detectHits(board.tiles);

			expect(inhab1.hitDetection.foo).not.toHaveBeenCalled();
		});

		it('should have inhabitants hit each other', function() {
			var inhab1 = new L7.Actor({
				team: 'foo',
				hitDetection: {
					enabled: function() {
						return true;
					},
					bar: function() {}
				}
			});

			var inhab2 = new L7.Actor({
				team: 'bar',
				hitDetection: {
					enabled: function() {
						return true;
					},
					foo: function() {}
				}
			});

			var board = new L7.Board({
				width: 1,
				height: 1
			});

			board.addActor(inhab1);
			board.addActor(inhab2);

			spyOn(inhab1.hitDetection, 'bar');
			spyOn(inhab2.hitDetection, 'foo');

			hitManager.detectHits(board.tiles);

			expect(inhab1.hitDetection.bar).toHaveBeenCalled();
			expect(inhab2.hitDetection.foo).toHaveBeenCalled();
		});

		it('should have an inhabitant hit a tagged tile', function() {
			var inhab1 = new L7.Actor({
				team: 'foo',
				hitDetection: {
					enabled: function() {
						return true;
					},
					buzz: function() {}
				}
			});

			var board = new L7.Board({
				width: 1,
				height: 1
			});

			board.addActor(inhab1);

			spyOn(inhab1.hitDetection, 'buzz');

			board.tiles.first.tag = 'buzz';

			hitManager.detectHits(board.tiles);

			expect(inhab1.hitDetection.buzz).toHaveBeenCalled();
		});
	});
});

