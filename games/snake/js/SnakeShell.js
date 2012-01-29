(function() {
	snk.SnakeShell = function(config) {
		L7.Actor.call(this, config);
		_.extend(this, config);

		this._handlers = [];

		this.pushHandler(config.handler);
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

		prune: function(index) {

		},

		render: function(context, offsetX, offsetY) {

		},

		positionInPixels: function() {
			if(this.positioningType === 'pixel') {
				return this.position;
			} else {
				return this.board.pixelsForTile(this.board.tileAt(this.position));
			}
		},
		positionInTiles: function() {
			if(this.positioningType === 'tile') {
				return this.position;
			} else {
				return this.board.tileAtPixels(this.position).position;
			}
		}
	});
})();

