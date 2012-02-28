L7.Keys.init();

function onImagesLoaded(images) {
	var boards = [];

	var tileSize = 7;
	var borderWidth = 1;
	var borderWidths = [3, 1, 1, 2];
	var boardFillers = [i.BackgroundFiller, i.MidBackgroundFiller, i.MidForegroundFiller, i.ForegroundFiller];

	images.forEach(function(image, i) {
		var levelLoader = new L7.ColorLevelLoader(image, tileSize, borderWidths[i]);

		tileSize += 4;

		var board = levelLoader.load();
		board.parallaxRatio = i * 0.6;

		if (boardFillers[i]) {
			boardFillers[i].fill(board);
		}

		boards.push(board);
	});

	var parallax = new L7.ParallaxBoard({
		boards: boards
	});

	var b3 = boards[3];

	var game = new L7.Game({
		board: parallax,
		width: (b3.height * 1.35) * (b3.tileSize + b3.borderWidth) + b3.borderWidth,
		height: b3.height * (b3.tileSize + b3.borderWidth) + b3.borderWidth,
		initialAnchor: L7.p(),
		container: document.getElementById('container')
	});

	var snake = new i.ClassicSnake({
		position: L7.p(5, 15),
		direction: i.Direction.East,
		size: 4,
		active: false,
		rate: 330
	});

	boards[2].addActor(snake);

	var appleXs = [40, 100, 125];

	appleXs.forEach(function(x) {
		boards[2].addActor(new i.ClassicApple({
			position: L7.p(x, 15)
		}));
	});

	// TODO: scrolling the viewport, not sure where to put this
	b3.ani.sequence(function(ani) {
		ani.wait(2000);
		
		var duration = (b3.tileSize + b3.borderWidth) * images[3].width;
		duration -= game.width;
		duration /= b3.parallaxRatio;
		duration = duration | 0;
		//var duration = 2530;

		ani.invoke(function() {
			snake.active = true;
		});

		console.log('duration: ' + duration);
		ani.repeat(duration, function(ani) {
			ani.invoke(function() {
				game.viewport.scrollX(1);
			});
			ani.wait(1);
		});
	});

	// for debug purposes
	var a = new L7.Actor({
		color: [0, 0, 0, 0],
		position: L7.p(500, 5),
		keyInputs: {
			left: {
				repeat: true,
				handler: function() {
					game.viewport.scrollX(-3);
				}
			},
			right: {
				repeat: true,
				handler: function() {
					game.viewport.scrollX(3);
				}
			}
		}
	});

	b3.addActor(a);
	game.go();
}

var imageLoader = new L7.ImageLoader({
	srcs: ["background.png", "midBackground.png", "midForeground.png", "foreground.png"],
	handler: onImagesLoaded,
	loadNow: true
});

