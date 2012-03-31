i.BackgroundFiller = {
	fill: function(board) {
		board.ani.sequence(function(ani) {
			ani.wait(15200);
			ani.repeat(Infinity, function(ani) {
				ani.shimmer({
					targets: board.query(function(t) {
						return t.color[0] === 193;
					}),
					minAlpha: 0.2,
					maxAlpha: 0.9,
					baseRate: 1000,
					rateVariance: 0.4,
					color: [250, 250, 120, 1]
				});
			});
		});
	}
};

