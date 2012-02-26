i.MidForegroundFiller = {
	fill: function(board) {
		this._addControlPanelShimmer(board, board.rect(137, 11, 5, 3));
		i.FillerUtil.addWater(board, L7.p(6, 5), 2, 6);
		i.FillerUtil.addWater(board, L7.p(75, 1), 2, 5);
		i.FillerUtil.addBlueScreen(board, L7.p(129, 11), 5, 3);

		i.FillerUtil.addBlueScreen(board, L7.p(66, 11), 8, 3);
		i.FillerUtil.pulsate(board, L7.p(64, 11));
		i.FillerUtil.pulsate(board, L7.p(63, 13));

		i.FillerUtil.addHeartWave(board, L7.p(30, 9), 5, 4);
		i.FillerUtil.pulsate(board, L7.p(30, 14));
		i.FillerUtil.pulsate(board, L7.p(32, 14));
		i.FillerUtil.pulsate(board, L7.p(34, 14));
		i.FillerUtil.addBarGraph(board, L7.p(46, 8), 4, 7, [0, 255, 0, 1]);
		i.FillerUtil.pulsate(board, L7.p(79, 10));
		i.FillerUtil.pulsate(board, L7.p(81, 10));
		i.FillerUtil.pulsate(board, L7.p(83, 10));

		i.FillerUtil.addSinWave(board, L7.p(91, 1), 7, 4, [255, 0, 0, 1]);
	},

	_addControlPanelShimmer: function(board, targets) {
		board.ani.repeat(Infinity, function(ani) {
			ani.shimmer({
				targets: targets,
				minAlpha: 0.4,
				maxAlpha: 0.7,
				baseRate: 500,
				rateVariance: 0.2
			});
		});
	}
};

