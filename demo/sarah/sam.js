(function() {
	function onImagesLoaded(images) {

		var spriteFactory = new SAM.SpriteFactory(images.dancing);

		var storyboard = [{
			board: new SAM.Intro(images.intro, spriteFactory),
			transitionIn: 'fade'
		},
		{
			board: new SAM.SippingAndPainting(images.sipping, spriteFactory)
		}];

		var game = new L7.Game(new L7.StoryBoard(storyboard));

		game.go();

	}

	var imageLoader = new L7.ImageLoader({
		srcs: [
			'dancing.png',
			'intro.png',
			'sipping.png',
			'pool.png',
			'garden.png',
			'couch.png',
			'tractor.png',
			'race.png',
			'kitchen.png',
			'hawaii.png',
			'hockey.png',
			'casabonita.png',
			'wedding.png',
			'conclusion.png'
		],
		loadNow: true,
		onLoad: onImagesLoaded
	});

})();

