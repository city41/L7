L7.useWebGL = ! (window.location.href.toLowerCase().indexOf('canvas') > 0);

function lightSwitchBoard(board, delay, overlayColor, volume) {
	var targets = board.query(function(tile) {
		return tile.color && tile.color[3] !== 0;
	});
	board.ani.sequence({
		targets: targets
	},
	function(ani) {
		ani.copyProperty({
			srcProperty: 'overlayColor',
			destProperty: '_overlayColorSaved'
		});
		ani.copyProperty({
			srcProperty: 'opaque',
			destProperty: '_opaqueSaved'
		});
		ani.setProperty({
			property: 'opaque',
			value: true
		});
		ani.setProperty({
			property: 'overlayColor',
			value: overlayColor || [0, 0, 0, 1]
		});
		ani.wait(delay);
		ani.invoke(function() {
			i.sounds.
			switch.play({
				volume: volume
			});
		});
		ani.copyProperty({
			srcProperty: '_overlayColorSaved',
			destProperty: 'overlayColor'
		});
		ani.copyProperty({
			srcProperty: '_opaqueSaved',
			destProperty: 'opaque'
		});
		ani.invoke(function() {
			delete board.standardBorderColor;
			board.borderFill = [0,0,0,1];
		});
	});

}

function onImagesLoaded(images) {
	var boards = [];

	var borderWidth = 1;
	var borderWidths = [4, 0, 1, 2, 0, 0, 0];
	var tileSizes = [7, 11, 15, 19, 6, 6, 6];
	var lightSwitchDelay = [16000, 13000, 9800, 5700];
	var lightSwitchColors = [[40, 40, 40, 1], undefined, undefined, undefined];
	var lightSwitchVolumes = [20, 40, 60, 90];
	var boardFillers = [i.BackgroundFiller, i.MidBackgroundFiller, i.MidForegroundFiller, i.ForegroundFiller, undefined, i.ChromeFiller, undefined];

	images.forEach(function(image, i) {
		var tileSize = tileSizes[i];
		var levelLoader = new L7.ColorLevelLoader(image, tileSize, borderWidths[i]);

		var board = levelLoader.load();
		board.parallaxRatio = i * 0.6;
		board.disableHitDetection = true;

		if (boardFillers[i]) {
			boardFillers[i].fill(board);
		}

		if (lightSwitchDelay[i]) {
			lightSwitchBoard(board, lightSwitchDelay[i], lightSwitchColors[i], lightSwitchVolumes[i]);
		}

		boards.push(board);
	});

	boards[0].borderFill = lightSwitchColors[0];

	var parallax = new L7.ParallaxBoard({
		boards: boards
	});

	var foreground = boards[3];
	var chrome = boards[boards.length - 2];
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

	var outro = boards.last;
	outro.parallaxRatio = 0;
	outro.visible = false;
	outro.tiles.forEach(function(tile) {
		tile.color[3] = 0;
	});

	game.on('pausechanged', function(paused) {
		if (paused) {
			soundManager.pauseAll();
		} else {
			soundManager.resumeAll();
		}
	});
	game.fpsContainer.innerHTML = 'webgl? ' + L7.useWebGL;
	game.paused = true;

	var snake = new i.ClassicSnake({
		position: L7.p(-20, 15),
		script: [{
			p: L7.p(14, 15)
		},
		{
			p: L7.p(14, 17)
		},
		{
			p: L7.p(27, 17)
		},
		{
			p: L7.p(27, 13)
		},
		{
			p: L7.p(44, 13)
		},
		{
			p: L7.p(44, 16)
		},
		{
			p: L7.p(68, 16)
		},
		{
			p: L7.p(68, 15)
		},
		{
			p: L7.p(80, 15)
		},
		{
			p: L7.p(80, 17)
		},
		{
			p: L7.p(75, 17)
		},
		{
			p: L7.p(75, 14)
		},
		{
			p: L7.p(91, 14)
		},
		{
			p: L7.p(91, 16)
		},
		{
			p: L7.p(103, 16)
		},
		{
			p: L7.p(106, 16)
		},
		{
			p: L7.p(106, 14)
		},
		{
			p: L7.p(110, 14)
		},
		{
			p: L7.p(110, 17)
		},
		{
			p: L7.p(114, 17)
		},
		{
			p: L7.p(114, 14)
		},
		{
			p: L7.p(127, 14)
		},
		{
			p: L7.p(127, 9)
		},
		{
			p: L7.p(142, 9)
		},
		{
			p: L7.p(142, 15)
		},
		{
			p: L7.p(228, 15)
		},
		{
			p: L7.p(228, 13)
		},
		{
			p: L7.p(155, 13)
		},
		{
			p: L7.p(154, 13)
		}],
		direction: i.Direction.East,
		size: 4,
		active: false,
		rate: 170
	});

	snake.on('scriptdone', function(snake) {
		snake.active = false;
		snake.burp();
	});

	boards[2].addActor(snake);

	var appleXs = [44, 100, 102, 105, 106, 110, 125];
	var applePositions = [
	L7.p(44, 15), L7.p(71, 15), L7.p(107, 14), L7.p(113, 17), L7.p(138, 9), L7.p(167, 13), L7.p(173, 13), L7.p(175, 13), L7.p(179, 13)];

	applePositions.forEach(function(position) {
		var apple = new i.ClassicApple({
			position: position
		});
		boards[2].addActor(apple);
	});

	var overlay = boards[4];
	overlay.tiles.forEach(function(tile) {
		tile.opaque = true;
	});

	overlay.clicked = function() {
		game.paused = false;
		i.ChromeFiller._addPauseButton(chrome);
	};

	// TODO: scrolling the viewport, not sure where to put this
	foreground.ani.together(function(ani) {
		ani.sequence(function(ani) {
			ani.wait(500);
			ani.tween({
				targets: overlay.tiles,
				property: 'color',
				to: [0, 0, 0, 0],
				duration: 2000
			});
			ani.invoke(function() {
				overlay.destroy();
				boards.remove(overlay);
			});
			ani.invoke(function() {
				i.sounds.bubbles.setVolume(10);
				i.sounds.bubbles.play({
					loops: 200,
					volume: 10
				});
			});
			ani.repeat(9, function(ani) {
				ani.wait(3000);
				ani.invoke(function() {
					i.sounds.bubbles.setVolume(i.sounds.bubbles.volume + 10);
				});
			});
		});

		ani.sequence(function(ani) {
			ani.wait(6000);

			var duration = (foreground.tileSize + foreground.borderWidth) * images[3].width;
			duration -= game.width;
			duration -= 85; // arbitrarily choosing where to center the title
			duration /= foreground.parallaxRatio;
			duration = duration | 0;
			//var duration = 2530;
			ani.invoke(function() {
				snake.active = true;
			});

			ani.repeat(duration, function(ani) {
				ani.invoke(function() {
					game.viewport.scrollX(1);
				});
				ani.wait(10);
			});
			ani.wait(11000);
			ani.setProperty({
				targets: [outro],
				property: 'visible',
				value: true
			});
			ani.together(function(ani) {
				ani.repeat(10, function(ani) {
					ani.wait(300);
					ani.invoke(function() {
						i.sounds.bubbles.setVolume(i.sounds.bubbles.volume - 10);
					});
				});
				ani.fadeIn({
					targets: outro.tiles,
					duration: 4000
				});
			});
			ani.wait(1000);
			ani.invoke(function() {
				game.paused = true;
			});
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

	foreground.addActor(a);

	game.go();

}

if (L7.isSupportedBrowser) {
	soundManager.onready(function() {
		i.sounds = {
			bubbles: soundManager.createSound({
				id: 'bubbles',
				url: 'audio/bubbles.mp3'
			}),
			switch: soundManager.createSound({
				id: 'switch',
				url: 'audio/switch.mp3',
				autoLoad: true
			}),
			bite: soundManager.createSound({
				id: 'bite',
				url: 'audio/bite.mp3',
				autoLoad: true
			}),
			burp: soundManager.createSound({
				id: 'burp',
				url: 'audio/burp.mp3',
				autoLoad: true
			})
		};

		var imageLoader = new L7.ImageLoader({
			srcs: ["background.png", "midBackground.png", "midForeground.png", "foreground.png", "overlay.png", "chrome.png", "outro.png"],
			handler: onImagesLoaded,
			loadNow: true
		});
	});

} else {
	var container = document.getElementById('introContainer');
	container.innerHTML = '<img id="browserSupportImg" src="browserSupportBigG.gif" alt="supported browsers" /><div>Sorry, your browser is lacking features needed by Lab Adder. So far Lab Adder works in Chrome (recommended) or the latest Firefox</div>';
}

