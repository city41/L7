(function() {
	var _islandConfig = {
		team: 'island',
		color: [255, 255, 0, 1]
	};

	snk.Island = function(config) {
		var actor = new L7.Actor(_.extend(config, _islandConfig));
		return actor;
	};

})();

