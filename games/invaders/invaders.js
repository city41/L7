(function() {
	L7.useWebGL = true;

	function onImagesLoaded(images) {
		var spriteFactory = new SI.SpriteFactory(images.sprites);
		
		var board = new SI.GameBoard(spriteFactory);

		var game = new L7.Game(board);
		game.fpsContainer = document.getElementById('fpsContainer');
		game.go();
	}

	var imageLoader = new L7.ImageLoader({
		srcs: [ 'sprites.png' ],
		loadNow: true,
		handler: onImagesLoaded
	});

})();

