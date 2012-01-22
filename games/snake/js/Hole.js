(function() {
	var _holeConfig = {
		team: 'hole',
		color: [0, 0, 0, 0],
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


