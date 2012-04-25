(function() {
	SAM.TedGarden = function(bgImage, tileSize, spriteFactory) {
		var levelLoader = new L7.ColorLevelLoader(bgImage, tileSize, 0);
		var board = levelLoader.load();

		var ted = spriteFactory.ted(L7.p(34, 35));
		var chris = spriteFactory.chris(L7.p(49, 36));
		var ben = spriteFactory.ben(L7.p(2, 20));

		board.addActors(chris, ted, ben);

		board.ani.frame({
			targets: [ted, chris, ben],
			pieceSetIndex: 1,
			rate: 150,
			looping: 'backforth',
			loops: Infinity
		});

		return board;
	};

})();


