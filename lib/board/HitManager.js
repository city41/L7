(function() {
	L7.HitManager = function() {};

	L7.HitManager.prototype = {
		detectHitsForActor: function(actor) {
			var l = actor.pieces.length;
			while(l--) {
				var piece = actor.pieces[l];
				var tile = actor.board.tileAt(piece.position);
				if(tile) {
					this._detectTileHits(tile);
				}
			}
		},

		detectHits: function(tiles) {
			tiles.forEach(function(tile) {
				this._detectTileHits(tile);
			},
			this);
		},

		_detectTileHits: function(tile) {

			tile.each(function(inhabitant) {
				if (_.isObject(inhabitant.owner) && _.isObject(inhabitant.owner.hitDetection)) {
					if (typeof inhabitant.owner.hitDetection.enabled === 'undefined' || inhabitant.owner.hitDetection.enabled.call(inhabitant.owner)) {

						_.each(inhabitant.owner.hitDetection, function(hitHandler, hitType) {
							if(tile.tag === hitType) {
								hitHandler.call(inhabitant.owner, tile, tile);
							}

							tile.each(function(otherInhabitant) {
								if (otherInhabitant !== inhabitant && otherInhabitant.owner && otherInhabitant.owner.team === hitType) {
									hitHandler.call(inhabitant.owner, tile, otherInhabitant.owner);
								}
							},
							this);
						},
						this);

					}
				}
			},
			this);
		}
	};

})();


