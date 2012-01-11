(function() {
	L7.HitManager = function() {};

	L7.HitManager.prototype = {
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


