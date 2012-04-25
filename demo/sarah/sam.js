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
			document.body.appendChild(audio);
			audio.src = url;
			audio.play();

			callback();
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
				duration: 3000
			},
			{
				board: new SAM.Race(images.race, tileSize, spriteFactory),
				duration: 3000
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
			'resources/images/race.png'
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

