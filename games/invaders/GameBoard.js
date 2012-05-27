(function() {


	SI.GameBoard = function(spriteFactory) {
		var player = new SI.Player(spriteFactory.player());

		var board = new L7.Board({
			width: 224,
			height: 260,
			tileSize: 3,
			defaultTileColor: [0,0,0,1],
			disableHitDetection: true
		});

		board.addActor(player);

		var alien1 = new SI.Alien(spriteFactory.stingray(), L7.p(20,20));
		board.addActor(alien1);

		var alien2 = new SI.Alien(spriteFactory.octopus(), L7.p(20,30));
		board.addActor(alien2);
		
		var alien3 = new SI.Alien(spriteFactory.skull(), L7.p(20,50));
		board.addActor(alien3);
		
		return board;
	};

})();

