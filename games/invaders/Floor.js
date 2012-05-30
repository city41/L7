(function() {
	function getFloorConfig() {
		return {
			team: 'floor',
			takeDamageAt: function(position) {
				var piece = this.pieceAt(position);
				piece.color = [0, 0, 0, 1];
			}
		};
	}

	SI.Floor = function(position, width) {
		var config = getFloorConfig();

		config.position = position;
		config.color = [57, 255, 30, 1];
		config.shape = [[]];
		while (width--) {
			config.shape[0].push(1);
		}
		config.shape[0][0] = 5;

		return new L7.Actor(config);
	};

})();

