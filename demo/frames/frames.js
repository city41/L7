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
			position: L7.p(5, 10)
		});

		var s = new L7.Actor({
			framesConfig: {
				src: images[0],
				width: 9,
				height: 13,
				direction: 'horizontal',
				sets: [[0], [2, 1, 2, 4, 5, 4]],
				initialSet: 0,
				initialFrame: 0,
				anchor: L7.p(0, 0),
				offset: L7.p(0, 15)
			},
			position: L7.p(15, 11)
		});

		var l = new L7.Actor({
			framesConfig: {
				src: images[0],
				width: 9,
				height: 8,
				direction: 'horizontal',
				sets: [[], [0, 1, 2]],
				initialSet: 0,
				initialFrame: 0,
				anchor: L7.p(0, 0),
				offset: L7.p(0, 31)
			},
			position: L7.p(25, 16)
		});

		var lily = new L7.Actor({
			framesConfig: {
				src: images[0],
				width: 9,
				height: 9,
				direction: 'horizontal',
				sets: [[], [0, 1, 2]],
				initialSet: 0,
				initialFrame: 0,
				anchor: L7.p(0, 0),
				offset: L7.p(30, 61)
			},
			position: L7.p(45, 15)
		});


		var or = new L7.Actor({
			framesConfig: {
				src: images[0],
				width: 10,
				height: 11,
				direction: 'horizontal',
				sets: [[], [0, 1, 2]],
				initialSet: 0,
				initialFrame: 0,
				anchor: L7.p(0, 0),
				offset: L7.p(27, 30)
			},
			position: L7.p(35, 13)
		});

		var ted = new L7.Actor({
			framesConfig: {
				src: images[0],
				width: 10,
				height: 13,
				direction: 'horizontal',
				sets: [[0], [1, 2, 3]],
				initialSet: 0,
				initialFrame: 0,
				anchor: L7.p(0, 0),
				offset: L7.p(0, 42)
			},
			position: L7.p(10, 28)
		});

		var chris = new L7.Actor({
			framesConfig: {
				src: images[0],
				width: 10,
				height: 13,
				direction: 'horizontal',
				sets: [[0], [1, 2, 3]],
				initialSet: 0,
				initialFrame: 0,
				anchor: L7.p(0, 0),
				offset: L7.p(0, 95)
			},
			position: L7.p(1, 29)
		});


		var dad = new L7.Actor({
			framesConfig: {
				src: images[0],
				width: 10,
				height: 13,
				direction: 'horizontal',
				sets: [[0], [1, 2]],
				initialSet: 0,
				initialFrame: 0,
				anchor: L7.p(0, 0),
				offset: L7.p(0, 57)
			},
			position: L7.p(32, 28)
		});

		var mom = new L7.Actor({
			framesConfig: {
				src: images[0],
				width: 10,
				height: 13,
				direction: 'horizontal',
				sets: [[0], [1, 2, 3]],
				initialSet: 0,
				initialFrame: 0,
				anchor: L7.p(0, 0),
				offset: L7.p(0, 82)
			},
			position: L7.p(22, 29)
		});


		var boo = new L7.Actor({
			framesConfig: {
				src: images[0],
				width: 9,
				height: 8,
				direction: 'horizontal',
				sets: [[], [0, 1, 2]],
				initialSet: 0,
				initialFrame: 0,
				anchor: L7.p(0, 0),
				offset: L7.p(0, 72)
			},
			position: L7.p(45, 27)
		});

		var bobo = new L7.Actor({
			framesConfig: {
				src: images[0],
				width: 9,
				height: 9,
				direction: 'horizontal',
				sets: [[], [0, 1, 2]],
				initialSet: 0,
				initialFrame: 0,
				anchor: L7.p(0, 0),
				offset: L7.p(30, 71)
			},
			position: L7.p(45, 37)
		});

		var phil = new L7.Actor({
			framesConfig: {
				src: images[0],
				width: 10,
				height: 14,
				direction: 'horizontal',
				sets: [[0], [1, 2, 3]],
				initialSet: 0,
				initialFrame: 0,
				anchor: L7.p(0, 0),
				offset: L7.p(0, 108)
			},
			position: L7.p(2, 43)
		});

		var emily = new L7.Actor({
			framesConfig: {
				src: images[0],
				width: 10,
				height: 14,
				direction: 'horizontal',
				sets: [[0], [1, 2, 3]],
				initialSet: 0,
				initialFrame: 0,
				anchor: L7.p(0, 0),
				offset: L7.p(0, 123)
			},
			position: L7.p(13, 45)
		});

		var chad = new L7.Actor({
			framesConfig: {
				src: images[0],
				width: 10,
				height: 14,
				direction: 'horizontal',
				sets: [[0], [1, 2, 3]],
				initialSet: 0,
				initialFrame: 0,
				anchor: L7.p(0, 0),
				offset: L7.p(0, 136)
			},
			position: L7.p(33, 45)
		});

		var board = new L7.Board({
			width: 60,
			height: 60,
			tileSize: 8,
			borderWidth: 0
		});

		board.tiles.forEach(function(tile) {
			tile.color = [100, 100, 100, 1];
		});

		board.addActor(m);
		board.addActor(s);
		board.addActor(l);
		board.addActor(lily);
		board.addActor(or);
		board.addActor(ted);
		board.addActor(chris);
		board.addActor(dad);
		board.addActor(mom);
		board.addActor(boo);
		board.addActor(bobo);
		board.addActor(phil);
		board.addActor(emily);
		board.addActor(chad);

		m.ani.frame({
			targets: [m, s, l, lily, or, ted, chris, boo, bobo, mom, phil, emily, chad],
			pieceSetIndex: 1,
			rate: 150,
			looping: 'backforth',
			loops: Infinity
		});

		dad.ani.frame({
			targets: [dad],
			pieceSetIndex: 1,
			rate: 400,
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

