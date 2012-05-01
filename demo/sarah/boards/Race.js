(function() {
	SAM.Race = function(bgImage, tileSize, spriteFactory) {
		var levelLoader = new L7.ColorLevelLoader(bgImage, tileSize, 0);
		var board = levelLoader.load();

		var matt = spriteFactory.mattRace(L7.p(20, 20));
		var sarah = spriteFactory.sarahRace(L7.p(30, 21));

		board.addActors(matt, sarah);

		board.ani.frame({
			targets: [matt, sarah],
			pieceSetIndex: 1,
			rate: 150,
			looping: 'backforth',
			loops: Infinity
		});

		return board;
	};

})();

