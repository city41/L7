(function() {
	SI.IntroBoard = function(image, tileSize) {
		var levelLoader = new L7.ColorLevelLoader(image, tileSize, 0);
		var board = levelLoader.load();

		board.addActor(new L7.Actor({
			keyInputs: {
				' ': {
					repeat: false,
					handler: function() {
						board.fireEvent('startGame');
					}
				}
			}
		}));

		return board;
	};
})();

