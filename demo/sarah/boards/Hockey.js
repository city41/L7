(function() {
	SAM.Hockey = function(bgImage, fgImage, tileSize, spriteFactory) {
		var bgLevelLoader = new L7.ColorLevelLoader(bgImage, tileSize, 0);
		var bgBoard = bgLevelLoader.load();
		bgBoard.parallaxRatio = 0;

		var matt = spriteFactory.matt(L7.p(20, 20));
		var sarah = spriteFactory.sarah(L7.p(30, 21));
		var phil = spriteFactory.phil(L7.p(40, 21));
		var emily = spriteFactory.emily(L7.p(7, 21));
		var blimp = spriteFactory.chipotleBlimp(L7.p(-10, 2));
		blimp.smoothMovement = true;
		blimp.rate = 200;

		bgBoard.addActors(matt, sarah, phil, emily, blimp);

		bgBoard.ani.frame({
			targets: [matt, sarah, phil, emily],
			pieceSetIndex: 1,
			rate: 150,
			looping: 'backforth',
			loops: Infinity
		});

		blimp.ani.repeat(70, function(ani) {
			ani.invoke(function() {
				blimp.right(1);
			});
			ani.wait(200);
		});

		var fgLevelLoader = new L7.ColorLevelLoader(fgImage, tileSize, 0);
		var fgBoard = fgLevelLoader.load();
		fgBoard.parallaxRatio = 0;

		var avPlayer1 = spriteFactory.avPlayer(L7.p(7, 40));
		var avPlayer2 = spriteFactory.avPlayer(L7.p(18, 38));
		var rwPlayer1 = spriteFactory.redwingPlayer(L7.p(33, 36));
		var rwPlayer2 = spriteFactory.redwingPlayer(L7.p(43, 41));
		var ref = spriteFactory.hockeyRef(L7.p(25, 45));

		fgBoard.addActors(avPlayer1, avPlayer2, rwPlayer1, rwPlayer2, ref);
		fgBoard.ani.frame({
			targets: [avPlayer1, avPlayer2, rwPlayer1, rwPlayer2],
			pieceSetIndex: 1,
			rate: 150,
			looping: 'backforth',
			loops: Infinity
		});


		return new L7.ParallaxBoard({
			boards: [bgBoard, fgBoard]
		});
	};

})();


