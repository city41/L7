(function() {
	i.MidBackgroundFiller = {
		fill: function(board) {
			i.FillerUtil.addBarGraph(board, L7.p(12, 5), 5, 4);
			i.FillerUtil.addWater(board, L7.p(28, 5), 3, 7);
			i.FillerUtil.addHighWater(board, L7.p(128, 2), 30, 18);

			i.FillerUtil.addSmoke(board, L7.p(104, 7), 1);
		},

	};
})();

