i.ForegroundFiller = {
	fill: function(board) {
		board.ani.repeat(Infinity, function(ani) {
			ani.shimmer({
				targets: board.rect(22, 7, 4, 5),
				minAlpha: 0.4,
				maxAlpha: 0.7,
				baseRate: 500,
				rateVariance: 0.2
			});
		});
	}
};

