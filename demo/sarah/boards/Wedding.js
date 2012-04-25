(function() {
	SAM.Wedding = function(bgImage, tileSize, spriteFactory) {
		var levelLoader = new L7.ColorLevelLoader(bgImage, tileSize, 0);
		var board = levelLoader.load();

		var matt = spriteFactory.mattWedding(L7.p(20, 20));
		var sarah = spriteFactory.sarahWedding(L7.p(30, 21));
		var lucy = spriteFactory.lucy(L7.p(30, 35));
		var schoeff = spriteFactory.schoeffDance(L7.p(20, 33));

 		var dad = spriteFactory.dad(L7.p(10, 19));
 		var mom = spriteFactory.mom(L7.p(00, 21));

 		var chris = spriteFactory.chris(L7.p(50, 5));
 		var ted = spriteFactory.ted(L7.p(40, 18));
		var ben = spriteFactory.ben(L7.p(1, 33));

		var bobo = spriteFactory.bobo(L7.p(25, 45));
		var boo = spriteFactory.boo(L7.p(2,2));

		var buddy = spriteFactory.buddy(L7.p(12,4));
		var livi = spriteFactory.livi(L7.p(50,30));

		var lily = spriteFactory.lily(L7.p(50, 21));

		var emily = spriteFactory.emily(L7.p(35, 44));
		var phil = spriteFactory.phil(L7.p(48, 44));

		var chad = spriteFactory.chad(L7.p(20, 5));
		var tammy = spriteFactory.tammy(L7.p(30, 1));

		board.addActors(boo, buddy, mom, chad, tammy, lily, livi, chris, ted, emily, phil, dad, sarah, matt, schoeff, lucy, ben, bobo);

		board.ani.frame({
			targets: [boo, matt, buddy, sarah, mom, chad, tammy, livi, chris, ted, lily, emily, phil, schoeff, lucy, ben, bobo],
			pieceSetIndex: 1,
			rate: 150,
			looping: 'backforth',
			loops: Infinity
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


