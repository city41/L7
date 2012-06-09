(function() {
	SAM.UpperPeninsula = function(bgImage, tileSize, spriteFactory) {
		var levelLoader = new L7.ColorLevelLoader(bgImage, tileSize, 0);
		var board = levelLoader.load();

		var matt = spriteFactory.matt(L7.p(20, 20));
		var sarah = spriteFactory.sarah(L7.p(30, 21));
		var chris = spriteFactory.chris(L7.p(40, 21));
		var ted = spriteFactory.ted(L7.p(50, 21));
		var emily = spriteFactory.emily(L7.p(10, 21));
		var phil = spriteFactory.phil(L7.p(0, 19));
		var goPackers = spriteFactory.goPackers(L7.p(3, 5));

		board.addActors(matt, sarah, chris, ted, emily, phil);

		board.ani.together(function(ani) {
			ani.frame({
				targets: [matt, sarah, chris, ted, emily, phil],
				pieceSetIndex: 1,
				rate: 150,
				looping: 'backforth',
				loops: Infinity
			});
			ani.sequence(function(ani) {
				ani.wait(2000);
				ani.invoke(function() {
					board.addActor(goPackers);
				});
				ani.wait(3500);
				ani.invoke(function() {
					board.removeActor(goPackers);
				});
			});
		});

		return board;
	};

})();

