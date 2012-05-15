(function() {
	SAM.DogLine = function(tileSize, spriteFactory) {
		var dogy = 45;
		var dogs = [
			spriteFactory.ben(L7.p(15, dogy - 20 )),
			spriteFactory.livi(L7.p(5, dogy)),
			spriteFactory.buddy(L7.p(45, dogy))
		];

		var bubble = spriteFactory.woohooBubble(L7.p(2, 5));

		var dogBoard = new L7.Board({
			tileSize: tileSize,
			width: 60,
			height: 60,
			borderWidth: 0,
			parallaxRatio: 0
		});

		dogBoard.addActors.apply(dogBoard, dogs);

		dogBoard.ani.frame({
			targets: dogs,
			pieceSetIndex: 1,
			rate: 150,
			looping: 'backforth',
			loops: Infinity
		});

		var wordY = 8;

		dogBoard.ani.sequence(function(ani) {
			ani.wait(500);
			ani.invoke(function() {
				dogBoard.addActor(bubble);
			});
			for(var i = 0; i < 6; ++i) {
				ani.wait(200);
				(function(xoff) {
					ani.invoke(function() {
						dogBoard.addActor(spriteFactory.ooo(L7.p(4 + (4*xoff), wordY)))
					});
				})(i);
			}
			ani.wait(200);
			ani.invoke(function() {
				dogBoard.addActor(spriteFactory.woo(L7.p(29, wordY)))
			});
			ani.wait(200);
			ani.invoke(function() {
				dogBoard.addActor(spriteFactory.hoo(L7.p(44, wordY - 2)))
			});
		});

		var bgBoard = new L7.Board({
			tileSize: tileSize,
			width: 60,
			height: 60,
			borderWidth: 0,
			defaultTileColor: [50, 120, 200, 1],
			parallaxRatio: 0
		});

		bgBoard.ani.repeat(Infinity, function(ani) {
			ani.shimmer({
				filter: 'tiles',
				minAlpha: 0.2,
				maxAlpha: 0.5,
				baseRate: 2000,
				rateVariance: 0.4
			});
		});

		return new L7.ParallaxBoard({
			boards: [
			bgBoard, dogBoard]
		});
	};

})();

