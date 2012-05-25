(function() {
	L7.useWebGL = true;

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
			var grooveSharkDiv = document.createElement('div');
			document.body.appendChild(grooveSharkDiv);
			
			grooveSharkDiv.innerHTML = '<object width="250" height="40" classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" id="gsSong3519476177" name="gsSong3519476177"><param name="movie" value="http://grooveshark.com/songWidget.swf" /><param name="wmode" value="window" /><param name="allowScriptAccess" value="always" /><param name="flashvars" value="hostname=cowbell.grooveshark.com&songIDs=35194761&style=metal&p=1" /><object type="application/x-shockwave-flash" data="http://grooveshark.com/songWidget.swf" width="250" height="40"><param name="wmode" value="window" /><param name="allowScriptAccess" value="always" /><param name="flashvars" value="hostname=cowbell.grooveshark.com&songIDs=35194761&style=metal&p=1" /><span>Funky Tonight by <a href="http://grooveshark.com/artist/The+John+Butler+Trio/20926" title="The John Butler Trio">The John Butler Trio</a> on Grooveshark</span></object></object>';

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

		addMp3Input('loadingContainer', function() {
			var storyBoard = new L7.StoryBoard(storyBoardConfig);
			var game = new L7.Game({
				width: storyBoard.pixelWidth,
				height: storyBoard.pixelHeight,
				board: storyBoard,
				container: document.getElementById('introContainer'),
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
		],
		loadNow: true,
		handler: onImagesLoaded
	});

})();

