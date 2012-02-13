L7.Keys.init();

function onImagesLoaded(images) {
	var boards = [];

	var tileSize = 12;
	var borderWidth = 1;

	images.forEach(function(image, i) {
		var levelLoader = new L7.ColorLevelLoader(image, tileSize, borderWidth);
		
		tileSize = Math.floor(tileSize * 0.75);

		var board = levelLoader.load().board;
		board.parallaxRatio = 1 - (i * 0.25);
		boards.push(board);
	});

	var parallax = new L7.ParallaxBoard({
		boards: boards
	});

	var b1 = boards[0];
	var game = new L7.Game({
		board: parallax,
		width: b1.height * (b1.tileSize + b1.borderWidth) + b1.borderWidth,
		height: b1.height * (b1.tileSize + b1.borderWidth) + b1.borderWidth,
		initialAnchor: L7.p(),
		container: document.getElementById('container')
	});

	game.go();
}


var imageLoader = new L7.ImageLoader({
	srcs: [
		"bg1.png",
		"bg2.png",
		"bg3.png",
		"bg4.png"
	],
	handler: onImagesLoaded,
	loadNow: true
});

