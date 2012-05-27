(function() {
	L7.Frame = function(config) {
		_.extend(this, config);
		this.pieceSetIndex = this.pieceSetIndex || 0;
		this.reset();
	};

	L7.Frame.prototype = {
		reset: function() {
			this._elapsed = 0;
			this._curFrame = 0;
			this.done = false;
			this._initted = false;
		},

		_initTargets: function() {
			this.targets.forEach(function(target) {
				target.setFrame(this.pieceSetIndex, 0);
				target._frameDir = 1;
				target._curFrame = 0;
			},
			this);
		},

		update: function(delta, timestamp, board) {
			debugger;
			if (!this._initted) {
				this._initTargets();
				this._initted = true;
			}

			if (this.done || this.disabled) {
				return;
			}

			this._elapsed += delta;
			if (this._elapsed >= this.rate) {
				this._elapsed -= this.rate;
				this._nextFrame();
			}
		},

		_nextFrame: function() {
			var looping = this.looping;
			var psi = this.pieceSetIndex;

			this.targets.forEach(function(target) {
				var max = target.pieceSets[psi].length - 1;
				target._curFrame += target._frameDir;

				if (target._curFrame < 0) {
					target._curFrame = 1;
					target._frameDir = 1;
				}

				if (target._curFrame > max) {
					if (looping === 'backforth') {
						target._curFrame = max - 1;
						target._frameDir = - 1;
					} else {
						target._curFrame = 0;
					}
				}

				target.setFrame(psi, target._curFrame);
			});
		}
	}
})();

