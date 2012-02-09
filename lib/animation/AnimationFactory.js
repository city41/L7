(function() {
	L7.AnimationFactory = function(owner, board) {
		this._owner = owner;
		this._board = board;
		this._buildStack = [];
		this._targetStack = [];
	};

	L7.AnimationFactory.prototype = {
		_getBoard: function() {
			return this._board || this._owner.board;
		},
		_determineTargets: function(targetOptions) {
			if(targetOptions.targets) {
				return targetOptions.targets;
			} else {
				return this._owner.getAnimationTargets(targetOptions.filter);
			}
		},
		_addParentAnimation: function(builder, targetOptions, AniConstructor, consArg) {
			var ani = new AniConstructor(consArg);

			if(targetOptions) {
				var targets = this._determineTargets(targetOptions);
				this._targetStack.push(targets);
			}

			this._buildStack.push(ani);
			builder(this);
			this._buildStack.pop();
			if(targetOptions) {
				this._targetStack.pop();
			}

			if (this._buildStack.length === 0) {
				this._getBoard().addDaemon(ani);
			} else {
				this._buildStack.last.children.add(ani);
			}
			return ani;
		},
		_addAnimation: function(config, AniConstructor) {
			if (!config.targets) {
				if(typeof config.filter !== 'undefined') {
					config.targets = this._owner.getAnimationTargets(config.filter);
				} else if(this._targetStack.length > 0) {
					config.targets = this._targetStack.last;
				} else {
					config.targets = this._owner.getAnimationTargets();
				}
			}

			var ani = new AniConstructor(config);

			if (this._buildStack.length === 0) {
				this._getBoard().addDaemon(ani);
			} else {
				this._buildStack.last.children.add(ani);
			}
			return ani;
		},
		disco: function(config) {
			return this._addAnimation(config, L7.Disco);
		},
		shimmer: function(config) {
			return this._addAnimation(config, L7.Shimmer);
		},
		setProperty: function(config) {
			config.duration = 0;
			config.from = config.to = config.value;
			return this.tween(config);
		},
		tween: function(config) {
			return this._addAnimation(config, L7.Tween);
		},
		sequence: function(targetOptionsOrBuilder, builderOrUndefined) {
			return this.repeat(1, targetOptionsOrBuilder, builderOrUndefined);
		},
		together: function(targetOptionsOrBuilder, builderOrUndefined) {
			var targetOptions;
			var builder;

			if (_.isFunction(targetOptionsOrBuilder)) {
				builder = targetOptionsOrBuilder;
			} else {
				targetOptions = targetOptionsOrBuilder;
				builder = builderOrUndefined;
			}

			return this._addParentAnimation(builder, targetOptions, L7.Together);
		},

		repeat: function(count, targetOptionsOrBuilder, builderOrUndefined) {
			var targetOptions;
			var builder;

			if (_.isFunction(targetOptionsOrBuilder)) {
				builder = targetOptionsOrBuilder;
			} else {
				targetOptions = targetOptionsOrBuilder;
				builder = builderOrUndefined;
			}

			return this._addParentAnimation(builder, targetOptions, L7.Repeat, count);
		},

		wait: function(millis) {
			return this._addAnimation({
				duration: millis
			},
			L7.Wait);
		},

		invoke: function(func) {
			return this._addAnimation({
				func: func
			},
			L7.Invoke);
		}
	};

})();

