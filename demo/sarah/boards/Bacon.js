(function() {
	SAM.Bacon = function(tileSize, spriteFactory) {
		var board = new L7.Board({
			tileSize: tileSize,
			width: 60,
			height: 60,
			borderWidth: 0,
			borderColor: [200, 180, 100, 1]
		});

		board.tiles.forEach(function(tile) {
			tile.color = board.borderColor;
		});

		var schoeff = spriteFactory.schoeffDance(L7.p(20, 30));

		for(var i = 0; i < 4; ++i) {
			this._addBacon(board, spriteFactory);
		}

		board.addActor(schoeff);

		board.ani.frame({
			targets: [schoeff],
			pieceSetIndex: 1,
			rate: 150,
			looping: 'backforth',
			loops: Infinity
		});

		return board;
	};

	SAM.Bacon.prototype._addBacon = function(board, spriteFactory) {
		var i = L7.rand(0,3);
		var bacon = spriteFactory['bacon' + i](L7.p(L7.rand(1, 50), 4));
		bacon.smoothMovement = true;
		bacon.rate = L7.rand(100, 300);
		board.addActor(bacon);

		bacon.ani.repeat(Infinity, function(ani) {
			ani.invoke(function() {
				bacon.down(1);
			});
			ani.wait(bacon.rate);
		});
	};
})();

