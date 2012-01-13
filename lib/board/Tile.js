(function() {
	var _defaults = {
		color: [0, 0, 0, 1]
	};

	L7.Tile = function(config) {
		config = _.extend(config || {}, _defaults);

		if (!_.isNumber(config.x)) {
			throw new Error("Tile: x is required");
		}

		if (!_.isNumber(config.y)) {
			throw new Error("Tile: y is required");
		}

		this.x = config.x;
		this.y = config.y;
		this.color = config.color;

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
			var color;
			if (this.inhabitants.length === 0) {
				color = this.color;
			} else {
				var topInhab = this.inhabitants[this.inhabitants.length - 1];

				if (L7.Color.isOpaque(topInhab.color)) {
					color = topInhab.color;
				} else {
					var base = this.color.slice(0);
					color = L7.Color.composite(base, topInhab.color);
				}
			}

			var css = L7.Color.toCssString(color);
			return css;
		},

		getColorSimple: function() {
			if (this.inhabitants.length > 0) {
				return this.inhabitants.last.color;
			}
			else {
				return this.color;
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

