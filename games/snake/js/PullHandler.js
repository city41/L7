(function() {
	snk.PullHandler = function(config) {
		_.extend(this, config);
	};

	snk.PullHandler.prototype = {
		movementVelocity: 0.3,
		movementAcceleration: 0.002,
		pullVelocity: 0.17,
		color: [100, 100, 200, 1],
		keyInputs: {
			up: {
				repeat: true,
				handler: function(delta) {
					this.movementVelocity = this._calcMovementVelocity(this.movementVelocity, this.upAcceleration, this.maxUpVelocity, delta);

					var proposedPosition = this.position.add(0, this.movementVelocity * delta || 0);
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
					this.movementVelocity = this._calcMovementVelocity(this.movementVelocity, this.downAcceleration, this.maxDownVelocity, delta);

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
		onNoKeyDown: function(delta) {
			if (this.movementVelocity < 0) {
				this.movementVelocity += this.downAcceleration * delta;
			}
			if (this.movementVelocity > 0) {
				this.movementVelocity += this.upAcceleration * delta;
			}
		},

		_calcMovementVelocity: function(currentVelocity, acceleration, maxVelocity, delta) {
			currentVelocity += (acceleration * delta);

			if (maxVelocity < 0 && currentVelocity < maxVelocity) {
				currentVelocity = maxVelocity;
			}

			if (maxVelocity > 0 && currentVelocity > maxVelocity) {
				currentVelocity = maxVelocity;
			}

			return currentVelocity;

		},

		update: function(delta, timestamp) {
			if (!this.active) {
				return;
			}
			L7.Actor.prototype.update.call(this, delta, timestamp);

			this.position = this.position.add(this.pullVelocity * delta, 0);
			this.board.viewport.centerOn(this.position);
		},

		init: function(snake, isFirstTime) {
			_.extend(snake, this);

			snake.position = snake.positionInPixels();
			snake.positioningType = 'pixel';
			
			this.board.removeActor(snake);
			this.board.removeFreeActor(snake);
			this.board.addFreeActor(snake);

			snake.maxUpVelocity = - Math.abs(snake.movementVelocity);
			snake.maxDownVelocity = Math.abs(snake.movementVelocity);

			snake.upAcceleration = - Math.abs(snake.movementAcceleration);
			snake.downAcceleration = Math.abs(snake.movementAcceleration);
			snake.movementVelocity = 0;

		}
	};
})();

