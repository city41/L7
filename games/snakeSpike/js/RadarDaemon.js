(function() {
	var _overlayColor = [255, 255, 255, 1];

	snk.RadarDaemon = function(config) {
		_.extend(this, config);

		this.apples.forEach(function(apple) {
			apple.on('death', this._onAppleDeath, this);
		}, this);
	};

	snk.RadarDaemon.prototype = {
		_onAppleDeath: function(apple) {
			this.apples.remove(apple);
		},
		_getNearestApple: function() {
			if(this.apples.length === 0) {
				return null;
			}

			var nearestApple;
			var bestDistance = 2000000;


			this.apples.forEach(function(apple) {
				var distance = apple.position.distanceFrom(this.snake.position);
				if(distance < bestDistance) {
					bestDistance = distance;
					nearestApple = apple;
				}
			}, this);

			return nearestApple;
		},

		update: function(delta, timestamp, board) {
			if (this._lastTile) {
				delete this._lastTile.overlayColor;
			}

			var nearestApple = this._getNearestApple();

			if(nearestApple) {
				var beaconPosX, beaconPosY;
				var delta = nearestApple.position.delta(this.snake.position);

				if(Math.abs(delta.x) < Math.abs(delta.y)) {
					beaconPosY = this.snake.position.y;
					if(delta.x > 0) {
						beaconPosX = this.snake.position.x + 1;
					} else {
						beaconPosX = this.snake.position - 1;
					}
				} else {
					beaconPosX = this.snake.position.x;
					if(delta.y > 0) {
						beaconPosY = this.snake.position.y + 1;
					} else {
						beaconPosY = this.snake.position.y - 1;
					}
				}

				this._lastTile = board.tileAt(beaconPosX, beaconPosY);
				
				if(this._lastTile) {
					this._lastTile.overlayColor = _overlayColor;
				}
			}
		}

	};

})();

