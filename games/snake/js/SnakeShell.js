(function() {
	snk.SnakeShell = function(config) {
		_.extend(this, config);

		this._handlers = [];
		this.pieces = [];

		this.pushHandler(config.handler);
		this.grow(this.position);
	};

	snk.SnakeShell.prototype = new L7.Actor();

	_.extend(snk.SnakeShell.prototype, {
		team: 'snake',

		pushHandler: function(handler) {
			this._handlers.push(handler);
			handler.init(this, true);
		},

		popHandler: function() {
			this._handlers.pop();
			if (this._handlers.length) {
				this._handlers.last.init(this);
			}
		},

		grow: function(position) {
			this.pieces.add(position);
		},

		prune: function(index) {

		},

		render: function(context, offsetX, offsetY) {

		}
	});
})();

