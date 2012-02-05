Wave = function(config) {
	_.extend(this, config);

	this._frothColor = [255, 255, 255, 0.8];
	this._froth = [];
	this._initWave();

	this._shimmer = new Shimmer({
		tiles: this.board.tiles,
		minAlpha: 0.2,
		maxAlpha: 0.8,
		baseRate: 1200,
		rateVariance: 0.2
	});

	this._millisPerTile = this.baseSpeed / this.board.width;
};

Wave.prototype = {
	_initWave: function() {
		this._froth.forEach(function(tile) {
			tile.color = tile._origColor;
		});

		var seed = this.board.tileAt(0, 0);
		seed._origColor = seed.color;
		seed.color = this._frothColor.slice(0);

		this._froth = [seed];

		this._tileMovementElapsed = 0;
		this._waveWait = this.baseInterval;
		this._waveActive = false;
	},

	_moveFroth: function() {
		var newFroth = [];

		if (!this._froth.last.right()) {
			this._initWave();
			return;
		}

		this._froth.forEach(function(tile) {
			tile.color = tile._origColor;
			var next = tile.right();
			if (next) {
				next._origColor = next.color;
				next.color = this._frothColor.slice(0);
				newFroth.push(next);
			}
		},
		this);

		var down = this._froth.last.down();
		if (down) {
			down._origColor = down.color;
			down.color = this._frothColor.slice(0);
			newFroth.push(down);
		}
		this._froth = newFroth;
	},

	update: function(delta, timestamp, board) {
		this._shimmer.update(delta, timestamp, board);

		if (this._waveActive) {
			this._tileMovementElapsed += delta;
			if (this._tileMovementElapsed >= this._millisPerTile) {
				this._tileMovementElapsed -= this._millisPerTile;
				this._moveFroth();
			}
		} else {
			this._waveWait -= delta;
			if (this._waveWait < 0) {
				this._waveWait = this.baseInterval;
				this._waveActive = true;
			}
		}
	}
};

