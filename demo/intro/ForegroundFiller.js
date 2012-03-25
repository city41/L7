i.ForegroundFiller = {
	fill: function(board) {
		i.FillerUtil.addWater(board, L7.p(1, 1), 3, 8);
		i.FillerUtil.addWater(board, L7.p(61, 4), 2, 7);
		i.FillerUtil.addWater(board, L7.p(126, 7), 9, 4);

		board.ani.repeat(Infinity, function(ani) {
			ani.shimmer({
				targets: board.rect(22, 7, 4, 5),
				minAlpha: 0.4,
				maxAlpha: 0.7,
				baseRate: 500,
				rateVariance: 0.2
			});
		});

		this._addFirstAlien(board);
		this._addSecondAlien(board);

		// last alien enclosure
		i.FillerUtil.addSmoke(board, L7.p(209, 10), 3, 3);

		i.FillerUtil.pulsate(board, L7.p(63, 1));
		i.FillerUtil.pulsate(board, L7.p(63, 3));
		i.FillerUtil.pulsate(board, L7.p(133, 13));
		i.FillerUtil.pulsate(board, L7.p(137, 13));
	},

	_addFirstAlien: function(board) {
		var r = [179, 14, 52, 1];
		var d = [128, 11, 37, 1];
		var g = [98, 108, 36, 1];
		var n = null;

		var alien = new L7.Actor({
			position: L7.p(2, 4),
			shape: [[0, 5, 1, 0], [1, 1, 1, 1], [1, 1, 1, 1], [1, 0, 1, 0]],
			color: [[n, r, r, n], [d, r, g, r], [d, d, r, r], [d, n, d, n]]
		});

		board.addActor(alien);

		alien.ani.repeat(Infinity, function(ani) {
			ani.waitBetween(600, 2000);
			ani.invoke(function() {
				alien.down(1);
			});
			ani.waitBetween(600, 2500);
			ani.invoke(function() {
				alien.up(1);
			});
		});
	},

	_addSecondAlien: function(board, position) {
		var r = [179, 14, 52, 1];
		var d = [128, 11, 37, 1];
		var g = [98, 108, 36, 1];
		var n = null;

		var alien = new L7.Actor({
			position: position || L7.p(130, 8),
			shape: [[0, 5, 1, 1, 0], [1, 1, 1, 1, 1], [1, 1, 1, 1, 1], [1, 0, 1, 0, 1]],
			color: [[n, r, r, r, n], [d, g, r, g, r], [d, d, r, r, r], [d, n, d, n, d]]
		});

		board.addActor(alien);

		alien.ani.repeat(Infinity, function(ani) {
			ani.waitBetween(600, 2000);
			ani.invoke(function() {
				alien.left(1);
			});
			ani.waitBetween(300, 700);
			ani.invoke(function() {
				alien.left(1);
			});
			ani.waitBetween(800, 2000);
			ani.invoke(function() {
				alien.right(1);
			});
			ani.waitBetween(800, 2000);
			ani.invoke(function() {
				alien.right(1);
			});
		});
	}
};


