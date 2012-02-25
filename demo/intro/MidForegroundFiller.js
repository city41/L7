i.MidForegroundFiller = {
	fill: function(board) {
		board.ani.repeat(Infinity, function(ani) {
			ani.shimmer({
				targets: board.rect(137, 11, 5, 3),
				minAlpha: 0.4,
				maxAlpha: 0.7,
				baseRate: 500,
				rateVariance: 0.2
			});
		});
	}
};

