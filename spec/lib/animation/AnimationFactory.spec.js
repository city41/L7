describe('AnimationFactory', function() {
	var daemons = [];
	var board = {
		addDaemon: function(daemon) {
			daemons.push(daemon);
		}
	};
	var aniFactory;

	beforeEach(function() {
		daemons = [];
		aniFactory = new L7.AnimationFactory(board, board);
	});

	it('should pass an array of targets on', function() {
		var targets = [1, 2, 3];

		aniFactory.tween({
			targets: targets
		});

		expect(daemons[0].targets).toEqual(targets);
	});

	it('should convert targets to an array if needed', function() {
		var target = {};

		aniFactory.tween({
			targets: target
		});

		expect(daemons[0].targets[0]).toBe(target);
	});
});
