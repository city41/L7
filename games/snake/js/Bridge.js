(function() {
	var _bridgeConfig = {
		team: 'bridge',
		color: [100, 120, 50, 1],
	};

	snk.Bridge = function(config) {
		var actor = new L7.Actor(_.extend(config, _bridgeConfig));
		return actor;
	};

})();





