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
		_addParentAnimation: function(builder, AniConstructor, consArg) {
			var ani = new AniConstructor(consArg);

			this._buildStack.push(ani);
			builder(this);
			this._buildStack.pop();

			if(this._buildStack.length === 0) {
				this._getBoard().addDaemon(ani);
			} else {
				this._buildStack.last.children.add(ani);
			}
			return ani;
		},
		_addAnimation: function(config, AniConstructor) {
			if(!config.targets) {
				config.targets = this._owner.getAnimationTargets(config.filter);
			}

			var ani = new AniConstructor(config);

			if(this._buildStack.length === 0) {
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
		sequence: function(builder) {
			return this._addParentAnimation(builder, L7.Repeat, 1);
		},
		together: function(builder) {
			return this._addParentAnimation(builder, L7.Together);
		},

		repeat: function(count, builder) {
			return this._addParentAnimation(builder, L7.Repeat, count);
		},

		wait: function(millis) {
			return this._addAnimation({ duration: millis }, L7.Wait);
		},

		invoke: function(func) {
			return this._addAnimation({ func: func }, L7.Invoke);
		}
	};

})();

