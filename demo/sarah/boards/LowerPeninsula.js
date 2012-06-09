(function() {
	SAM.LowerPeninsula = function(bgImage, tileSize, spriteFactory) {
		var levelLoader = new L7.ColorLevelLoader(bgImage, tileSize, 0);
		var board = levelLoader.load();

		var matt = spriteFactory.matt(L7.p(20, 20));
		var sarah = spriteFactory.sarah(L7.p(30, 21));
		var dad = spriteFactory.dad(L7.p(40, 21));
		var mom = spriteFactory.mom(L7.p(50, 22));
		var chad = spriteFactory.chad(L7.p(10, 20));
		var tammy = spriteFactory.tammy(L7.p(0, 21));
		var troll = spriteFactory.troll(L7.p(3, 43));
		var goTigers = spriteFactory.goTigers(L7.p(11, 5));
		var goRedWings = spriteFactory.goRedWings(L7.p(3, 5));

		board.addActors(matt, sarah, mom, dad, chad, tammy, troll);

		board.ani.together(function(ani) {
			ani.frame({
				targets: [matt, sarah, mom, chad, tammy, troll],
				pieceSetIndex: 1,
				rate: 150,
				looping: 'backforth',
				loops: Infinity
			});
			ani.sequence(function(ani) {
				ani.wait(1500);
				ani.invoke(function() {
					board.addActor(goTigers);
				});
				ani.wait(2000);
				ani.invoke(function() {
					board.removeActor(goTigers);
					board.addActor(goRedWings);
				});
				ani.wait(2000);
				ani.invoke(function() {
					board.removeActor(goRedWings);
				});
			});
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

