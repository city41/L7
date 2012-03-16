L7.useWebGL = true;

function onImagesLoaded(images) {
	var boards = [];

	var tileSize = 7;
	var borderWidth = 1;
	var borderWidths = [4, 0, 1, 2];
	var boardFillers = [i.BackgroundFiller, i.MidBackgroundFiller, i.MidForegroundFiller, i.ForegroundFiller];

	images.forEach(function(image, i) {
		var levelLoader = new L7.ColorLevelLoader(image, tileSize, borderWidths[i]);

		tileSize += 4;

		var board = levelLoader.load();
		board.parallaxRatio = i * 0.6;
		board.disableHitDetection = true;

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
		width: (b3.height * 2) * (b3.tileSize + b3.borderWidth) + b3.borderWidth,
		height: b3.height * (b3.tileSize + b3.borderWidth) + b3.borderWidth,
		initialAnchor: L7.p(),
		container: document.getElementById('container'),
		fpsContainer: document.getElementById('fpsContainer')
	});
	game.fpsContainer.innerHTML = 'webgl? ' + L7.useWebGL;

	var snake = new i.ClassicSnake({
		position: L7.p(-9, 15),
		direction: i.Direction.East,
		size: 4,
		active: false,
		rate: 250
	});

	boards[2].addActor(snake);

	var appleXs = [40, 100, 125];

	appleXs.forEach(function(x) {
		boards[2].addActor(new i.ClassicApple({
			position: L7.p(x, 15)
		}));
	});

	function doSnakeAnimation() {
		return;
		snake.ani.sequence({
			targets: [snake]
		},
		function(ani) {
			ani.wait(20000);

			// loop
			var startRate = snake.rate;
			var loopWait = startRate * 1.75;
			ani.setProperty({
				property: 'direction',
				value: i.Direction.South
			});
			ani.wait(loopWait);
			ani.setProperty({
				property: 'direction',
				value: i.Direction.West
			});
			ani.wait(loopWait);
			ani.setProperty({
				property: 'direction',
				value: i.Direction.North
			});
			ani.wait(loopWait);
			ani.setProperty({
				property: 'direction',
				value: i.Direction.East
			});
			ani.wait(3000);
			ani.tween({
				property: 'rate',
				from: startRate,
				to: startRate * 2,
				duration: 1000
			});
			ani.wait(4000);
			ani.setProperty({
				property: 'rate',
				value: startRate * 0.75
			});
			for (var k = 0; k < 5; ++k) {
				ani.setProperty({
					property: 'direction',
					value: i.Direction.South
				});
				ani.wait(loopWait);
				ani.setProperty({
					property: 'direction',
					value: i.Direction.East
				});
				ani.wait(loopWait);
				ani.setProperty({
					property: 'direction',
					value: i.Direction.North
				});
				ani.wait(loopWait);
				ani.setProperty({
					property: 'direction',
					value: i.Direction.East
				});
				ani.wait(loopWait);
			}
			ani.tween({
				property: 'rate',
				from: startRate * 0.75,
				to: startRate * 1.25,
				duration: 1000
			});
			ani.wait(32000);
			// this doesnt work quite right, needs to be nextPosition ill bet
			ani.invoke(function() {
				snake.pieces[0].position = L7.p(snake.pieces[0].position.x, 17);
			});
			ani.setProperty({
				property: 'direction',
				value: i.Direction.West
			});
			ani.wait(10000);
			ani.setProperty({
				property: 'active',
				value: false
			});

		});
	}

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
			doSnakeAnimation();
		});

		console.log('duration: ' + duration);
		ani.repeat(duration, function(ani) {
			ani.invoke(function() {
				game.viewport.scrollX(1);
			});
			ani.wait(10);
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

