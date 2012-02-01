(function() {
	snk.VerticalPullHandler = function(config) {
		_.extend(this, config);
	};

	snk.VerticalPullHandler.prototype = {
		movementVelocity: 0.3,
		movementAcceleration: 0.002,
		pullVelocity: 0.17,
		color: [100, 100, 200, 1],
		keyInputs: {
			left: {
				repeat: true,
				handler: function(delta) {
					this.movementVelocity = this._calcMovementVelocity(this.movementVelocity, this.leftAcceleration, this.maxLeftVelocity, delta);

					var proposedPosition = this.position.add(this.movementVelocity * delta || 0, 0);
					var tile = this.board.tileAtPixels(proposedPosition);

					if (tile.has('hole')) {
						this.position = L7.p(this.board.tileRightInPixels(tile), this.position.y);
					} else {
						this.position = proposedPosition;
					}
				}
			},
			right: {
				repeat: true,
				handler: function(delta) {
					this.movementVelocity = this._calcMovementVelocity(this.movementVelocity, this.rightAcceleration, this.maxRightVelocity, delta);

					var proposedPosition = this.position.add(this.movementVelocity * delta || 0, 0);
					// for now, our height is equal to board.tileSize
					var tile = this.board.tileAtPixels(proposedPosition.add(this.board.tileSize, 0));

					if (tile.has('hole')) {
						this.position = L7.p(this.board.tileLeftInPixels(tile.left()));
					} else {
						this.position = proposedPosition;
					}
				}
			}
		},
		onNoKeyDown: function(delta) {
			if (this.movementVelocity < 0) {
				this.movementVelocity += this.rightAcceleration * delta;
			}
			if (this.movementVelocity > 0) {
				this.movementVelocity += this.leftAcceleration * delta;
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

			this.position = this.position.add(0, -this.pullVelocity * delta);
			this.board.viewport.centerOn(this.position);
		},

		init: function(snake, isFirstTime) {
			_.extend(snake, this);

			snake.position = snake.positionInPixels();
			snake.positioningType = 'pixel';
			
			this.board.removeActor(snake);
			this.board.removeFreeActor(snake);
			this.board.addFreeActor(snake);

			snake.maxLeftVelocity = - Math.abs(snake.movementVelocity);
			snake.maxRightVelocity = Math.abs(snake.movementVelocity);

			snake.leftAcceleration = - Math.abs(snake.movementAcceleration);
			snake.rightAcceleration = Math.abs(snake.movementAcceleration);
			snake.movementVelocity = 0;

		}
	};
})();

