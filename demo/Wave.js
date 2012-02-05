Wave = function(config) {
	_.extend(this, config);

	this._frothColor = [255, 255, 255, 0.8];
	this._froth = [];
	this._initWave();
	var waterTag = this.waterTag;

	this._shimmer = new Shimmer({
		tiles: this.board.tiles,
		minAlpha: 0.3,
		maxAlpha: 0.7,
		baseRate: 1000,
		rateVariance: 0.2,
		skip: 'rock',
		whenScale: 0.2
	});

	this._frothRate = this.baseSpeed / this.board.width;
	this._waveWait = this.baseInterval;
	this._tileMovementElapsed = 0;

	this._addRockActors();
};

Wave.prototype = {
	_addRockActors: function() {
		this.board.query(function(tile) {
			return tile.has('rock');
		}).forEach(function(tile) {
			var actor = new L7.Actor({
				position: tile.position,
				color: [20, 10, 0, 1],
			});

			actor.pieces.forEach(function(piece) {
				piece.scale = 0.0;
			});

			this.board.addActor(actor);

			tile.color = this.board.tiles.first.color.slice(0);
		},
		this);
	},

	_initWave: function() {
		var rand, x;

		this.board.tiles.forEach(function(tile) {
			tile.color = tile._origColor || tile.color;
		});

		this._froth = [L7.p( - 2, 0)];
		for (var y = 1; y < this.board.height; ++y) {
			rand = Math.random();
			if (rand < 0.2) {
				x = - 3;
			} else if (rand < 0.4) {
				x = - 1;
			} else {
				x = - 2;
			}
			this._froth.push(L7.p(x, y));
		}

	},

	_moveFroth: function() {
		this._froth.forEach(function(pos, i, frothArray) {
			var tile = this.board.tileAt(pos);
			if (tile) {
				//tile.color = tile._origColor;
				tile.color = [43, 169, 201, 1];
				tile._colorRecoveryRate = [];
				tile._origColor.forEach(function(channel, i) {
					tile._colorRecoveryRate.push((channel - tile.color[i]) / this.baseInterval);
				},
				this);
				//tile.color = tile._origColor.slice(0);
				//tile.color[0] *= 0.7;
				//tile.color[1] *= 0.7;
				//tile.color[2] *= 0.7;
			}
			frothArray[i] = pos = pos.right();
			tile = this.board.tileAt(pos);
			if (tile) {
				tile._origColor = tile.color;
				tile.color = this._frothColor.slice(0);
				if (tile.has('rock')) {
					this._frothBreakOn(tile);
				}
			}
		},
		this);
		if (this._froth.first.x >= this.board.width + 3) {
			this._waveActive = false;
			this._tileMovementElapsed = 0;
			this._waveWait = this.baseInterval;
			this._oneWaveDone = true;
		}
	},

	_frothBreakOn: function(tile) {
		if(tile.inhabitants.last.scale < 0.5) {
			return;
		}

		this._frothBreak = this._frothBreak || [];
		var neighbors = [tile.left(), tile.up(), tile.down()];

		neighbors.forEach(function(neighbor) {
			if (neighbor && ! neighbor.has('rock')) {
				this._frothBreak.push(neighbor);
				neighbor._origColor = neighbor.color;
				neighbor.color = [255, 255, 255, 0.8];
				neighbor._colorRecoveryRate = [];
				neighbor._origColor.forEach(function(channel, i) {
					neighbor._colorRecoveryRate.push((channel - neighbor.color[i]) / this.baseInterval);
				},
				this);
			}
		},
		this);
	},

	_recoverColors: function(tiles, delta) {
		if (tiles.first._colorRecoveryRate) {
			tiles.forEach(function(tile) {
				if (tile._colorRecoveryRate) {
					tile.color.forEach(function(channel, i, c) {
						tile.color[i] = channel + tile._colorRecoveryRate[i] * delta;
					});
				}
			});
		}
	},

	update: function(delta, timestamp, board) {
		this._shimmer.update(delta, timestamp, board);

		if (this._waveActive) {
			this._tileMovementElapsed += delta;
			if (this._tileMovementElapsed >= this._frothRate) {
				this._tileMovementElapsed -= this._frothRate;
				this._moveFroth();
			}
		} else {
			this._waveWait -= delta;
			this._recoverColors(this.board.tiles, delta);
			if (this._waveWait < 0) {
				this._waveWait = this.baseInterval;
				this._waveActive = true;
				this._initWave();
			}
		}

		if (this._frothBreak) {
			//this._recoverColors(this._frothBreak);
		}

		if (this._oneWaveDone) {
			this.board.actors.forEach(function(actor) {
				var scale = actor.pieces.first.scale;
				if (scale < 1.25) {
					scale += delta * 0.0006;
					actor.pieces.first.scale = scale;
				} else if(!this._deshimmeredRocks) {
					this._deshimmeredRocks = true;
					var waterTag = this.waterTag;
					this._shimmer.tiles = this.board.query(function(tile) {
						return tile.has(waterTag);
					});
				}
			}, this);
		}
	}
};

