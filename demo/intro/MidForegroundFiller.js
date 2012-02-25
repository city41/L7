i.MidForegroundFiller = {
	fill: function(board) {
		this._addControlPanelShimmer(board, board.rect(137, 11, 5, 3));
		i.FillerUtil.addWater(board, L7.p(75, 1), 2, 5);
		i.FillerUtil.addBlueScreen(board, L7.p(129, 11), 5, 3);
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

