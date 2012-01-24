(function() {
	var _snakeConfig = {
		color: [100, 100, 200, 1],
		movementVelocity: 0.2,
		pullVelocity: 0.2,
		team: 'snake',
		active: true,

		hitDetection: {
			enabled: function() {
				return this.active;
			},
			snake: function() {
				this.die();
			},
			apple: function(tile, actor) {
				actor.die();
			},
			hole: function() {
				this.die();
			},
			finish: function() {
				this.active = false;
				if(!this.congratulated) {
					alert('congrats!');
					this.congratulated = true;
				}
			}
		},

		keyInputs: {
			up: {
				repeat: true,
				handler: function(delta) {
					var proposedPosition = this.position.add(0, - this.movementVelocity * delta || 0);
					var tile = this.board.tileAtPixels(proposedPosition);

					if(tile.has('hole')) {
						this.position = L7.p(this.position.x, this.board.tileBottomInPixels(tile));
					} else {
						this.position = proposedPosition;
					}
				}
			},
			down: {
				repeat: true,
				handler: function(delta) {
					var proposedPosition = this.position.add(0, this.movementVelocity * delta || 0);
					var tile = this.board.tileAtPixels(proposedPosition.add(0, this.board.tileSize));

					if(tile.has('hole')) {
						this.position = L7.p(this.position.x, this.board.tileTopInPixels(tile.up()));
					} else {
						this.position = proposedPosition;
					}
				}
			}
		},

		update: function(delta, timestamp) {
			if(!this.active) {
				return;
			}
			L7.Actor.prototype.update.call(this, delta, timestamp);

			this.position = this.position.add(this.pullVelocity * delta, 0);
			this.board.viewport.centerOn(this.position);
			this.detectHits();
		},

		die: function() {
			this.active = false;
			this.color = [255,0,0,1]
			this.board.borderFill = 'red';
		},

		detectHits: function() {
			var tile = this.board.tileAtPixels(this.position.add(this.board.tileSize/2, this.board.tileSize/2));

			for(var team in this.hitDetection) {
				if(this.hitDetection.hasOwnProperty(team)) {
					tile.each(function(inhabitant) {
						if(inhabitant.owner && inhabitant.owner.team === team) {
							this.hitDetection[team].call(this, tile, inhabitant.owner);
						}
					},this);
				}
			}
		}
	};

	snk.FreeSnake = function(config) {
		var actor = new L7.Actor(_.extend(config, _snakeConfig));
		return actor;
	};

})();

