(function() {
	SAM.LivingRoom = function(bgImage, tileSize, spriteFactory) {
		var levelLoader = new L7.ColorLevelLoader(bgImage, tileSize, 0);
		var board = levelLoader.load();

		var matt = spriteFactory.matt(L7.p(20, 20));
		var sarah = spriteFactory.sarah(L7.p(30, 21));
		var lucy = spriteFactory.lucy(L7.p(10, 26));
		var schoeff = spriteFactory.schoeffLaying(L7.p(40, 29));

		board.addActors(matt, sarah, lucy, schoeff);

		board.ani.frame({
			targets: [matt, sarah, lucy],
			pieceSetIndex: 1,
			rate: 150,
			looping: 'backforth',
			loops: Infinity
		});

		return board;
	};

})();


