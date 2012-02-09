(function() {
	L7.AnimationFactory = function(owner, board) {
		this._owner = owner;
		this._board = board;
		this._buildStack = [];
	};

	L7.AnimationFactory.prototype = {
		_getBoard: function() {
			return this._board || this._owner.board;
		},
		disco: function(config) {
			if (!config.targets) {
				config.targets = this._owner.getAnimationTargets(config.filter);
			}

			var disco = new L7.Disco(config);

			if (this._buildStack.length === 0) {
				this._getBoard().addDaemon(disco);
			} else {
				this._buildStack.last.children.add(disco);
			}

			return disco;
		},
		shimmer: function(config) {
			if (!config.targets) {
				config.targets = this._owner.getAnimationTargets(config.filter);
			}

			var shimmer = new L7.Shimmer(config);

			if (this._buildStack.length === 0) {
				this._getBoard().addDaemon(shimmer);
			} else {
				this._buildStack.last.children.add(shimmer);
			}

			return shimmer;
		},
		setProperty: function(config) {
			config.duration = 0;
			config.from = config.to = config.value;
			return this.tween(config);
		},
		tween: function(config) {
			if (!config.targets) {
				config.targets = this._owner.getAnimationTargets(config.filter);
			}

			var tween = new L7.Tween(config);

			if (this._buildStack.length === 0) {
				this._getBoard().addDaemon(tween);
			} else {
				this._buildStack.last.children.add(tween);
			}

			return tween;
		},
		sequence: function(builder) {
			var sequence = new L7.Repeat(1);

			this._buildStack.push(sequence);
			builder(this);
			this._buildStack.pop();

			if (this._buildStack.length === 0) {
				this._getBoard().addDaemon(sequence);
			} else {
				this._buildStack.last.children.add(sequence);
			}

			return sequence;
		},
		together: function(builder) {
			var together = new L7.Together();

			this._buildStack.push(together);
			builder(this);
			this._buildStack.pop();

			if (this._buildStack.length === 0) {
				this._getBoard().addDaemon(together);
			} else {
				this._buildStack.last.children.add(together);
			}

			return together;
		},

		repeat: function(count, builder) {
			var repeat = new L7.Repeat(count);

			this._buildStack.push(repeat);
			builder(this);
			this._buildStack.pop();

			if (this._buildStack.length === 0) {
				this._getBoard().addDaemon(repeat);
			} else {
				this._buildStack.last.children.add(repeat);
			}

			return repeat;
		},

		wait: function(millis) {
			var wait = new L7.Wait(millis);

			if(this._buildStack.length === 0) {
				this._getBoard().addDaemon(wait);
			} else {
				this._buildStack.last.children.add(wait);
			}

			return wait;
		},

		invoke: function(func) {
			var invoke = new L7.Invoke(func);

			if(this._buildStack.length === 0) {
				this._getBoard().addDaemon(invoke);
			} else {
				this._buildStack.last.children.add(invoke);
			}

			return invoke;
		}
	};

})();

