(function() {
	L7.useWebGL = true;

	if(L7.isFirefox) {
		L7.Tile = L7.SingleInhabitantTile;
	}

	function dumpWarning(image, text) {
		var container = document.getElementById('introContainer');
		container.innerHTML = '<img src="' + image + '"/><div>' + text + '</div>';
	}

	function clearContainer(container) {
		while(container.hasChildNodes()) {
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

	function addMp3Input(containerId, callback) {
		var container = document.getElementById(containerId);
		clearContainer(container);

		var button = document.createElement('button');
		button.innerHTML = "start!";

		button.addEventListener('click', function(event) {
			event.preventDefault();
			//var grooveSharkDiv = document.createElement('div');
			//var groovesharkContainer = document.getElementById('groovesharkContainer');
			//groovesharkContainer.appendChild(grooveSharkDiv);
			
			//grooveSharkDiv.innerHTML = '<object width="250" height="40" classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" id="gsSong3519476177" name="gsSong3519476177"><param name="movie" value="http://grooveshark.com/songWidget.swf" /><param name="wmode" value="window" /><param name="allowScriptAccess" value="always" /><param name="flashvars" value="hostname=cowbell.grooveshark.com&songIDs=35194761&style=metal&p=1" /><object type="application/x-shockwave-flash" data="http://grooveshark.com/songWidget.swf" width="250" height="40"><param name="wmode" value="window" /><param name="allowScriptAccess" value="always" /><param name="flashvars" value="hostname=cowbell.grooveshark.com&songIDs=35194761&style=metal&p=1" /><span>Funky Tonight by <a href="http://grooveshark.com/artist/The+John+Butler+Trio/20926" title="The John Butler Trio">The John Butler Trio</a> on Grooveshark</span></object></object>';

			callback();
		}, false);

		container.appendChild(button);
	}

	function onImagesLoaded(images) {
		var tileSize = 8;

		var spriteFactory = new SAM.SpriteFactory(images.dance);
		var storyBoardConfig = [
			{
				board: new SAM.Intro(images.intro, tileSize, spriteFactory),
				duration: 20000
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
			}
		];

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

	if(L7.isSupportedBrowser) {
		if(L7.isWebGLAvailable) {
			var imageLoader = new L7.ImageLoader({
				srcs: [
					'resources/images/dance.png',
					'resources/images/intro.png',
					'resources/images/race.png',
					'resources/images/pool.png',
					'resources/images/livingRoom.png',
					'resources/images/tedGarden.png',
					'resources/images/skydiving.png',
					'resources/images/landscape.png',
					'resources/images/clouds.png',
					'resources/images/hockeyBg.png',
					'resources/images/hockeyFg.png',
					'resources/images/lowerPeninsula.png',
					'resources/images/upperPeninsula.png',
					'resources/images/stage.png',
					'resources/images/dadTractor.png',
					'resources/images/iowaClouds.png',
					'resources/images/casabonita.png',
					'resources/images/oceanBg.png',
					'resources/images/oceanFg.png',
					'resources/images/outro.png'
				],
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

