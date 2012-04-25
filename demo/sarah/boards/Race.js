(function() {
	SAM.Race = function(bgImage, tileSize, spriteFactory) {
		var levelLoader = new L7.ColorLevelLoader(bgImage, tileSize, 0);
		var board = levelLoader.load();

		var matt = spriteFactory.matt(L7.p(20,20));
		var sarah = spriteFactory.sarah(L7.p(30, 30));

		board.addActors(matt, sarah);

		board.ani.sequence(function(ani) {
			ani.wait(1000);
			ani.frame({
				targets: 'actors',
				pieceSetIndex: 1,
				rate: 150,
				looping: 'backforth',
				loops: Infinity
			});
		});

		return board;
	};

})();


