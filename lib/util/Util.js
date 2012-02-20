(function() {
	function _isInteger(num) {
		return num === (num | 0);
	};

	L7.rand = function(minOrMax, maxOrUndefined, dontFloor) {
		if(_.isUndefined(dontFloor)) {
			dontFloor = false;
		}

		var min = _.isNumber(maxOrUndefined) ? minOrMax : 0;
		var max = _.isNumber(maxOrUndefined) ? maxOrUndefined : minOrMax;

		var range = max - min;

		var result = Math.random() * range + min;
		if(_isInteger(min) && _isInteger(max) && !dontFloor) {
			return Math.floor(result);
		} else {
			return result;
		}
	};

	L7.coin = function() {
		return L7.rand(0, 2) === 0;
	};

	L7.degreesToRadians = function(degrees) {
		degrees = degrees || 0;
		return degrees * Math.PI / 180;
	};

	L7.radiansToDegrees = function(radians) {
		radians = radians || 0;
		return radians * 180 / Math.PI;
	};
})();

