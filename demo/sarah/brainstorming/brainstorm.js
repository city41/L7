function onImagesLoaded(images) {

	var spriteFactory = new sar.SpriteFactory(images.dancing);

	var storyboard = [{
		board: new sar.Intro(images.intro, spriteFactory),
		transitionIn: 'fade'
	},
	{
		board: new sar.SippingAndPainting(images.intro, spriteFactory)
	},
	{
		board: new sar.FirstPool(images.pool, spriteFactory)
	}];

	var game = new L7.Game(new L7.StoryBoard(storyboard));

	game.go();

}

var imageLoader = new L7.ImageLoader({
	srcs: ['dancing.png', 'intro.png', 'sipping.png', 'pool.png', 'garden.png', 'couch.png', 'tractor.png', 'race.png', 'kitchen.png', 'hawaii.png', 'hockey.png', 'casabonita.png', 'wedding.png', 'conclusion.png'],
	loadNow: true,
	onLoad: onImagesLoaded
});

