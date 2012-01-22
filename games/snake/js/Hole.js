(function() {
	var _holeConfig = {
		team: 'hole',
		hitDetection: {
			snake: function(tile, actor) {
				if(!tile.has('bridge')) {
					actor.die();
				}
			}
		}
	};

	snk.Hole = function(config) {
		var actor = new L7.Actor(_.extend(config, _holeConfig));
		return actor;
	};

})();


