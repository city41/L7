(function() {
	var _waterConfig = {
		team: 'water',
		color: [20, 20, 220, 1],
		hitDetection: {
			snake: function(tile, actor) {
				if(!tile.has('bridge')) {
					actor.die();
				}
			}
		}
	};

	snk.Water = function(config) {
		var actor = new L7.Actor(_.extend(config, _waterConfig));
		return actor;
	};

})();

