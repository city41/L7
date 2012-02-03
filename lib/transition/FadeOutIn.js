(function() {
	L7.FadeOutIn = function(config) {
		_.extend(this, config);
		_.bindAll(this, '_onFadeOutComplete', '_onFadeInComplete');

		this.delegate = new L7.FadeOut({
			board: this.fromBoard,
			to: this.color,
			duration: this.duration / 2,
			onComplete: this._onFadeOutComplete
		});
	};

	L7.FadeOutIn.prototype = {
		_onFadeOutComplete: function() {
			this.delegate = new L7.FadeIn({
				board: this.toBoard,
				from: this.color,
				duration: this.duration / 2,
				onComplete: this._onFadeInComplete
			});
			this.delegate.viewport = this.viewport;
		},

		_onFadeInComplete: function() {
			if (this.onComplete) {
				this.onComplete();
			} else if (this.game) {
				this.game.replaceBoard(this.toBoard);
			}
		},

		update: function() {
			this.delegate.update.apply(this.delegate, arguments);
		},
		render: function() {
			this.delegate.render.apply(this.delegate, arguments);
		}
	};

	Object.defineProperty(L7.FadeOutIn.prototype, 'viewport', {
		set: function(viewport) {
			this._viewport = viewport;
			if (this.delegate) {
				this.delegate.viewport = viewport;
			}
		},
		get: function() {
			return this._viewport;
		},
		enumerable: true
	});
})();

