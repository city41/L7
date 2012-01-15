(function() {
	function _isInteger(num) {
		return num === (num | 0);
	};

	L7.rand = function(minOrMax, maxOrUndefined) {
		var min = _.isNumber(maxOrUndefined) ? minOrMax : 0;
		var max = _.isNumber(maxOrUndefined) ? maxOrUndefined : minOrMax;

		var range = max - min;

		var result = Math.random() * range + min;
		if(_isInteger(min) && _isInteger(max)) {
			return Math.floor(result);
		} else {
			return result;
		}
	};
})();

