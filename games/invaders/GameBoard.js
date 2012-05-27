(function() {


	SI.GameBoard = function(spriteFactory) {
		var player = new SI.Player(spriteFactory.player());

		var board = new L7.Board({
			width: 224,
			height: 260,
			tileSize: 2,
			defaultTileColor: [0,0,0,1],
			disableHitDetection: true
		});

		board.addActor(player);
		
		return board;
	};

})();

