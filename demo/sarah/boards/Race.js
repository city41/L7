(function() {
	SAM.Race = function(bgImage, tileSize, spriteFactory) {
		var levelLoader = new L7.ColorLevelLoader(bgImage, tileSize, 0);
		var board = levelLoader.load();

		var matt = spriteFactory.mattRace(L7.p(20, 20));
		var sarah = spriteFactory.sarahRace(L7.p(30, 21));
		var clock = spriteFactory.raceClock(L7.p(5, 24));
		var pr = spriteFactory.pr(L7.p(33, 37));
		var yeahBabe = spriteFactory.yeahBabe(L7.p(7, 37));

		board.addActors(matt, sarah, clock);

		board.ani.together(function(ani) {
			ani.frame({
				targets: [matt, sarah],
				pieceSetIndex: 1,
				rate: 150,
				looping: 'backforth',
				loops: Infinity
			});
			ani.sequence(function(ani) {
				ani.wait(2000);
				ani.invoke(function() {
					board.addActor(pr);
				});
				ani.wait(3500);
				ani.invoke(function() {
					board.removeActor(pr);
				});
				ani.wait(200);
				ani.invoke(function() {
					board.addActor(yeahBabe);
				});
				ani.wait(3500);
				ani.invoke(function() {
					board.removeActor(yeahBabe);
				});
			});
		});

		clock.ani.frame({
			targets: clock,
			pieceSetIndex: 1,
			rate: 1000,
			looping: 'backforth',
			loops: Infinity
		});

		return board;
	};

})();

