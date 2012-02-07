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
		tween: function(config) {
			config.targets = this._owner.pieces;
			var tween = new L7.Tween(config);

			if (this._buildStack.length === 0) {
				this._getBoard().addDaemon(tween);
			} else {
				this._buildStack.last.children.add(tween);
			}

			return tween;
		},
		sequence: function(builder) {
			var sequence = new L7.Sequence();

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
		}
	};

})();

