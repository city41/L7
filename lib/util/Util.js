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
})();

