(function() {
	var _interval = 500;

	function getAlienConfig() {
		return {
			team: 'alien',
			onBoardSet: function() {
				this.ani.frame({
					targets: [this],
					pieceSetIndex: 0,
					rate: _interval,
					looping: 'circular',
					loops: Infinity
				});
			},

			timers: {
				move: {
					interval: _interval,
					handler: function() {
						this[this.direction](1);
						--this.horizontalSpanCount;
						if(this.horizontalSpanCount === 0) {
							this.drop();
						}
					}
				},
				fire: {
					interval: L7.rand(5000, 15000),
					handler: function() {
						this.fire();
						this.timers.fire.interval = L7.rand(5000, 15000);
						this.timers.fire.elapsed = 0;
					}
				}
			},
			drop: function() {
				this.goTo(this.position.add(0, this.verticalDrop));
				this.horizontalSpanCount = this.horizontalSpan;
				if(this.direction === 'right') {
					this.direction = 'left';
				} else {
					this.direction = 'right';
				}
			},
			fire: function() {
				var bulletPosition = this.position.add(L7.pr(this.framesConfig.width / 2, 0));
				this.board.addActor(new SI.AlienBullet(this.bulletConfig, bulletPosition));
			},
			die: function() {
				L7.Actor.prototype.die.apply(this, arguments);
				this.board.addActor(new SI.Explosion(this.explosionConfig, this.position));
			},
		};
	}

	SI.Alien = function(spriteConfig, explosionConfig, bulletConfig, movementConfig, position) {
		var config = _.extend(getAlienConfig(), spriteConfig);
		config.position = position;
		config.explosionConfig = explosionConfig;
		config.bulletConfig = bulletConfig;
		_.extend(config, movementConfig);
		config.horizontalSpanCount = movementConfig.horizontalSpan;
		config.direction = 'right';

		return new L7.Actor(config);
	};

})();

