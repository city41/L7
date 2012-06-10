(function() {
	SAM.Wedding = function(bgImage, tileSize, spriteFactory) {
		var levelLoader = new L7.ColorLevelLoader(bgImage, tileSize, 0);
		var board = levelLoader.load();
		board.parallaxRatio = 0;

		var john = spriteFactory.john(L7.p(10, 0));
		var byron = spriteFactory.byron(L7.p(40, - 4));
		var nicky = spriteFactory.nicky(L7.p(22, 0));

		board.addActors(john, byron, nicky);

		board.ani.frame({
			targets: [john, byron, nicky],
			pieceSetIndex: 0,
			rate: 150,
			looping: 'backforth',
			loops: Infinity
		});

		var firstRow = this._getFirstRow(tileSize, spriteFactory, board.width, board.height);
		var secondRow = this._getSecondRow(tileSize, spriteFactory, board.width, board.height);
		var thirdRow = this._getThirdRow(tileSize, spriteFactory, board.width, board.height);
		var fourthRow = this._getFourthRow(tileSize, spriteFactory, board.width, board.height);
		var fifthRow = this._getFifthRow(tileSize, spriteFactory, board.width, board.height);
		var sixthRow = this._getSixthRow(tileSize, spriteFactory, board.width, board.height);

		var parallax = new L7.ParallaxBoard({
			boards: [board, firstRow, secondRow, thirdRow, fourthRow, fifthRow, sixthRow],
			width: board.width,
			height: board.height
		});

		parallax.destroy = function() {
			SAM.game.viewport.reset();
		};

		return parallax;
	};

	SAM.Wedding.prototype._getFirstRow = function(tileSize, spriteFactory, baseWidth, baseHeight) {
		var board = new L7.Board({
			width: baseWidth,
			height: baseHeight,
			tileSize: tileSize,
			parallaxRatio: 0
		});

		board.offsetX = - board.pixelWidth;

		for (var i = 0; i < 6; ++i) {
			board.addActor(spriteFactory.dad(L7.p(i * 10, 11)));
		}

		board.ani.tween({
			targets: [board],
			property: 'offsetX',
			from: - board.pixelWidth,
			to: 0,
			duration: 8000
		});

		return board;
	};

	SAM.Wedding.prototype._getSecondRow = function(tileSize, spriteFactory, baseWidth, baseHeight) {
		var board = new L7.Board({
			width: baseWidth,
			height: baseHeight,
			tileSize: tileSize * 1.25,
			parallaxRatio: 0
		});

		board.offsetX = board.pixelWidth;

		for (var i = 0; i < 3; ++i) {
			var actor = spriteFactory.mom(L7.p(i * 8, 14));
			board.addActor(actor);
		}

		board.ani.sequence(function(ani) {
			ani.wait(1000);
			ani.tween({
				targets: [board],
				property: 'offsetX',
				from: board.pixelWidth,
				to: 0,
				duration: 4000
			});
		});

		return board;
	};

	SAM.Wedding.prototype._getThirdRow = function(tileSize, spriteFactory, baseWidth, baseHeight) {
		var board = new L7.Board({
			width: baseWidth,
			height: baseHeight,
			tileSize: tileSize * 1.25,
			parallaxRatio: 0
		});

		board.offsetX = - board.pixelWidth;

		for (var i = 0; i < 3; ++i) {
			var actor = spriteFactory.mom(L7.p(baseWidth / 2 - 5 + i * 8, 14));
			board.addActor(actor);
		}

		board.ani.sequence(function(ani) {
			ani.wait(1000);
			ani.tween({
				targets: [board],
				property: 'offsetX',
				from: - board.pixelWidth,
				to: 0,
				duration: 6000
			});
		});

		return board;
	};

	SAM.Wedding.prototype._getFourthRow = function(tileSize, spriteFactory, baseWidth, baseHeight) {
		var board = new L7.Board({
			width: baseWidth,
			height: baseHeight,
			tileSize: tileSize * 1.45,
			parallaxRatio: 0
		});

		board.offsetX = board.pixelWidth;

		for (var i = 0; i < 4; ++i) {
			board.addActor(spriteFactory.phil(L7.p(i * 10, 19)));
		}

		board.ani.sequence(function(ani) {
			ani.wait(2000);
			ani.tween({
				targets: [board],
				property: 'offsetX',
				from: board.pixelWidth,
				to: 0,
				duration: 12000
			});
		});

		return board;
	};

	SAM.Wedding.prototype._getFifthRow = function(tileSize, spriteFactory, baseWidth, baseHeight) {
		var board = new L7.Board({
			width: baseWidth,
			height: baseHeight,
			tileSize: tileSize * 1.75,
			parallaxRatio: 0
		});

		board.offsetX = board.pixelWidth;

		for (var i = 0; i < 2; ++i) {
			var actor = spriteFactory.chad(L7.p(i * 8, 21));
			board.addActor(actor);
		}

		board.ani.sequence(function(ani) {
			ani.wait(4000);
			ani.tween({
				targets: [board],
				property: 'offsetX',
				from: board.pixelWidth,
				to: 0,
				duration: 11000
			});
		});

		return board;
	};

	SAM.Wedding.prototype._getSixthRow = function(tileSize, spriteFactory, baseWidth, baseHeight) {
		var board = new L7.Board({
			width: baseWidth,
			height: baseHeight,
			tileSize: tileSize * 1.75,
			parallaxRatio: 0
		});

		board.offsetX = - board.pixelWidth;

		for (var i = 0; i < 2; ++i) {
			var actor = spriteFactory.chad(L7.p(baseWidth / 2 - 15 + i * 8, 21));
			board.addActor(actor);
		}

		board.ani.sequence(function(ani) {
			ani.wait(4000);
			ani.tween({
				targets: [board],
				property: 'offsetX',
				from: - board.pixelWidth,
				to: 0,
				duration: 11000
			});
		});

		return board;
	};


})();

