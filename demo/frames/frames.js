(function() {
	L7.useWebGL = true;

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
			position: L7.p(20, 11)
		});

		var l = new L7.Actor({
			framesConfig: {
				src: images[0],
				width: 9,
				height: 9,
				direction: 'horizontal',
				sets: [[], [0, 1, 2]],
				initialSet: 0,
				initialFrame: 0,
				anchor: L7.p(0, 0),
				offset: L7.p(0, 28)
			},
			position: L7.p(30, 15)
		});


		var board = new L7.Board({
			width: 60,
			height: 60,
			tileSize: 8,
			borderWidth: 0
		});

		board.tiles.forEach(function(tile) {
			tile.color = [150,150,150,1];
		});

		board.addActor(m);
		board.addActor(s);
		board.addActor(l);

		m.ani.frame({
			targets: [m,s,l],
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

