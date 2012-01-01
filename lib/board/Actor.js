(function() {
	var _defaults = {
			position: L7.p(0, 0),
			shape: [[5]],
			sprite: 'orange',
			keyInputs: {}
	};

	L7.Actor = function(config) {
		_.extend(this, _defaults, config || {});
	};

	Object.defineProperty(L7.Actor, 'ANCHOR', {
		get: function() {
			return 5
		},
		enumerable: false
	});

})();

