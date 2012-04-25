(function() {
	SAM.CatLine = function(tileSize, spriteFactory) {
		var caty = 25;
		var cats = [
		spriteFactory.boo(L7.p(5, caty)), spriteFactory.lily(L7.p(15, caty)), spriteFactory.lucy(L7.p(25, caty)), spriteFactory.schoeffDance(L7.p(35, caty)), spriteFactory.bobo(L7.p(45, caty))];

		var catBoard = new L7.Board({
			tileSize: tileSize,
			width: 60,
			height: 60,
			borderWidth: 0,
			parallaxRatio: 0
		});

		catBoard.addActors.apply(catBoard, cats);

		catBoard.ani.sequence(function(ani) {
			ani.frame({
				targets: cats,
				pieceSetIndex: 1,
				rate: 150,
				looping: 'backforth',
				loops: Infinity
			});
		});

		var bgBoard = new L7.Board({
			tileSize: tileSize,
			width: 60,
			height: 60,
			borderWidth: 0,
			defaultTileColor: [50, 220, 70, 1],
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
			bgBoard, catBoard]
		});
	};

})();

