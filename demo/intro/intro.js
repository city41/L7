L7.useWebGL = ! (window.location.href.toLowerCase().indexOf('canvas') > 0);

function fadeInBoard(board, duration) {
	var targets = board.query(function(tile) {
		return tile.color && tile.color[3] !== 0;
	});
	var tilesNeedingOpaque = board.query(function(tile) {
		return tile.color && tile.color[3] === 1;
	});
	tilesNeedingOpaque.forEach(function(tile) {
		tile.opaque = true;
	});

	board.ani.sequence({
		targets: targets
	},
	function(ani) {
		ani.copyProperty({
			srcProperty: 'overlayColor',
			destProperty: '_overlayColorSaved'
		});
		ani.tween({
			property: 'overlayColor',
			from: [0, 0, 0, 1],
			to: [0, 0, 0, 0],
			duration: duration
		});
		ani.copyProperty({
			srcProperty: '_overlayColorSaved',
			destProperty: 'overlayColor'
		});
	});

}

function onImagesLoaded(images) {
	var boards = [];

	var borderWidth = 1;
	var borderWidths = [4, 0, 1, 2, 0, 0];
	var tileSizes = [7, 11, 15, 19, 6, 6];
	var fadeDuration = [10000, 9000, 7000, 4000];
	var boardFillers = [i.BackgroundFiller, i.MidBackgroundFiller, i.MidForegroundFiller, i.ForegroundFiller, null, i.ChromeFiller];

	images.forEach(function(image, i) {
		var tileSize = tileSizes[i];
		var levelLoader = new L7.ColorLevelLoader(image, tileSize, borderWidths[i]);

		var board = levelLoader.load();
		board.parallaxRatio = i * 0.6;
		board.disableHitDetection = true;

		if (boardFillers[i]) {
			boardFillers[i].fill(board);
		}

		if (fadeDuration[i]) {
			fadeInBoard(board, fadeDuration[i]);
		}

		boards.push(board);
	});

	var parallax = new L7.ParallaxBoard({
		boards: boards
	});

	var foreground = boards[3];
	var chrome = boards.last;
	chrome.offsetY = - foreground.pixelHeight;
	chrome.parallaxRatio = 0;

	var fpsContainer = document.getElementById('fpsContainer');
	if (window.location.href.toLowerCase().indexOf('showfps') > 0) {
		fpsContainer.style.display = '';
	} else {
		fpsContainer.style.display = 'none';
	}

	var game = new L7.Game({
		board: parallax,
		width: foreground.pixelHeight * 3,
		height: foreground.pixelHeight + chrome.pixelHeight,
		initialAnchor: L7.p(),
		container: document.getElementById('introContainer'),
		fpsContainer: fpsContainer
	});
	game.fpsContainer.innerHTML = 'webgl? ' + L7.useWebGL;
	game.paused = true;

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

	var overlay = boards[4];
	overlay.clicked = function() {
		game.paused = false;
		i.ChromeFiller._addPauseButton(chrome);
	};

	// TODO: scrolling the viewport, not sure where to put this
	foreground.ani.together(function(ani) {
		ani.sequence(function(ani) {
			ani.tween({
				targets: overlay.tiles,
				property: 'color',
				to: [0, 0, 0, 0],
				duration: 0
			});
			ani.wait(500);
			ani.invoke(function() {
				overlay.destroy();
				boards.remove(overlay);
			});
		});

		ani.sequence(function(ani) {
			ani.wait(5000);

			var duration = (foreground.tileSize + foreground.borderWidth) * images[3].width;
			duration -= game.width;
			duration -= 85; // arbitrarily choosing where to center the title
			duration /= foreground.parallaxRatio;
			duration = duration | 0;
			//var duration = 2530;
			ani.invoke(function() {
				snake.active = true;
				doSnakeAnimation();
			});

			ani.repeat(duration, function(ani) {
				ani.invoke(function() {
					game.viewport.scrollX(1);
				});
				ani.wait(10);
			});
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

if (L7.isSupportedBrowser) {
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
			srcs: ["background.png", "midBackground.png", "midForeground.png", "foreground.png", "overlay.png", "chrome.png"],
			handler: onImagesLoaded,
			loadNow: true
		});
	});

} else {
	var container = document.getElementById('introContainer');
	container.innerHTML = '<img id="browserSupportImg" src="browserSupportBigG.gif" alt="supported browsers" /><div>Sorry, your browser is lacking features needed by Lab Adder. So far Lab Adder works in Chrome (recommended) or the latest Firefox</div>';
}

