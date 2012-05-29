(function() {
	var _hitManager = new L7.HitManager();

	function getFloorConfig() {
		return {
			hitDetection: {
				alienBullet: function(tile, bullet) {
					var piece = this.pieceAt(tile.position.x, tile.position.y);
					piece.color = [0,0,0,1];
					bullet.die();
				}
			},
			update: function() {
				L7.Actor.prototype.update.apply(this, arguments);
				_hitManager.detectHitsForActor(this);
			}
		};
	}

	SI.Floor = function(position, width) {
		var config = getFloorConfig();

		config.position = position;
		config.color = [57, 255, 30, 1];
		config.shape = [[]];
		while(width--) {
			config.shape[0].push(1);
		}
		config.shape[0][0] = 5;

		return new L7.Actor(config);
	};

})();

