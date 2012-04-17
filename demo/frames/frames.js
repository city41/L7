(function() {

	function onImagesLoaded(images) {
		var m = new L7.Actor({
			framesConfig: {
				src: images[0],
				width: 9,
				height: 14,
				direction: 'horizontal',
				sets: [[0], [1, 2, 3]],
				initialSet: 0,
				initialFrame: 0,
				anchor: L7.p(0, 0),
				offset: L7.p(0, 0)
			},
			position: L7.p(10, 10)
		});

		var s = new L7.Actor({
			framesConfig: {
				src: images[0],
				width: 9,
				height: 13,
				direction: 'horizontal',
				sets: [[0], [1, 2, 1, 2, 3, 4, 5, 4, 5]],
				initialSet: 0,
				initialFrame: 0,
				anchor: L7.p(0, 0),
				offset: L7.p(0, 15)
			},
			position: L7.p(30, 11)
		});

		var board = new L7.Board({
			width: 50,
			height: 50,
			tileSize: 8,
			borderWidth: 0
		});

		board.addActor(m);
		board.addActor(s);

		m.ani.frame({
			targets: [m,s],
			pieceSetIndex: 1,
			rate: 150,
			looping: 'backforth',
			loops: Infinity
		});

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

