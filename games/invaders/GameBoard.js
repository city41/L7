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

		for(var i = 0; i < 4; ++i) {
			board.addActor(new SI.Barrier(spriteFactory.barrier(), spriteFactory.barrierDamage(), L7.p(40 + 40 * i, 200)));
		}

		var explosion = spriteFactory.alienExplosion();
		var alienBullet = spriteFactory.alienSquiggleBullet();
		var movementConfig = {
			horizontalSpan: 10,
			verticalDrop: 10
		};

		for(var i = 0; i < 10; ++i) {
			var alien1 = new SI.Alien(spriteFactory.stingray(), explosion, alienBullet, movementConfig, L7.p(20 + i*15,40));
			var alien2 = new SI.Alien(spriteFactory.octopus(), explosion, alienBullet, movementConfig, L7.p(20 + i * 15,55));
			var alien3 = new SI.Alien(spriteFactory.skull(), explosion, alienBullet, movementConfig, L7.p(20 + i * 15,70));
			var alien4 = new SI.Alien(spriteFactory.stingray(), explosion, alienBullet, movementConfig, L7.p(20 + i*15,85));
			var alien5 = new SI.Alien(spriteFactory.octopus(), explosion, alienBullet, movementConfig, L7.p(20 + i * 15,100));
			var alien6 = new SI.Alien(spriteFactory.skull(), explosion, alienBullet, movementConfig, L7.p(20 + i * 15,115));
			board.addActors(alien1, alien2, alien3, alien4, alien5, alien6);
		}

		board.addActor(new SI.Floor(L7.p(0, 226), 224));
		
		return board;
	};

})();

