L7.useWebGL = true;

function onImagesLoaded(images) {
	var boards = [];

	var borderWidth = 1;
	var borderWidths = [4, 0, 1, 2, 1];
	var tileSizes = [7, 11, 15, 19, 6];
	var boardFillers = [i.BackgroundFiller, i.MidBackgroundFiller, i.MidForegroundFiller, i.ForegroundFiller];

	images.forEach(function(image, i) {
		var tileSize = tileSizes[i];
		var levelLoader = new L7.ColorLevelLoader(image, tileSize, borderWidths[i]);


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

	var foreground = boards[3];
	var chrome = boards.last;
	chrome.offsetY = -foreground.pixelHeight;
	chrome.parallaxRatio = 0;

	var game = new L7.Game({
		board: parallax,
		width: foreground.pixelHeight * 3,
		height: foreground.pixelHeight + chrome.pixelHeight,
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

	var appleXs = [40, 100, 102, 105, 106, 110, 125];

	appleXs.forEach(function(x) {
		var apple = new i.ClassicApple({
			position: L7.p(x, 15)
		});
		boards[2].addActor(apple);

		apple.ani.repeat(Infinity, function(ani) {
			ani.tween({
				property: 'scale',
				from: 1,
				to: 0.8,
				duration: 500
			});
			ani.wait(200);
			ani.tween({
				property: 'scale',
				from: 0.8,
				to: 1,
				duration: 500
			});
		});
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
	foreground.ani.sequence(function(ani) {
		ani.wait(2000);

		var duration = (foreground.tileSize + foreground.borderWidth) * images[3].width;
		duration -= game.width;
		duration /= foreground.parallaxRatio;
		duration = duration | 0;
		//var duration = 2530;
		ani.invoke(function() {
			snake.active = true;
			doSnakeAnimation();
		});

		console.log('duration: ' + duration);
		ani.repeat(duration, function(ani) {
			ani.invoke(function() {
				//game.viewport.scrollX(1);
			});
			ani.wait(10);
		});
	});

	//foreground.ani.repeat(20, function(ani) {
		//ani.waitBetween(1000, 6000);
		//ani.invoke(function() {
			//i.sounds.computer.play();
		//});
	//});

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

	foreground.addActor(a);

	//i.sounds.bubbles.play();

	game.go();


}

soundManager.onready(function() {
	i.sounds = {
		bubbles: soundManager.createSound({
			id: 'bubbles',
			url: 'audio/bubbles.mp3'
		}),
		computer: soundManager.createSound({
			id: 'computer',
			url: 'audio/computer.mp3'
		})
	};

	var imageLoader = new L7.ImageLoader({
		srcs: ["background.png", "midBackground.png", "midForeground.png", "foreground.png", "chrome.png"],
		handler: onImagesLoaded,
		loadNow: true
	});
});

