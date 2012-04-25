(function() {
	SAM.Skydiving = function(bgImage, tileSize, spriteFactory) {
		var levelLoader = new L7.ColorLevelLoader(bgImage, tileSize, 0);
		var board = levelLoader.load();

		var chad = spriteFactory.chad(L7.p(33, 29));
		var tammy = spriteFactory.tammy(L7.p(41, 0));
		var bobo = spriteFactory.bobo(L7.p(7, 15));
		var boo = spriteFactory.boo(L7.p(19, 48));

		board.addActors(chad, tammy, bobo, boo);

		board.ani.frame({
			targets: [chad, tammy, bobo, boo],
			pieceSetIndex: 1,
			rate: 150,
			looping: 'backforth',
			loops: Infinity
		});

		return board;
	};

})();


