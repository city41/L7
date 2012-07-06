(function() {

	var row1 = {
		tileSizeRatio: 1,
		from: 'right',
		positionTweak: 0,
		actors: [{
			n: 'boo',
			y: 17
		},
		{
			n: 'chad',
			y: 11
		},
		{
			n: 'tammy',
			y: 12
		},
		{
			n: 'schoeffDance',
			y: 13
		},
		{
			n: 'bobo',
			y: 16
		},
		{
			n: 'ben',
			y: - 4,
			x: 1
		}],
		duration: 8000
	};

	var row2 = {
		tileSizeRatio: 1.2,
		from: 'left',
		positionTweak: 0,
		actors: [{
			n: 'ted',
			y: 17
		},
		{
			n: 'chris',
			y: 17,
			x: 1
		},
		{
			n: 'buddy',
			y: 20
		},
		{
			n: 'dad',
			y: 15
		},
		{
			n: 'mom',
			y: 16
		},
		{
			n: 'livi',
			y: 21,
			x: -1
		}],
		duration: 9000,
		delay: 1200
	};

	var row3 = {
		tileSizeRatio: 1.4,
		from: 'right',
		positionTweak: 0,
		actors: [{
			n: 'phil',
			y: 20,
			x: 1
		},
		{
			n: 'emily',
			y: 22
		},
		{
			n: 'lily',
			y: 24
		},
		{
			n: 'lucy',
			y: 23
		}],
		duration: 10000,
		delay: 2000
	};

	var row4 = {
		tileSizeRatio: 1.8,
		from: 'left',
		positionTweak: 10,
		actors: [{
			n: 'mattWedding',
			y: 21
		}],
		duration: 10000,
		delay: 4000
	};

	var row5 = {
		tileSizeRatio: 1.8,
		from: 'right',
		positionTweak: 18,
		actors: [{
			n: 'sarahWedding',
			y: 21
		}],
		duration: 10000,
		delay: 4000
	};


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

		this.baseWidth = board.width;
		this.baseHeight = board.height;
		this.tileSize = tileSize;
		this.spriteFactory = spriteFactory;

		var firstRow = this._getRow(row1);
		var secondRow = this._getRow(row2);
		var thirdRow = this._getRow(row3);
		var fourthRow = this._getRow(row4);
		var fifthRow = this._getRow(row5);

		var parallax = new L7.ParallaxBoard({
			boards: [board, firstRow, secondRow, thirdRow, fourthRow, fifthRow],
			width: board.width,
			height: board.height
		});

		parallax.destroy = function() {
			SAM.game.viewport.reset();
		};

		return parallax;
	};

	SAM.Wedding.prototype._getRow = function(config) {
		var board = new L7.Board({
			width: this.baseWidth,
			height: this.baseHeight,
			tileSize: this.tileSize * config.tileSizeRatio,
			parallaxRatio: 0
		});

		board.offsetX = board.pixelWidth;
		if (config.from === 'right') {
			board.offsetX *= - 1;
		}

		var tweak = config.positionTweak || 0;
		var actors = [];

		for (var i = 0; i < config.actors.length; ++i) {
			var actorConfig = config.actors[i];
			var xOffset = actorConfig.x || 0;
			var actor = this.spriteFactory[actorConfig.n](L7.p(i * 9 + tweak + xOffset, actorConfig.y));
			board.addActor(actor);
			actors.push(actor);
		}

		board.ani.together(function(ani) {
			ani.sequence(function(ani) {
				ani.wait(config.delay || 0);
				ani.tween({
					targets: [board],
					property: 'offsetX',
					from: board.offsetX,
					to: config.offsetTo || 0,
					duration: config.duration
				});
			});
			ani.frame({
				targets: actors,
				pieceSetIndex: 1,
				rate: 150,
				looping: 'backforth',
				loops: Infinity
			});
		});

		return board;
	};
})();

