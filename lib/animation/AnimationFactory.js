(function() {
	L7.AnimationFactory = function(owner, board) {
		this._owner = owner;
		this._board = board;
		this._buildStack = [];
		this._targetStack = [];
		this._addedAnis = [];
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
		_addAnimationToBoard: function(ani) {
			this._addedAnis.push(ani);
			this._getBoard().addDaemon(ani);
		},
		_addParentAnimation: function(builder, targetOptions, AniConstructor, consArg) {
			var ani = new AniConstructor(consArg);

			if(targetOptions) {
				var targets = this._determineTargets(targetOptions);
				if(!_.isArray(targets)) {
					targets = [targets];
				}
				this._targetStack.push(targets);
			}

			this._buildStack.push(ani);
			builder(this);
			this._buildStack.pop();
			if(targetOptions) {
				this._targetStack.pop();
			}

			if (this._buildStack.length === 0) {
				this._addAnimationToBoard(ani);
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

			if(!_.isArray(config.targets)) {
				config.targets = [config.targets];
			}

			var ani = new AniConstructor(config);

			if (this._buildStack.length === 0) {
				this._addAnimationToBoard(ani);
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
		plasma: function(config) {
			return this._addAnimation(config, L7.Plasma);
		},
		setProperty: function(config) {
			config.duration = 0;
			config.from = config.to = config.value;
			return this.tween(config);
		},
		copyProperty: function(config) {
			return this._addAnimation(config, L7.CopyProperty);
		},
		tween: function(config) {
			return this._addAnimation(config, L7.Tween);
		},
		frame: function(config) {
			return this._addAnimation(config, L7.Frame);
		},
		fadeIn: function(config) {
			return this._addAnimation(config, L7.FadeIn);
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
			return this.waitBetween(millis, millis);
		},

		waitBetween: function(min, max) {
			return this._addAnimation({
				min: min,
				max: max
			},
			L7.Wait);
		},

		invoke: function(func) {
			return this._addAnimation({
				func: func
			},
			L7.Invoke);
		},

		end: function() {
			var rootAni = this._buildStack.first;

			if(rootAni) {
				var me = this;
				return this.invoke(function() {
					me._getBoard().removeDaemon(rootAni);
				});
			}
		},

		die: function() {
			var board = this._getBoard();
			this._addedAnis.forEach(function(ani) {
				board.removeDaemon(ani);
			});
		}
	};

})();

