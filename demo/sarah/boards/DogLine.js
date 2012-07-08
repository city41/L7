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

		var woo = spriteFactory.woo(L7.p(29, wordY));
		var hoo = spriteFactory.hoo(L7.p(44, wordY - 2));
		var oohs = [];

		dogBoard.ani.sequence(function(ani) {
			ani.wait(5700);
			var repeats = 6;
			var split = 2907 / repeats;
			for(var i = 0; i < repeats; ++i) {
				if(i === 0) {
					ani.invoke(function() {
						dogBoard.addActor(bubble);
					});
				}
				ani.wait(split);
				(function(xoff) {
					ani.invoke(function() {
						var ooh = spriteFactory.ooo(L7.p(4 + (4*xoff), wordY-2));
						dogBoard.addActor(ooh);
						oohs.push(ooh);
					});
				})(i);
			}
			ani.wait(300);
			ani.invoke(function() {
				dogBoard.addActor(woo);
			});
			ani.wait(300);
			ani.invoke(function() {
				dogBoard.addActor(hoo);
			});
			ani.wait(2800);
			ani.invoke(function() {
				dogBoard.removeActor(woo);
				dogBoard.removeActor(hoo);
				oohs.forEach(function(ooh) {
					dogBoard.removeActor(ooh);
				});
			});
			ani.wait(390);
			for(var i = 0; i < repeats; ++i) {
				ani.wait(split);
				(function(i) {
					ani.invoke(function() {
						dogBoard.addActor(oohs[i]);
					});
				})(i);
			}
			ani.wait(300);
			ani.invoke(function() {
				dogBoard.addActor(woo);
			});
			ani.wait(300);
			ani.invoke(function() {
				dogBoard.addActor(hoo);
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

