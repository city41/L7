(function() {
	L7.TransitionFadeIn = function(config) {
		config.color = config.from;
		L7.FadeBase.call(this, config);
	};

	L7.TransitionFadeIn.prototype = new L7.FadeBase();

	L7.TransitionFadeIn.prototype.updateColor = function(color, percentage) {
		color[3] = 1 - percentage;
	};
})();


