(function() {


	SI.GameBoard = function(spriteFactory) {
		var player = new SI.Player(spriteFactory.player(), spriteFactory.playerExplosion(), spriteFactory.playerBulletExplosion());

		var board = new L7.Board({
			width: 224,
			height: 260,
			tileSize: 2,
			defaultTileColor: [0,0,0,1],
			disableHitDetection: true
		});

		board.addActor(player);

		for(var i = 0; i < 2; ++i) {
			board.addActor(new SI.Barrier(spriteFactory.barrier(), spriteFactory.barrierDamage(), L7.p(40 + 40 * i, 200)));
		}

		var explosion = spriteFactory.alienExplosion();
		var alienBullet = spriteFactory.alienSquiggleBullet();

		var alien1 = new SI.Alien(spriteFactory.stingray(), explosion, alienBullet, L7.p(20,40));
		board.addActor(alien1);

		var alien2 = new SI.Alien(spriteFactory.octopus(), explosion, alienBullet, L7.p(20,50));
		board.addActor(alien2);
		
		var alien3 = new SI.Alien(spriteFactory.skull(), explosion, alienBullet, L7.p(20,60));
		board.addActor(alien3);

		board.addActor(new SI.Floor(L7.p(0, 226), 224));
		
		return board;
	};

})();

