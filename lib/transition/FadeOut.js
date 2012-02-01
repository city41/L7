(function() {
	L7.FadeOut = function(config) {
		config.color = config.to;
		L7.FadeBase.call(this, config);
	};

	L7.FadeOut.prototype = new L7.FadeBase();

	L7.FadeOut.prototype.updateColor = function(color, percentage) {
		color[3] = percentage;
	};
})();



