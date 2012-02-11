(function() {
	var _idCounter = 0;

	function getLastActor(tile) {
		return tile.inhabitants && tile.inhabitants.length && tile.inhabitants.last.owner;
	}

	function random11() {
		return L7.rand(-1, 1, true);
	}

	function toRadians(degs) {
		degs = degs || 0;
		return (degs * Math.PI) / 180;
	}

	L7.ParticleSystem = function(config) {
		_.extend(this, config);
		this._particles = [];
		this.id = _idCounter++;

		for (var i = 0; i < this.totalParticles; ++i) {
			this._particles.push({});
		}

		this._elapsed = 0;
		this._emitCounter = 0;
		this._particleIndex = 0;
		this._particleCount = 0;
		this.active = this.active || false;
	};

	L7.ParticleSystem.prototype = {
		onRemove: function(board) {
			board.actorsOnTeam('particle-' + this.id).forEach(function(actor) {
				board.removeActor(actor);
			});
		},

		_isFull: function() {
			return this._particleCount === this.totalParticles;
		},

		_initParticle: function(particle) {
			// position
			particle.rx = this.position.x + this.posVar.x * random11();
			particle.ry = this.position.y + this.posVar.y * random11();

			// direction
			var a = toRadians(this.angle + this.angleVar * random11());
			var v = L7.p(Math.cos(a), Math.sin(a));
			var s = this.speed + this.speedVar * random11();
			v = v.multiply(s);
			particle.dir = v;

			// radial accel
			particle.radialAccel = this.radialAccel + this.radialAccelVar * random11();

			if(!!particle.radialAccel) {
				particle.radialAccel = 0;
			}

			// tangential accel
			particle.tangentialAccel = this.tangentialAccel + this.tangentialAccelVar * random11();
			if(!particle.tangentialAccel) {
				particle.tangentialAccel = 0;
			}

			// life
			var life = this.life + this.lifeVar * random11();
			particle.life = Math.max(0, life);

			// color
			var startColor = [
			this.startColor[0] + this.startColorVar[0] * random11(), this.startColor[1] + this.startColorVar[1] * random11(), this.startColor[2] + this.startColorVar[2] * random11(), this.startColor[3] + this.startColorVar[3] * random11()];

			var endColor = [
			this.endColor[0] * this.endColorVar[0] * random11(), this.endColor[1] * this.endColorVar[1] * random11(), this.endColor[2] * this.endColorVar[2] * random11(), this.endColor[3] * this.endColorVar[3] * random11()];

			particle.color = startColor;
			particle.deltaColor = [(endColor[0] - startColor[0]) / particle.life, (endColor[1] - startColor[1]) / particle.life, (endColor[2] - startColor[2]) / particle.life, (endColor[3] - startColor[3]) / particle.life];

			// TODO: skipping size for now (may do scale?)
			if (!_.isUndefined(this.startSize)) {
				var startSize = this.startSize + this.startSizeVar * random11();
				startSize = Math.max(0, startSize);
				particle.size = startSize;
				if (!_.isUndefined(this.endSize)) {
					var endSize = this.endSize + this.endSizeVar * random11();
					particle.deltaSize = (endSize - startSize) / particle.life;
				} else {
					particle.deltaSize = 0;
				}
			} else {
				particle.size = 1;
				particle.deltaSize = 0;
			}
		},

		_addParticle: function() {
			if (this._isFull()) {
				return false;
			}

			var p = this._particles[this._particleCount];
			this._initParticle(p); ++this._particleCount;

			return true;
		},

		update: function(delta, timestamp, board) {
			if (!this.active) {
				return;
			}

			delta = delta / 1000;

			if (this.emissionRate) {
				var rate = 1.0 / this.emissionRate;
				this._emitCounter += delta;

				while (!this._isFull() && this._emitCounter > rate) {
					this._addParticle();
					this._emitCounter -= rate;
				}

			}

			this._elapsed += delta;
			this.active = this._elapsed < this.duration;

			this._particleIndex = 0;

			while (this._particleIndex < this._particleCount) {
				var p = this._particles[this._particleIndex];
				this._updateParticle(p, delta, this._particleIndex);
			}

			this._updateBoard(board);
		},

		_updateParticle: function(p, delta, i) {
			if (p.life > 0) {
				var tmp = L7.p();
				var radial = L7.p();
				var tangential = L7.p();

				if (p.rx !== 0 && p.ry !== 0) {
					radial = L7.p(p.rx, p.ry).normalize();
				}

				tangential = radial.clone();

				radial.x *= p.radialAccel;
				radial.y *= p.radialAccel;

				var newy = tangential.x;
				tangential.x = - tangential.y;
				tangential.y = newy;
				tangential.x *= p.tangentialAccel;
				tangential.y *= p.tangentialAccel;

				tmp.x = radial.x + tangential.x + this.gravity.x;
				tmp.y = radial.y + tangential.y + this.gravity.y;

				tmp.x *= delta;
				tmp.y *= delta;

				p.dir.x += tmp.x;
				p.dir.y += tmp.y;

				tmp.x = p.dir.x * delta;
				tmp.y = p.dir.y * delta;

				p.rx += tmp.x;
				p.ry += tmp.y;

				p.x = Math.round(p.rx);
				p.y = Math.round(p.ry);

				p.color[0] += p.deltaColor[0] * delta;
				p.color[1] += p.deltaColor[1] * delta;
				p.color[2] += p.deltaColor[2] * delta;
				p.color[3] += p.deltaColor[3] * delta;

				p.size += p.deltaSize * delta;
				p.size = Math.max(0, p.size);

				p.life -= delta;

				++this._particleIndex;
			} else {
				var temp = this._particles[i];
				this._particles[i] = this._particles[this._particleCount - 1];
				this._particles[this._particleCount - 1] = temp;

				--this._particleCount;
			}
		},

		_updateBoard: function(board) {
			board.actorsOnTeam('particle-' + this.id).forEach(function(actor) {
				board.removeActor(actor);
			});

			var offBoardCount = 0;

			for (var i = 0; i < this._particleCount; ++i) {
				var p = this._particles[i];
				var tile = board.tileAt(p.x, p.y);

				if (tile) {
					var actor = getLastActor(tile);

					if (actor) {
						actor.color = L7.Color.composite(actor.color, p.color);
					} else {
						board.addActor(new L7.Actor({
							position: tile.position,
							color: p.color.slice(0),
							team: 'particle-' + this.id,
							scale: p.size
						}));
					}
				} else {
					++offBoardCount;
				}

				if (offBoardCount === this._particleCount) {
					console.log('all are off the board :-/');
				}
				//board.dump();
			}
		}
	}

})();

