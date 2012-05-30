(function() {
	var _hitManager = new L7.HitManager();

	function getBarrierConfig() {
		return {
			team: 'barrier',
			hitDetection: {
				alienBullet: function(tile, bullet) {
					bullet.die();
					this.takeDamageAt(tile.position);
				},
				playerBullet: function(tile, bullet) {
					bullet.die(true);
					this.takeDamageAt(tile.position);
				}
			},
			update: function() {
				L7.Actor.prototype.update.apply(this, arguments);
				_hitManager.detectHitsForActor(this);
			},
			takeDamageAt: function(position) {
				var piecesToRemoveFromBoard = [];
				this.damageConfig.position = position.subtract(L7.pr(this.damageConfig.framesConfig.width / 2, this.damageConfig.framesConfig.height / 3));

				this.damageConfig.pieces.forEach(function(damagePiece) {
					var barrierPiece = this.pieceAt(damagePiece.position);
					if (barrierPiece) {
						this.pieces.remove(barrierPiece);
						piecesToRemoveFromBoard.push(barrierPiece);
					}
				},
				this);

				this.board.removePieces(piecesToRemoveFromBoard);
			}
		};
	}

	SI.Barrier = function(spriteConfig, damageConfig, position) {
		var config = _.extend(getBarrierConfig(), spriteConfig);
		config.position = position;
		config.damageConfig = new L7.Actor(damageConfig);

		return new L7.Actor(config);
	};

})();

