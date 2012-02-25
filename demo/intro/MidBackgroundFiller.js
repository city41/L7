(function() {
	i.MidBackgroundFiller = {
		fill: function(board) {
			i.FillerUtil.addBarGraph(board, L7.p(12, 5), 5, 4);
			i.FillerUtil.addWater(board, L7.p(28, 5), 3, 7);
		},
	};
})();

