Wave = function(config) {
	// config should have width, height, tileSize, etc
	_.extend(this, config);
	this.parallaxRatio = 1;

	this._waterBackdrop = this._createWaterBackdrop();
	this._waveBoard = this._createWaveBoard();
	this._frothBoard = this._createFrothBoard();
	this._rockBoard = this._createRockBoard();

	var parallaxConfig = {
		boards: [
		this._waterBackdrop, this._waveBoard, this._frothBoard, this._rockBoard]
	};

	this._parallaxBoard = new L7.ParallaxBoard(parallaxConfig);
};

Wave.prototype = {
	_createWaterBackdrop: function() {
		var board = new L7.Board(this);
		board.tiles.forEach(function(tile) {
			tile.color = this._baseWaterColor;
		});

		board.ani.together(function(ani) {
			ani.shimmer().repeat(Infinity);
			board.ani.sequence(function(ani) {
				for (var i = 0; i < board.width; ++i) {
					ani.withTiles(board.column(i)).sequence(function(ani) {
						ani.setProperty({
							property: 'color',
							value: this._darkWaterColor
						});
						ani.wait(this.waveMoveRate);
					});
				}
				ani.tween({
					property: 'color',
					from: 'current',
					to: this._baseWaterColor,
					duration: this._timeBetweenWaves
				});
			}).repeat(Infinity);
		});

		return board;
	},

	_createWaveBoard: function() {
		var legend = {
			this.rockColor: {
				tag: 'rockProxy'
			}
		};

		var levelLoader = new L7.LevelLoader({
			boardConfig: this,
			legend: legend
		});

		var board = levelLoader.load().board;

		board.tilesTagged('rockProxy').forEach(function(tile) {
			// add a rock proxy actor
			board.addActor(new L7.Actor({
				team: 'rockProxy',
				position: tile.position,
				color: null,
				hitDetection: {
					wave: function(actor, tile) {
						me._frothFrom(tile.position);
					}
				}
			}));
		});

		for (var i = 0; i < board.height; ++i) {
			board.addActor(new WaveActor());
		}

		board.ani.withActors('wave').sequence(function(ani) {
			ani.move({
				direction: 'right',
				step: 1,
				distance: this.width,
				rate: this.waveMoveRate,
				easing: 'easeOutQuad'
			});
			ani.wait(this.waveFrequency);
			ani.invoke(this._startRockEmerge, this);
			ani.sequence(function(ani) {
				ani.invoke(this._resetWaveActors, this);
				ani.move({
					direction: 'right',
					step: 1,
					distance: this.width,
					rate: this.waveMoveRate,
					easing: 'easeOutQuad'
				});
				ani.wait(this.waveFrequency);
			}).repeat(Infinity);
		});

		return board;
	},

	_createRockBoard: function() {
		var legend = {
			this.rockColor: {
				tag: 'rock'
			}
		};

		var levelLoader = new L7.LevelLoader({
			boardConfig: this,
			legend: legend
		});

		var board = levelLoader.load().board;

		board.tilesTagged('rock').forEach(function(tile) {
			// add a rock actor, scale set to 0
		});
	},
	_startRockEmerge: function() {
		this._rockBoard.ani.withActors('rock').sequence(function(ani) {
			ani.together(function(ani) {
				ani.tween({
					property: 'scale',
					from: 0,
					to: 0.6,
					easing: 'easeOutCubic',
					duration: 800
				});
				ani.jitter({
					property: 'scale',
					range: 0.15,
					duration: 800,
					chooseWith: 'random'
				});
			});
			ani.invokeEach(function(actor) {
				actor.hitDetection.enabled = true;
			});
			ani.wait(200);
			ani.together(function(ani) {
				ani.tween({
					property: 'scale',
					from: 0.6,
					to: 0.95,
					easing: 'easeOutCubic',
					duration: 400
				});
				ani.jitter({
					property: 'scale',
					range: 0.2,
					duration: 400,
					chooseWith: 'random'
				});
			});
			ani.wait(500);
			ani.together(function(ani) {
				ani.tween({
					property: 'scale',
					from: 0.95,
					to: 1.25,
					easing: 'easeOutCubic',
					duration: 250
				});
				ani.jitter({
					property: 'scale',
					range: 0.15,
					duration: 250,
					chooseWith: 'random'
				});
			});
		});
	},

	_createFrothBoard: function() {
		var board = new L7.Board({
			width: this.width * 2,
			height: this.height * 2,
			tileSize: Math.floor(this.tileSize / 2),
			borderWidth: Math.floor(this.borderWidth / 2),
			borderFill: this.borderFill,
			parallaxRatio: 1
		});

		return board;
	},

	_frothFrom: function(wavePosition) {
		this._frothBoard.addActor(new ParticleSystem({
			...
		});
	}
};




2|9|2
1|4|1|4|1
