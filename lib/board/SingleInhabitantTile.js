(function() {
	L7.SingleInhabitantTile = function(config) {
		config = config || {};

		if (!_.isNumber(config.x)) {
			throw new Error("Tile: x is required");
		}

		if (!_.isNumber(config.y)) {
			throw new Error("Tile: y is required");
		}

		this.x = config.x;
		this.y = config.y;
		this.color = config.color;
		this.scale = config.scale;

		if(!_.isNumber(this.scale)) {
			this.scale = 1;
		}

		this.board = config.board;

		this.inhabitant = _.isArray(config.inhabitants) ? config.inhabitants[0] : null;

		this.position = L7.p(this.x, this.y);
		this.colors = [];
		this.composite = [];
	}

	L7.SingleInhabitantTile.prototype = {
		at: function(index) {
			return this.inhabitant;
		},
		each: function(operation, scope) {
			this.inhabitant && operation.call(scope, this.inhabitant);
		},
		add: function(inhabitant) {
			this.inhabitant = inhabitant;
		},
		remove: function(inhabitant) {
			if(this.inhabitant === inhabitant) {
				this.inhabitant = null;
			}
		},
		has: function(team) {
			if(this.tag === team) {
				return true;
			}
			return this.inhabitant && this.inhabitant.team === team;
		},
		hasOther: function(team, actor) {
			throw new Error("not implemented");
			if(this.tag === team) {
				return true;
			}
			return this.inhabitants.some(function(inhabitant) {
				return inhabitant.team === team || (inhabitant.owner && inhabitant.owner.team === team) && inhabitant.owner !== actor;
			});
		},

		getColor: function(skipInhabitants) {
			var c = 0;

			if(this.color) {
				this.colors[c++] = this.color;
			}

			if(skipInhabitants !== false && this.inhabitant && this.inhabitant.color) {
				this.colors[c++] = this.inhabitant.color;
			}

			if(this.overlayColor) {
				this.colors[c++] = this.overlayColor;
			}

			if(this.colors[c-1] && this.colors[c-1][3] === 1) {
				return this.colors[c-1];
			}

			if(c > 0) {
				L7.Color.composite(this.colors, c, this.composite);
				if(this.opaque) {
					this.composite[3] = 1;
				}
				return this.composite;
			}
		},

		getScale: function() {
			return (this.inhabitant && this.inhabitant.color && this.inhabitant.scale) || this.scale;
		},

		getOffset: function() {
			return this.inhabitant && this.inhabitant.offset;
		},

		up: function() {
			return this.board && this.board.tileAt(this.position.up());
		},
		down: function() {
			return this.board && this.board.tileAt(this.position.down());
		},
		left: function() {
			return this.board && this.board.tileAt(this.position.left());
		},
		right: function() {
			return this.board && this.board.tileAt(this.position.right());
		}
	};

	Object.defineProperty(L7.SingleInhabitantTile.prototype, 'count', {
		get: function() {
			if(this.inhabitant) {
				return 1;
			} else {
				return 0;
			}
		},
		enumerable: true
	});
})();

