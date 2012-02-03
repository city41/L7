(function() {
	snake.ClassicIntroBoard = function(image, pixelWidth, pixelHeight) {
		var borderWidth = 3;
		var tileSize = pixelWidth / image.width - borderWidth;

		var loader = new L7.LevelLoader({
			image: image,
			legend: {
				'#000000': {
					tag: 'outofbounds',
					color: [121, 127, 121, 1]
				},
				'#0000FF': {
					tag: 'floor',
					color: [238, 244, 237, 1]
				},
				'#00FF00': {
					tag: 'wall',
					color: [61, 66, 61, 1]
				},
				'#FF0000': {
					tag: 'floor',
					constructor: snake.ClassicApple,
					color: [238, 244, 237, 1]
				}
			},
			boardConfig: {
				tileSize: tileSize,
				borderWidth: borderWidth,
				borderFill: '#BAC1B8'
			}
		});
		var level = loader.load();

		_.extend(this, level.board);

		this.addActor(new snake.ClassicSnake({
			position: L7.p(8, 11),
			direction: snake.Direction.North,
			size: 2,
			active: true,
			rate: 400
		}));
	};

	snake.ClassicIntroBoard.prototype = {
	};
})();

