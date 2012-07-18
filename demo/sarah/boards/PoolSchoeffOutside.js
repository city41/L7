(function() {
	SAM.PoolSchoeffOutside = function(bgImage, tileSize, spriteFactory) {
		var levelLoader = new L7.ColorLevelLoader(bgImage, tileSize, 0);
		var board = levelLoader.load();

		var schoeff = spriteFactory.schoeffLaying(L7.p(36, 33));
		var ellipsis = spriteFactory.ellipsis(L7.p(28, 18));
		var lucy = spriteFactory.lucy(L7.p(18, 29));

		board.addActors(lucy, schoeff);

		board.ani.together(function(ani) {
			ani.frame({
				targets: lucy,
				pieceSetIndex: 1,
				rate: 150,
				looping: 'backforth',
				loops: Infinity
			});
			ani.sequence(function(ani) {
				ani.wait(2000);
				ani.invoke(function() {
					board.addActor(ellipsis);
				});
			});
		});

		return board;
	};

})();


