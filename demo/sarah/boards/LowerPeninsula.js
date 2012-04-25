(function() {
	SAM.LowerPeninsula = function(bgImage, tileSize, spriteFactory) {
		var levelLoader = new L7.ColorLevelLoader(bgImage, tileSize, 0);
		var board = levelLoader.load();

		var matt = spriteFactory.matt(L7.p(20, 20));
		var sarah = spriteFactory.sarah(L7.p(30, 21));
		var dad = spriteFactory.dad(L7.p(40, 21));
		var mom = spriteFactory.mom(L7.p(50, 21));
		var chad = spriteFactory.chad(L7.p(10, 20));
		var tammy = spriteFactory.tammy(L7.p(0, 21));

		board.addActors(matt, sarah, mom, dad, chad, tammy);

		board.ani.frame({
			targets: [matt, sarah, mom, chad, tammy],
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

