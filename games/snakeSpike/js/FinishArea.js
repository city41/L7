(function() {
	var _enabled = true;
	var _finishAreaConfig = {
		team: 'finish',
		color: [255, 255, 255, 1],
		hitDetection: {
			enabled: function() {
				return _enabled;
			},
			snake: function() {
				_enabled = false;
				alert('congrats!');
			}
		}
	};

	snk.FinishArea = function(config) {
		var actor = new L7.Actor(_.extend(config, _finishAreaConfig));
		return actor;
	};

})();




