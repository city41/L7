(function() {
	L7.useWebGL = true;

	function dumpWarning(image, text) {
		var container = document.getElementById('introContainer');
		container.innerHTML = '<img src="' + image + '"/><div>' + text + '</div>';
	}

	function clearContainer(container) {
		while (container.hasChildNodes()) {
			container.removeChild(container.firstChild);
		}
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

	function loadMusic(file, callback) {
		var url = createUrl(file);

		var audio = document.createElement('audio');
		document.body.appendChild(audio);

		audio.addEventListener('canplaythrough', function() {
			audio.play();
		}, false);

		audio.addEventListener('play', callback, false);

		audio.src = url;
	}

	function addMp3Input(containerId, callback) {
		var container = document.getElementById(containerId);
		clearContainer(container);

		var div = document.createElement('div');
		div.innerHTML = "<div id='dragContainer'><img id='dragImg' src='drag.png' alt='drag an mp3 here to start' /><span id='asterisk'>*</span></div>" + "<div id='skipContainer'><a id='skipLink' href='#'>or start with no music</a></div><div id='disclaimer'>* best results with John Butler Trio\'s \"Funky Tonight\"</div>";

		container.appendChild(div);
		var image = document.getElementById('dragImg');
		var baseOpacity = 0.7;
		image.style.opacity = baseOpacity;


		function clearBg(e) {
			e.preventDefault();
			e.stopPropagation();
			image.style.opacity = baseOpacity;
		}

		image.addEventListener('dragenter', function(e) {
			e.preventDefault();
			e.stopPropagation();
			image.style.opacity = 1;
		}, true);

		image.addEventListener('dragleave', function(e) {
			clearBg(e);	
		}, true);
		
		image.addEventListener('dragover', function(e) {
			e.preventDefault();
			e.stopPropagation();
			return false;
		}, true);

		image.addEventListener('drop', function(e) {
			clearBg(e);

			var file = e.dataTransfer.files[0];

			if (file) {
				loadMusic(file, callback);
			}

			return false;
		},
		true);

		var skipLink = document.getElementById('skipLink');
		skipLink.addEventListener('click', function(e) {
			e.preventDefault();
			e.stopPropagation();
			callback();
			return false;
		},
		false);
	}

	function onImagesLoaded(images) {
		var tileSize = 8;

		var spriteFactory = new SAM.SpriteFactory(images.dance);
		var storyBoardConfig = [{
			board: new SAM.Intro(images.intro, tileSize, spriteFactory),
			duration: 20000
		},
		{
			board: new SAM.Seattle(images.seattle, images.duck, tileSize, spriteFactory),
			duration: 18000
		},
		{
			board: new SAM.Race(images.race, tileSize, spriteFactory),
			duration: 12000
		},
		{
			board: new SAM.Hawaii(images.oceanBg, images.oceanFg, tileSize, spriteFactory),
			duration: 13000
		},
		{
			board: new SAM.PoolSchoeffLump(images.pool, tileSize, spriteFactory),
			duration: 15000
		},
		{
			board: new SAM.DadTractor(images.dadTractor, images.iowaClouds, tileSize, spriteFactory),
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
			duration: 13000
		},
		// dogs ooooooooooo woo hoo, total of 33 seconds
		{
			board: new SAM.DogLine(tileSize, spriteFactory),
			duration: 33000 / 4
		},
		{
			board: new SAM.DogLine(tileSize, spriteFactory),
			duration: 33000 / 4
		},
		{
			board: new SAM.DogLine(tileSize, spriteFactory),
			duration: 33000 / 4
		},
		{
			board: new SAM.DogLine(tileSize, spriteFactory),
			duration: 33000 / 4
		},
		{
			board: new SAM.LivingRoom(images.livingRoom, tileSize, spriteFactory),
			duration: 21000
		},
		{
			board: new SAM.Skydiving(images.skydiving, images.clouds, images.landscape, tileSize, spriteFactory),
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
			board: new SAM.Wedding(images.stage, tileSize, spriteFactory),
			duration: 40000
		},
		{
			board: new SAM.Outro(images.outro, tileSize, spriteFactory),
			duration: 100000
		}];

		addMp3Input('loadingContainer', function() {
			var storyBoard = new L7.StoryBoard(storyBoardConfig);
			var game = new L7.Game({
				width: storyBoard.pixelWidth,
				height: storyBoard.pixelHeight,
				board: storyBoard,
				container: document.getElementById('introContainer'),
				clearOutContainer: true
			});

			SAM.game = game;

			game.go();
		});
	}

	if (L7.isSupportedBrowser) {
		if (L7.isWebGLAvailable) {
			var imageLoader = new L7.ImageLoader({
				srcs: ['resources/images/dance.png', 'resources/images/intro.png', 'resources/images/race.png', 'resources/images/pool.png', 'resources/images/livingRoom.png', 'resources/images/tedGarden.png', 'resources/images/skydiving.png', 'resources/images/landscape.png', 'resources/images/clouds.png', 'resources/images/hockeyBg.png', 'resources/images/hockeyFg.png', 'resources/images/lowerPeninsula.png', 'resources/images/upperPeninsula.png', 'resources/images/stage.png', 'resources/images/dadTractor.png', 'resources/images/iowaClouds.png', 'resources/images/casabonita.png', 'resources/images/oceanBg.png', 'resources/images/oceanFg.png', 'resources/images/outro.png', 'resources/images/duck.png', 'resources/images/seattle.png'],
				loadNow: true,
				handler: onImagesLoaded
			});
		} else {
			dumpWarning('noWebGL.png', 'Your browser does not support WebGL, which is required to see the animation');
		}
	} else {
		dumpWarning('browserSupportBigG.gif', 'Sorry, the animation only works in Chrome or the latest Firefox');
	}

})();

