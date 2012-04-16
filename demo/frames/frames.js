(function() {

	function onImagesLoaded(images) {
		var a = new L7.Actor({
			framesConfig: {
				src: images[0],
				width: 9,
				height: 14,
				direction: 'horizontal',
				sets: [
					[0],
					[1,2,3]
				],
				initialSet: 0,
				initialFrame: 0,
				anchor: L7.p(0,0)
			},
			position: L7.p(10, 10)
		});
		window.actor = a;

		var board = new L7.Board({
			width: 50,
			height: 50,
			tileSize: 8,
			borderWidth: 0
		});

		board.addActor(a);

		var game = new L7.Game(board);

		game.fpsContainer = document.getElementById('fpsContainer');

		game.go();
	}

	new L7.ImageLoader({
		srcs: ['dance.png'],
		handler: onImagesLoaded,
		loadNow: true
	});
})();

