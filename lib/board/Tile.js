(function() {
	L7.Tile = function(config) {
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

		this.inhabitants = _.clone(config.inhabitants || []);
		this.position = L7.p(this.x, this.y);
	};

	L7.Tile.prototype = {
		at: function(index) {
			return this.inhabitants[index];
		},
		each: function(operation, scope) {
			this.inhabitants.forEach(operation, scope);
		},
		add: function(inhabitant) {
			this.inhabitants.push(inhabitant);
		},
		remove: function(inhabitant) {
			this.inhabitants.remove(inhabitant);
		},
		has: function(team) {
			return this.inhabitants.some(function(inhabitant) {
				return inhabitant.team === team || (inhabitant.owner && inhabitant.owner.team === team);
			});
		},
		hasOther: function(team, actor) {
			return this.inhabitants.some(function(inhabitant) {
				return inhabitant.team === team || (inhabitant.owner && inhabitant.owner.team === team) && inhabitant.owner !== actor;
			});
		},

		getColor: function() {
			// TODO: this needs to get majorly refactor, lots of branching going on in here
			var color;
			if (this.inhabitants.length === 0 || !this.inhabitants[this.inhabitants.length -1].color) {
				color = this.color;
			} else {
				var topInhab = this.inhabitants[this.inhabitants.length - 1];

				if (L7.Color.isOpaque(topInhab.color) || ! this.color) {
					color = topInhab.color;
				} else {
					var base = this.color.slice(0);
					color = L7.Color.composite(base, topInhab.color);
				}
			}

			if (this.overlayColor) {
				if (!color || L7.Color.isOpaque(this.overlayColor)) {
					color = this.overlayColor;
				} else {
					color = L7.Color.composite(color.slice(0), this.overlayColor);
				}
			}

			if (color) {
				var css = L7.Color.toCssString(color);
				return css;
			}
		},

		getScale: function() {
			if (this.inhabitants.length === 0 || !this.inhabitants.last.color) {
				return this.scale;
			} else {
				return this.inhabitants.last.scale;
			}
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

	Object.defineProperty(L7.Tile.prototype, 'count', {
		get: function() {
			return this.inhabitants.length;
		},
		enumerable: true
	});
})();

