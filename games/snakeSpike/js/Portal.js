(function() {
	var _orangeColor = [200, 170, 12, 1];
	var _blueColor = [100, 120, 200, 1];

	var _portalConfig = {
		team: 'portal',
		hitDetection: {
			snake: function(tile, actor) {
				if(!tile.position.equals(actor.position)) {
					return;
				}
				if(tile.position.equals(this.orangePiece.position)) {
					actor.position = this.bluePiece.position;
				} else {
					actor.position = this.orangePiece.position;
				}
			}
		}
	};

	snk.Portal = function(config) {
		var actor = new L7.Actor(_.extend(config, _portalConfig));
		
		actor.pieces = [
			new L7.Piece({
				position: config.bluePosition,
				color: _blueColor,
				owner: actor,
				portalType: 'blue'
			}),
			new L7.Piece({
				position: config.orangePosition,
				color: _orangeColor,
				owner: actor,
				portalType: 'orange'
			})
		];

		actor.bluePiece = actor.pieces[0];
		actor.orangePiece = actor.pieces[1];

		return actor;
	};

})();

