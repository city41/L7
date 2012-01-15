(function() {
	function _createShape(size) {
		var shape = [];

		var anchor = Math.floor(size / 2);

		for(var y = 0; y < size; ++y) {
			var row = [];
			for(var x = 0; x < size; ++x) {
				if(x === anchor && y === anchor) {
					row.push(L7.Actor.ANCHOR);
				} else if(Math.random() < .20) {
					row.push(0);
				} else {
					row.push(1);
				}
			}
			shape.push(row);
		}

		return shape;
	}

	var _asteroidConfig = {


	};

	snk.Asteroid = function(config) {
		config.shape = _createShape(config.size)
		config.weight = config.size;
		var actor = new L7.Actor(_.extend(_asteroidConfig, config));

		return actor;
	};


})();


