(function() {
	var _wallConfig = {
		team: 'wall',
		color: [100, 100, 100, 1]
	};

	snk.Wall = function(config) {
		var actor = new L7.Actor(_.extend(config, _wallConfig));
		return actor;
	};

})();



