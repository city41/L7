(function() {
	function random11() {
		return L7.rand(-1, 1);
	}

	L7.ParticleSystem = function(config) {
		_.extend(this, config);
		this._particles = [];

		for(var i = 0; i < this.totalParticles; ++i) {
			this._particles.push({});
		}

		this._elapsed = 0;
		this._emitCounter = 0;
		this._particleIndex = 0;
		this._particleCount = 0;
		this.active = false;
	};

	L7.ParticleSystem.prototype = {
		_isFull: function() {
			return this._particleCount === this.totalParticles;
		},

		_initParticle: function(particle) {
			// position
			particle.x = (this.centerOfGravity.x + this.posVar.x * random11()) | 0;
			particle.y = (this.centerOfGravity.y + this.posVar.y * random11()) | 0;

			// direction
			var a = toRadians(this.angle + this.angleVar * random11());
			var v = L7.p(Math.cos(a), Math.sin(a));
			var s = this.speed + this.speedVar * random11();
			v = v.multiply(s);
			particle.dir = v;

			// radial accel
			particle.radialAccel = this.radialAccel + this.radialAccelVar * random11();

			// tangential accel
			particle.tangentialAccel = this.tangentialAccel + this.tangentialAccelVar * random11();

			// life
			var life = this.life * this.lifeVar * random11();
			particle.life = Math.max(0, life);

			// color
			var startColor = [
				this.startColor[0] + this.startColorVar[0] * random11(),
				this.startColor[1] + this.startColorVar[1] * random11(),
				this.startColor[2] + this.startColorVar[2] * random11(),
				this.startColor[3] + this.startColorVar[3] * random11()
			];

			var endColor = [
				this.endColor[0] * this.endColorVar[0] * random11(),
				this.endColor[1] * this.endColorVar[1] * random11(),
				this.endColor[2] * this.endColorVar[2] * random11(),
				this.endColor[3] * this.endColorVar[3] * random11()
			];

			particle.color = startColor;
			particle.deltaColor = [
				(endColor[0] - startColor[0]) / particle.life,
				(endColor[1] - startColor[1]) / particle.life,
				(endColor[2] - startColor[2]) / particle.life,
				(endColor[3] - startColor[3]) / particle.life
			];

			// TODO: skipping size for now (may do scale?)
			
			particle.startPos = this.position;
		},

		_addParticle: function() {
			if(this._isFull()) {
				return false;
			}

			var p = this._particles[this._particleCount];
			this._initParticle(p);
			++this._particleCount;

			return true;
		},

		update: function(delta, timestamp, board) {
			if(this.active && this.emissionRate) {
				var rate = 1.0 / this.emissionRate;
				this._emitCounter += delta;

				while(!this._isFull() && this._emitCounter > rate) {
					this._addParticle();
					this._emitCounter -= rate;
				}

				this._elapsed += delta;

				if(this._elapsed >= this.duration) {
					this._stopSystem();
				}
			}

			this._particleIndex = 0;

			while(this._particleIndex < this._particleCount) {
				var p = this._particles[this._particleIndex];
				this._updateParticle(p, delta, this._particleIndex);
			}
		},

		_updateParticle: function(p, delta, i) {
			if(p.life > 0) {

			} else {
				var temp = this._particles[i];
				this._particles[i] = this._particles[this._particleCount - 1];
				this._particles[this._particleCount - 1] = temp;

				--.this._particleCount;
			}
		}
	}

})();

