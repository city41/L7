SplashBoard = function(config) {
	config.width = config.image.width;
	config.height = config.image.height;
	config.parallaxRatio = 1;
	this.rockColor = config.rockColor;

	this._waterBackdrop = this._createWaterBackdrop(config);
	//this._waveBoard = this._createWaveBoard();
	//this._frothBoard = this._createFrothBoard();
	this._rockBoard = this._createRockBoard(config);
	this._discoBoard = this._createDiscoBoard(config);

	var parallaxConfig = {
		boards: [
		this._discoBoard, this._waterBackdrop, this._rockBoard //, this._waveBoard, this._frothBoard, this._rockBoard
		]
	};

	this._parallaxBoard = new L7.ParallaxBoard(parallaxConfig);

	this._startRockEmerge();
};

SplashBoard.prototype = {
	update: function() {
		this._parallaxBoard.update.apply(this._parallaxBoard, arguments);
	},
	render: function() {
		this._parallaxBoard.render.apply(this._parallaxBoard, arguments);
	},

	_baseWaterColor: [172, 205, 255, 0.5],
	_darkWaterColor: [200, 70, 162, 0.8],
	_baseDiscoColor: [50, 200, 80, 1],
	waveMoveRate: 60,
	_timeBetweenWaves: 2000,

	_createDiscoBoard: function(config) {
		var me = this;
		
		var legend = {
			'#000000' : {
				tag: 'disco',
				color: this._baseDiscoColor
			}
		};

		var levelLoader = new L7.LevelLoader({
			image: config.discoImage,
			boardConfig: config,
			legend: legend
		});

		var board = levelLoader.load().board;

		board.ani.together(function(ani) {
			ani.repeat(Infinity, function(ani) {
				ani.disco({
					filter: board.tilesTagged('disco'),
					width: 30,
					rate: 500
				});
			});
			ani.together(function(ani) {
				ani.repeat(Infinity, function(ani) {
					ani.tween({
						targets: [board],
						property: 'offsetX',
						from: 0,
						to: 50,
						duration: 4000
					});
					ani.tween({
						targets: [board],
						property: 'offsetX',
						from: 50,
						to: 0,
						duration: 4000
					});
					ani.tween({
						targets: [board],
						property: 'offsetY',
						from: 0,
						to: 50,
						duration: 4000
					});
					ani.tween({
						targets: [board],
						property: 'offsetY',
						from: 50,
						to: 0,
						duration: 4000
					});
				});
				ani.repeat(Infinity, function(ani) {
					ani.tween({
						targets: [board],
						property: 'tileSize',
						from: 15,
						to: 20,
						duration: 3000
					});
					ani.tween({
						targets: [board],
						property: 'tileSize',
						from: 20,
						to: 15,
						duration: 3000
					});
					ani.tween({
						property: 'color',
						filter: board.tilesTagged('disco'),
						from: me._baseDiscoColor,
						to: [255, 0, 0, 1],
						duration: 2000
					});
					ani.tween({
						property: 'color',
						filter: board.tilesTagged('disco'),
						from: [255, 0, 0,1],
						to: me._baseDiscoColor,
						duration: 2000
					});

				});
			});
		});

		return board;
	},

	_createWaterBackdrop: function(config) {
		var me = this;

		var legend = {
			'#000000' : {
				tag: 'water',
				color: this._baseWaterColor
			}
		};

		var levelLoader = new L7.LevelLoader({
			image: config.waterImage,
			boardConfig: config,
			legend: legend
		});

		var board = levelLoader.load().board;

		board.ani.together(function(ani) {
			ani.together(function(ani) {
				ani.repeat(Infinity, function(ani) {
					ani.tween({
						targets: [board],
						property: 'offsetX',
						from: 0,
						to: - 200,
						duration: 2000,
						easing: 'easeInCubic'
					});
					ani.tween({
						targets: [board],
						property: 'offsetX',
						from: - 200,
						to: 0,
						duration: 2000,
						easing: 'easeOutCubic'
					});
					ani.tween({
						targets: [board],
						property: 'offsetY',
						from: 0,
						to: - 200,
						duration: 2000,
						easing: 'easeInOutSine'
					});
					ani.tween({
						targets: [board],
						property: 'offsetY',
						from: - 200,
						to: 0,
						duration: 2000,
						easing: 'easeInOutSine'
					});
				});
				ani.repeat(Infinity, function(ani) {
					ani.tween({
						targets: [board],
						property: 'tileSize',
						from: 15,
						to: 30,
						duration: 3000
					});
					ani.tween({
						targets: [board],
						property: 'tileSize',
						from: 30,
						to: 15,
						duration: 3000
					});

				});
			});

			ani.repeat(Infinity, function(ani) {
				ani.shimmer({
					filter: board.tilesTagged('water'),
					minAlpha: 0.1,
					maxAlpha: 0.8,
					baseRate: 2000,
					rateVariance: 0.4
				})
			});
			ani.repeat(Infinity, function(ani) {
				ani.sequence(function(ani) {
					for (var i = 0; i < board.width; ++i) {
						ani.setProperty({
							filter: board.column(i).filter(function(t) { return t.tag === 'water' }),
							property: 'color',
							value: me._darkWaterColor
						});
						ani.wait(me.waveMoveRate);
					}
					ani.wait(3000);
					ani.tween({
						filter: board.tilesTagged('water'),
						property: 'color',
						from: me._darkWaterColor,
						to: me._baseWaterColor,
						duration: me._timeBetweenWaves
					});
				});
			});
		});

		return board;
	},

	_createWaveBoard: function() {
		var legend = {
			//	this.rockColor: {
			//		tag: 'rockProxy'
			//	}
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

	_createRockBoard: function(config) {
		var legend = {}
		legend[this.rockColor] = {
			tag: 'rock'
		};

		var levelLoader = new L7.LevelLoader({
			image: config.image,
			boardConfig: config,
			legend: legend
		});

		var board = levelLoader.load().board;

		var me = this;
		board.tilesTagged('rock').forEach(function(tile) {
			board.addActor(new L7.Actor({
				position: tile.position,
				color: me._baseWaterColor.slice(0)
			}));
		});

		return board;
	},

	_startRockEmerge: function() {
		var me = this;
		var targets = []
		this._rockBoard.actors.forEach(function(actor) {
			targets = targets.concat(actor.pieces);
		});

		var fromColor = [255, 255, 255, 0];
		fromColor[3] = 0;
		this._rockBoard.ani.sequence(function(ani) {
			ani.wait(1000);
			ani.tween({
				targets: targets,
				property: 'color',
				from: fromColor.slice(0),
				to: [255, 255, 255, 0.5],
				duration: 3000
			});
			ani.tween({
				targets: targets,
				property: 'scale',
				jitter: 0.2,
				from: 1,
				to: 2,
				duration: 6000
			});
			ani.tween({
				targets: targets,
				property: 'scale',
				from: 2,
				to: 1,
				duration: 6000
			});
		});
	},

	_startRockEmergeOld: function() {
		var me = this;
		var targets = []
		this._rockBoard.actors.forEach(function(actor) {
			targets = targets.concat(actor.pieces);
		});

		this._rockBoard.ani.sequence(function(ani) {
			ani.wait(2000);
			ani.tween({
				targets: targets,
				property: 'scale',
				from: 0,
				to: 0.4,
				easing: 'easeOutCubic',
				duration: 1500,
				jitter: 0.04
			});
			//ani.invokeEach(function(actor) {
			//actor.hitDetection.enabled = true;
			//});
			ani.wait(3000);
			ani.tween({
				targets: targets,
				property: 'scale',
				from: 0.4,
				to: 1,
				easing: 'easeOutCubic',
				duration: 3000,
				jitter: 0.1
			});
			ani.tween({
				targets: targets,
				property: 'scale',
				from: 1,
				to: 1,
				duration: 2000
			});
			ani.tween({
				targets: targets,
				property: 'color',
				to: me._baseWaterColor,
				duration: 3000
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
		//this._frothBoard.addActor(new ParticleSystem({...
		//});
	}
};

