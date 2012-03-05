L7.useWebGL = true;

var board = new L7.Board({
	tileSize: 10,
	borderWidth: 2,
	width: 30,
	height: 30,
	borderFill: 'black'
});

board.tiles.forEach(function(tile) {
	tile.color = [20, 20, 20, 1];
});

var sunSystem = new L7.ParticleSystem({
	totalParticles: 300,
	duration: Infinity,
	gravity: L7.p(),
	centerOfGravity: L7.p(),
	angle: 90,
	angleVar: 360,
	radialAccel: 0,
	radialAccelVar: 0,
	position: L7.p(board.width / 2, board.height / 2),
	posVar: L7.p(),
	life: 0.5,
	lifeVar: 0.5,
	speed: 10,
	speedVar: 5,
	emissionRate: 350,
	startColor: L7.Color.fromFloats(0.9, 0.6, 0.12, 1),
	startColorVar: [10, 10, 3, 0],
	endColor: [0, 0, 0, 1],
	endColorVar: [0, 0, 0, 0],
	active: true
});

var galaxySystem = new L7.ParticleSystem({
	totalParticles: 200,
	duration: Infinity,
	gravity: L7.p(),
	centerOfGravity: L7.p(),
	angle: 90,
	angleVar: 360,
	speed: 15,
	speedVar: 5,
	radialAccel: - 20,
	radialAccelVar: 0,
	tangentialAccel: 20,
	tangentialAccelVar: 0,
	position: L7.p(board.width / 2, board.height / 2),
	posVar: L7.p(),
	life: 3,
	lifeVar: 1,
	emissionRate: 200 / 4,
	startColor: L7.Color.fromFloats(0.12, 0.25, 0.76, 1),
	startColorVar: [0, 0, 0, 0],
	endColor: [0, 0, 0, 1],
	endColorVar: [0, 0, 0, 0],
	active: true,
	startSize: 2.5,
	startSizeVar: 0.5
});

var fireworksSystem = new L7.ParticleSystem({
	totalParticles: 90,
	duration: Infinity,
	gravity: L7.p(0, - 90),
	centerOfGravity: L7.p(),
	angle: - 90,
	angleVar: 20,
	speed: 30,
	speedVar: 5,
	radialAccel: 0,
	radialAccelVar: 0,
	tangentialAccel: 0,
	tangentialAccelVar: 0,
	position: L7.p(board.width / 2, board.height),
	posVar: L7.p(),
	life: 1.3,
	lifeVar: 0.2,
	emissionRate: 90 / 1.3,
	startColor: L7.Color.fromFloats(0.5, 0.5, 0.5, 1),
	startColorVar: L7.Color.fromFloats(0.5, 0.5, 0.5, 0.1),
	endColor: L7.Color.fromFloats(0.1, 0.1, 0.1, 0.2),
	endColorVar: L7.Color.fromFloats(0.1, 0.1, 0.1, 0.2),
	active: true
});

var fireSystem = new L7.ParticleSystem({
	totalParticles: 200,
	duration: Infinity,
	gravity: L7.p(),
	centerOfGravity: L7.p(),
	angle: - 90,
	angleVar: 10,
	speed: 24,
	speedVar: 10,
	radialAccel: 0,
	radialAccelVar: 0,
	tangentialAccel: 0,
	tangentialAccelVar: 0,
	position: L7.p(board.width / 2, board.height - 4),
	posVar: L7.p(2, 1),
	life: 1.2,
	lifeVar: 0.25,
	emissionRate: 200 / 1,
	startColor: L7.Color.fromFloats(0.76, 0.25, 0.12, 1),
	startColorVar: [0, 0, 0, 0],
	endColor: [0, 0, 0, 0],
	endColorVar: [0, 0, 0, 0],
	active: true
});

var meteorSystem = new L7.ParticleSystem({
	totalParticles: 100,
	duration: Infinity,
	gravity: L7.p(-200, - 200),
	centerOfGravity: L7.p(),
	angle: 90,
	angleVar: 360,
	speed: 13,
	speedVar: 5,
	radialAccel: 0,
	radialAccelVar: 0,
	tangentialAccel: 0,
	tangentialAccelVar: 0,
	position: L7.p(board.width / 2, board.height / 2),
	posVar: L7.p(),
	life: 0.7,
	lifeVar: 0.2,
	emissionRate: 100 / 1,
	startColor: L7.Color.fromFloats(0.3, 0.5, 0.8, 1),
	startColorVar: L7.Color.fromFloats(0, 0, 0.2, 0.1),
	endColor: [0, 0, 0, 1],
	endColorVar: [0, 0, 0, 0],
	startSize: 3,
	startSizeVar: 0.5,
	endSize: 0.5,
	endSizeVar: 0,
	active: true
});

var snowSystem = new L7.ParticleSystem({
	totalParticles: 50,
	duration: Infinity,
	gravity: L7.p(0, 1),
	centerOfGravity: L7.p(),
	angle: 90,
	angleVar: 10,
	speed: 5,
	speedVar: 1,
	radialAccel: 0,
	radialAccelVar: 2,
	tangentialAccel: 0,
	tangentialAccelVar: 2,
	position: L7.p(board.width / 2, 0),
	posVar: L7.p(board.width / 2, 0),
	life: 6,
	lifeVar: 2,
	emissionRate: 10,
	startColor: L7.Color.fromFloats(1, 1, 1, 1),
	startColorVar: [0, 0, 0, 0],
	endColor: L7.Color.fromFloats(1, 1, 1, 0),
	endColorVar: [0, 0, 0, 0],
	active: true
});

var rainSystem = new L7.ParticleSystem({
	totalParticles: 80,
	duration: Infinity,
	gravity: L7.p(100, - 10),
	centerOfGravity: L7.p(),
	angle: 90,
	angleVar: 5,
	speed: 100,
	speedVar: 30,
	radialAccel: 0,
	radialAccelVar: 1,
	tangentialAccel: 0,
	tangentialAccelVar: 1,
	position: L7.p(board.width / 2, 0),
	posVar: L7.p(board.width / 2, 0),
	life: 1.8,
	lifeVar: 0,
	emissionRate: 40,
	startColor: L7.Color.fromFloats(0.7, 0.8, 1, 1),
	startColorVar: [0, 0, 0, 0],
	endColor: L7.Color.fromFloats(0.7, 0.8, 1, 1),
	endColorVar: [0, 0, 0, 0],
	active: true
});

var daemons = [
sunSystem, galaxySystem, fireworksSystem, fireSystem, meteorSystem, snowSystem, rainSystem];

var daemonIndex = 0;

function setNextSystem(delta) {
	var curDaemon = daemons[daemonIndex];

	daemonIndex += delta;
	if (daemonIndex < 0) {
		daemonIndex = daemons.length - 1;
	}
	if (daemonIndex >= daemons.length) {
		daemonIndex = 0;
	}

	board.removeDaemon(curDaemon);
	board.addDaemon(daemons[daemonIndex]);
}

board.addActor(new L7.Actor({
	keyInputs: {
		left: {
			repeat: false,
			handler: function() {
				setNextSystem(-1);
			}
		},
		right: {
			repeat: false,
			handler: function() {
				setNextSystem(1);
			}
		}
	},
	position: L7.p(-1, - 1)
}));

setNextSystem(0);

var game = new L7.Game({
	board: board,
	container: document.getElementById('particleContainer'),
	width: board.width * (board.tileSize + board.borderWidth) + board.borderWidth,
	height: board.height * (board.tileSize + board.borderWidth) + board.borderWidth,
	fpsContainer: document.getElementById('fpsContainer')
});

game._doFrame(Date.now());
game.paused = true;

game.canvas.onclick = function() {
	game.paused = ! game.paused;
};

