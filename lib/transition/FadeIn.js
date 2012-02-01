(function() {
	L7.FadeIn = function(config) {
		config.color = config.from;
		L7.FadeBase.call(this, config);
	};

	L7.FadeIn.prototype = new L7.FadeBase();

	L7.FadeIn.prototype.updateColor = function(color, percentage) {
		color[3] = 1 - percentage;
	};
})();


