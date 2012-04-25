(function() {
	SAM.DadTractor = function(bgImage, tileSize, spriteFactory) {
		var levelLoader = new L7.ColorLevelLoader(bgImage, tileSize, 0);
		var board = levelLoader.load();

		var dad = spriteFactory.dad(L7.p(10, 38));
		var mom = spriteFactory.mom(L7.p(20, 39));
		var livi = spriteFactory.livi(L7.p(2, 43));
		var buddy = spriteFactory.buddy(L7.p(52, 28));

		board.addActors(dad, mom, livi, buddy);

		board.ani.frame({
			targets: [mom, livi, buddy],
			pieceSetIndex: 1,
			rate: 150,
			looping: 'backforth',
			loops: Infinity
		});

		dad.ani.frame({
			targets: [dad],
			pieceSetIndex: 1,
			rate: 400,
			looping: 'backforth',
			loops: Infinity
		});

		return board;
	};

})();



