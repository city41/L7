(function() {
	var _snakeConfig = {
		color: [100, 100, 200, 1],
		movementVelocity: 0.2,
		pullVelocity: 0.2,
		team: 'snake',
		active: true,

		hitDetection: {
			apple: {
				type: 'overlap',
				handler: function(tile, actor) {
					actor.die();
				}
			},
			hole: {
				type: 'center',
				handler: function() {
					this.die();
				}
			},
			finish: {
				type: 'center',
				handler: function() {
					this.active = false;
					if (!this.congratulated) {
						alert('congrats!');
						this.congratulated = true;
					}
				}
			}
		},

		keyInputs: {
			up: {
				repeat: true,
				handler: function(delta) {
					var proposedPosition = this.position.add(0, - this.movementVelocity * delta || 0);
					var tile = this.board.tileAtPixels(proposedPosition);

					if (tile.has('hole')) {
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
					// for now, our height is equal to board.tileSize
					var tile = this.board.tileAtPixels(proposedPosition.add(0, this.board.tileSize));

					if (tile.has('hole')) {
						this.position = L7.p(this.position.x, this.board.tileTopInPixels(tile.up()));
					} else {
						this.position = proposedPosition;
					}
				}
			}
		},

		update: function(delta, timestamp) {
			if (!this.active) {
				return;
			}
			L7.Actor.prototype.update.call(this, delta, timestamp);

			this.position = this.position.add(this.pullVelocity * delta, 0);
			this.board.viewport.centerOn(this.position);
			this.detectHits();
		},

		die: function() {
			this.active = false;
			this.color = [255, 0, 0, 1]
			this.board.borderFill = 'red';
		},

		_getOverlappingTiles: function(position) {
			var fullTile = this.board.tileSize;
			var halfTile = fullTile / 2;
			var centerTile = this.board.tileAtPixels(position.x + halfTile, position.y + halfTile);

			var corners = [];
			corners.push(this.board.tileAtPixels(position));
			corners.push(this.board.tileAtPixels(position.x + fullTile, position.y));
			corners.push(this.board.tileAtPixels(position.x + fullTile, position.y + fullTile));
			corners.push(this.board.tileAtPixels(position.x, position.y + fullTile));

			return {
				center: centerTile,
				corners: corners
			};
		},

		_detectTileHit: function(tile, team, detector) {
			tile.each(function(inhabitant) {
				if (inhabitant.owner && inhabitant.owner.team === team) {
					detector.handler.call(this, tile, inhabitant.owner);
				}
			},
			this);
		},

		detectHits: function() {
			var detector, tiles = this._getOverlappingTiles(this.position);

			for (var team in this.hitDetection) {
				if (this.hitDetection.hasOwnProperty(team)) {

					detector = this.hitDetection[team];

					if (detector.type === 'center') {
						this._detectTileHit(tiles.center, team, detector);
					} else if (detector.type === 'overlap') {
						tiles.corners.forEach(function(tile) {
							this._detectTileHit(tile, team, detector);
						},
						this);
					}
				}
			}
		}
	};

	snk.FreeSnake = function(config) {
		var actor = new L7.Actor(_.extend(config, _snakeConfig));
		return actor;
	};

})();

