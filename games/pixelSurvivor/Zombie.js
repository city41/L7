(function() {
	var _zombieConfig = {
		life: 1,
		hitDetection: {
			flame: function(tile, actor) {
				this.life -= actor.life;
				this.pieces[0].color[1] = 255 * this.life;
				if(this.life < 0 && this.board) {
					this.board.removeActor(this);
				}
			}
		},
		color: [0, 255, 0, 1],
		moveTowards: function(pos) {
			var delta = pos.delta(this.position);
			delta = delta.normalize().round();

			var newPosition = this.position.add(delta);
			this.goTo(newPosition);
		},

		update: function() {
			if (!this._aniAdded) {
				this._addAni();
				this._aniAdded = true;
			}
			L7.Actor.prototype.update.apply(this, arguments);
		},
		_addAni: function() {
			var me = this;
			this.ani.repeat(Infinity, function(ani) {
				ani.wait(me.rate);
				ani.invoke(function() {
					if (me.player) {
						me.moveTowards(me.player.position)
					}
				});
			});
		}
	};

	p.Zombie = function(config) {
		config = _.extend(config, _zombieConfig);

		return new L7.Actor(config);
	};
})();

