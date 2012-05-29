(function() {


	SI.GameBoard = function(spriteFactory) {
		var player = new SI.Player(spriteFactory.player(), spriteFactory.playerExplosion());

		var board = new L7.Board({
			width: 224,
			height: 260,
			tileSize: 2,
			defaultTileColor: [0,0,0,1],
			disableHitDetection: true
		});

		board.addActor(player);

		var explosion = spriteFactory.alienExplosion();
		var alienBullet = spriteFactory.alienSquiggleBullet();

		var alien1 = new SI.Alien(spriteFactory.stingray(), explosion, alienBullet, L7.p(20,20));
		board.addActor(alien1);

		var alien2 = new SI.Alien(spriteFactory.octopus(), explosion, alienBullet, L7.p(20,30));
		board.addActor(alien2);
		
		var alien3 = new SI.Alien(spriteFactory.skull(), explosion, alienBullet, L7.p(20,50));
		board.addActor(alien3);

		board.addActor(new SI.Floor(L7.p(0, 226), 224));
		
		return board;
	};

})();

