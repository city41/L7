(function() {
	function removeNode(nodeId) {
		var node = document.getElementById(nodeId);
		node.parentElement.removeChild(node);
	}

	function createUrl(file) {
		var url;
		if (window.createObjectURL) {
			url = window.createObjectURL(file)
		} else if (window.createBlobURL) {
			url = window.createBlobURL(file)
		} else if (window.URL && window.URL.createObjectURL) {
			url = window.URL.createObjectURL(file)
		} else if (window.webkitURL && window.webkitURL.createObjectURL) {
			url = window.webkitURL.createObjectURL(file)
		}

		return url;
	}

	function addMp3Input(containerId, callback) {
		var container = document.getElementById(containerId);

		var input = document.createElement('input');
		input.type = 'file';

		input.addEventListener('change', function(event) {
			event.preventDefault();
			var f = this.files[0];

			var url = createUrl(f);

			var audio = document.createElement('audio');
			audio.addEventListener('playing', callback);
			document.body.appendChild(audio);
			//audio.volume = 0;
			audio.autoplay = true;
			audio.src = url;
		},
		false);

		container.appendChild(input);
	}

	function onImagesLoaded(images) {
		removeNode('loadingContainer');

		var tileSize = 8;

		var spriteFactory = new SAM.SpriteFactory(images.dance);
		var storyBoardConfig = [
			{
				board: new SAM.Intro(images.intro, tileSize, spriteFactory),
				transitionIn: 'fade',
				transitionInDuration: 1000,
				duration: 20000
			},
			{
				board: new SAM.Race(images.race, tileSize, spriteFactory),
				duration: 12000
			},
			{
				board: new SAM.PoolSchoeffLump(images.pool, tileSize, spriteFactory),
				duration: 15000
			},
			{
				board: new SAM.DadTractor(images.dadTractor, tileSize, spriteFactory),
				duration: 13000
			},
			{
				board: new SAM.CasaBonita(images.casabonita, tileSize, spriteFactory),
				duration: 12000
			},
			{
				board: new SAM.TedGarden(images.tedGarden, tileSize, spriteFactory),
				duration: 16000
			},
			{
				board: new SAM.CatLineSchoeffSits(tileSize, spriteFactory),
				duration: 13000
			},
			{
				board: new SAM.Hockey(images.hockeyBg, images.hockeyFg, tileSize, spriteFactory),
				duration: 12000
			},			
			{
				board: new SAM.CatLineSchoeffSits(tileSize, spriteFactory),
				duration: 13000 + 33000
			},
			// dogs ooooooooooo woo hoo, total of 33 seconds
			{
				board: new SAM.LivingRoom(images.livingRoom, tileSize, spriteFactory),
				duration: 31000
			},
			{
				board: new SAM.Skydiving(images.skydiving, images.clouds, tileSize, spriteFactory),
				duration: 13000
			},
			{
				board: new SAM.PoolSchoeffOutside(images.pool, tileSize, spriteFactory),
				duration: 10000
			},
			{
				board: new SAM.CatLine(tileSize, spriteFactory),
				duration: 13000
			},
			{
				board: new SAM.UpperPeninsula(images.upperPeninsula, tileSize, spriteFactory),
				duration: 15000
			},
			{
				board: new SAM.LowerPeninsula(images.lowerPeninsula, tileSize, spriteFactory),
				duration: 15000
			},
			{
				board: new SAM.Wedding(images.wedding, tileSize, spriteFactory),
				duration: 30000
			}
		];

		addMp3Input('mp3InputContainer', function() {
			var storyBoard = new L7.StoryBoard(storyBoardConfig);
			var game = new L7.Game({
				width: storyBoard.pixelWidth,
				height: storyBoard.pixelHeight,
				board: storyBoard,
				container: document.getElementById('movieContainer'),
				clearOutContainer: true
			});

			game.go();
		});
	}

	var imageLoader = new L7.ImageLoader({
		srcs: [
			'resources/images/dance.png',
			'resources/images/intro.png',
			'resources/images/race.png',
			'resources/images/pool.png',
			'resources/images/livingRoom.png',
			'resources/images/tedGarden.png',
			'resources/images/skydiving.png',
			'resources/images/clouds.png',
			'resources/images/hockeyBg.png',
			'resources/images/hockeyFg.png',
			'resources/images/lowerPeninsula.png',
			'resources/images/upperPeninsula.png',
			'resources/images/wedding.png',
			'resources/images/dadTractor.png',
			'resources/images/casabonita.png'
		//'sipping.png',
		//'pool.png',
		//'garden.png',
		//'couch.png',
		//'tractor.png',
		//'kitchen.png',
		//'hawaii.png',
		//'hockey.png',
		//'casabonita.png',
		//'wedding.png',
		//'conclusion.png'
		],
		loadNow: true,
		handler: onImagesLoaded
	});

})();

