(function() {
	var _playerConfig = {
		onOutOfBounds: function() {
			this.goBack();
		},
		keyInputs: {
			w: {
				repeat: true,
				handler: function() {
					this.up(1);
					this.positionFlame();
				}
			},
			a: {
				repeat: true,
				handler: function() {
					this.left(1);
					this.positionFlame();
				}
			},
			s: {
				repeat: true,
				handler: function() {
					this.down(1);
					this.positionFlame();
				}
			},
			d: {
				repeat: true,
				handler: function() {
					this.right(1);
					this.positionFlame();
				}
			},
			left: {
				repeat: false,
				handler: function() {
					this.flameThrower.angle = 180;
				}
			},
			right: {
				repeat: false,
				handler: function() {
					this.flameThrower.angle = 0;
				}
			},
			up: {
				repeat: false,
				handler: function() {
					this.flameThrower.angle = 270;
				}
			},
			down: {
				repeat: false,
				handler: function() {
					this.flameThrower.angle = 90;
				}
			}
		},
		color: [0, 0, 255, 1],
		update: function(delta, timestamp) {
			L7.Actor.prototype.update.apply(this, arguments);

			if (this.board) {
				this.flameThrower.update(delta, timestamp, this.board);
			}
		},
		positionFlame: function() {
			this.flameThrower.position = this.position.clone();
		}
	};

	p.Player = function(config) {
		var config = _.extend(_playerConfig, config);

		var actor = new L7.Actor(config);
		actor.flameThrower = new L7.ParticleSystem({
			totalParticles: 90,
			duration: Infinity,
			gravity: L7.p(0, 0),
			centerOfGravity: L7.p(),
			angle: 0,
			angleVar: 20,
			speed: 10,
			speedVar: 2,
			radialAccel: 0,
			radialAccelVar: 0,
			tangentialAccel: 0,
			tangentialAccelVar: 0,
			position: actor.position.clone(),
			posVar: L7.p(),
			life: 1,
			lifeVar: 0.2,
			emissionRate: 90 / 1,
			startColor: L7.Color.fromFloats(0.76, 0.25, 0.12, 1),
			startColorVar: [0, 0, 0, 0],
			endColor: [0, 0, 0, 0],
			endColorVar: [0, 0, 0, 0],
			active: true
		});
		return actor;
	};
})();

