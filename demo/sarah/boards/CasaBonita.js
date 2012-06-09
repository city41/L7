(function() {
	SAM.CasaBonita = function(bgImage, tileSize, spriteFactory) {
		var levelLoader = new L7.ColorLevelLoader(bgImage, tileSize, 0);
		var board = levelLoader.load();

		var matt = spriteFactory.matt(L7.p(37, 46));
		var sarah = spriteFactory.sarah(L7.p(48, 47));
		var trumpeter = spriteFactory.casaTrumpeter(L7.p(35, 19));
		var guitarist = spriteFactory.casaGuitarist(L7.p(46, 19));
		var mmmm = spriteFactory.mmmm(L7.p(10, 33));

		board.addActors(matt, sarah, trumpeter, guitarist);

		board.ani.together(function(ani) {
			ani.frame({
				targets: [matt, sarah, trumpeter, guitarist],
				pieceSetIndex: 1,
				rate: 150,
				looping: 'backforth',
				loops: Infinity
			});
			ani.sequence(function(ani) {
				ani.wait(2000);
				ani.invoke(function() {
					board.addActor(mmmm);
				});
				ani.wait(3500);
				ani.invoke(function() {
					board.removeActor(mmmm);
				});
			});
		});

		return board;
	};

})();

