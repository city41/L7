L7.useWebGL = true;

function onImagesLoaded(images) {
	var boards = [];

	var tileSize = 8;
	var borderWidth = 1;

	images.forEach(function(image, i) {
		var levelLoader = new L7.ColorLevelLoader(image, tileSize, borderWidth);

		tileSize += 4;

		var board = levelLoader.load();
		board.parallaxRatio = i * 0.25;
		boards.push(board);
	});

	var parallax = new L7.ParallaxBoard({
		boards: boards
	});

	var b3 = boards[3];

	var fireworksSystem = new L7.ParticleSystem({
		totalParticles: 30,
		duration: Infinity,
		gravity: L7.p(-20, - 20),
		centerOfGravity: L7.p(),
		angle: 110,
		angleVar: 10,
		speed: 8,
		speedVar: 3,
		radialAccel: 0,
		radialAccelVar: 0,
		tangentialAccel: 0,
		tangentialAccelVar: 0,
		position: L7.p(30, 10),
		posVar: L7.p(),
		life: 0.8,
		lifeVar: 0.2,
		emissionRate: 30 / 0.8,
		startColor: L7.Color.fromFloats(0.8, 0.7, 0.1, 0.9),
		startColorVar: L7.Color.fromFloats(0, 0, 0, 0),
		endColor: L7.Color.fromFloats(0.8, 0.7, 0.1, 0.9),
		endColorVar: L7.Color.fromFloats(0, 0, 0, 0),
		active: true
	});

	boards[2].addDaemon(fireworksSystem);
	boards[2].ani.repeat(Infinity, function(ani) {
		ani.invoke(function() {
			fireworksSystem.reset(boards[2]);
		});
		ani.waitBetween(500, 4000);
	});

	var fireworksSystem2 = new L7.ParticleSystem({
		totalParticles: 30,
		duration: Infinity,
		gravity: L7.p(20, 20),
		centerOfGravity: L7.p(),
		angle: 110,
		angleVar: 20,
		speed: 8,
		speedVar: 3,
		radialAccel: 0,
		radialAccelVar: 0,
		tangentialAccel: 0,
		tangentialAccelVar: 0,
		position: L7.p(45, - 1),
		posVar: L7.p(),
		life: 0.8,
		lifeVar: 0.2,
		emissionRate: 30 / 0.8,
		startColor: L7.Color.fromFloats(1, 0, 0, 1),
		startColorVar: L7.Color.fromFloats(0, 0, 0, 0),
		endColor: L7.Color.fromFloats(1, 1, 0, 0),
		endColorVar: L7.Color.fromFloats(0, 0, 0, 0),
		active: true
	});

	boards[2].addDaemon(fireworksSystem2);

	boards[1].ani.repeat(Infinity, function(ani) {
		ani.wait(1);
		return;
		ani.shimmer({
			rate: 70,
			targets: boards[1].query(function(t) { return !!t.color; }),
			weights: [1, 0.1, 0.2],
			minAlpha: 0.4,
			maxAlpha: 0.7,
			baseRate: 1000,
			rateVariance: 0.4
		});
	});

	boards[0].ani.repeat(Infinity, function(ani) {
		ani.plasma({
			rate: 70,
			weights: [1, 0.1, 0.2],
			minAlpha: 0.1,
			maxAlpha: 0.8,
			baseRate: 500,
			rateVariance: 0.4
		});
	});

	var game = new L7.Game({
		board: parallax,
		width: (b3.height * 4.3) * (b3.tileSize + b3.borderWidth) + b3.borderWidth,
		height: b3.height * (b3.tileSize + b3.borderWidth) + b3.borderWidth,
		initialAnchor: L7.p(),
		container: document.getElementById('container'),
		fpsContainer: document.getElementById('fpsContainer')
	});

	b3.ani.repeat(Infinity, function(ani) {
		ani.invoke(function() {
			game.viewport.scrollX(1);
		});
	});

	game.go();
}

var imageLoader = new L7.ImageLoader({
	srcs: ["bg4.png", "bg3.png", "bg2.png", "bg1.png"],
	handler: onImagesLoaded,
	loadNow: true
});

