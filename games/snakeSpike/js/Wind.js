(function() {
	function _calculateInterval(weight, force) {
		return (200 + (90 * weight)) / force
	}

	var _delta = L7.p(-1, 0);

	snk.Wind = function(config) {
		_.extend(this, config || {});
		this.force = this.force || 1;
	};

	snk.Wind.prototype.update = function(delta, timestamp, board) {
		board.actors.forEach(function(actor) {
			if (actor.weight) {
				actor.windInterval = actor.windInterval || _calculateInterval(actor.weight, this.force);

				actor.curWindInterval = actor.curWindInterval || 0;
				actor.curWindInterval += delta;

				if(actor.curWindInterval >= actor.windInterval) {
					actor.curWindInterval -= actor.windInterval;
					board.moveActor({
						actor: actor,
						delta: _delta
					});
				}
			}
		}, this);
	};

})();

