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

		this.inhabitants = _.clone(config.inhabitants || []);
		this.position = L7.p(this.x, this.y);
	};

	L7.Tile.prototype = {
		at: function(index) {
			return this.inhabitants[index];
		},
		each: function(operation) {
			this.inhabitants.forEach(operation);
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
		render: function() {
			var args = _.toArray(arguments);
			if (this.sprite) {
				this.sprite.render.apply(this.sprite, arguments);
			}

			this.each(function(inhabitant) {
				inhabitant.render.apply(inhabitant, args);
			});
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

