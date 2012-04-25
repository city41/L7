(function() {
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

		//var spriteFactory = new SAM.SpriteFactory(images.dancing);
		//var storyboard = [{
		//board: new SAM.Intro(images.intro, spriteFactory),
		//transitionIn: 'fade',
		//transitionInDuration: 1000,
		//duration: 3000
		//},
		//{
		//board: new SAM.Race(images.sipping, spriteFactory),
		//duration: 3000
		//}];
		//var game = new L7.Game(new L7.StoryBoard(storyboard));
		addMp3Input('mp3InputContainer', function() {
			//game.go();
			console.log('id start now');
		});
	}

	var imageLoader = new L7.ImageLoader({
		srcs: ['resources/images/dance.png',
		//'intro.png',
		//'sipping.png',
		//'pool.png',
		//'garden.png',
		//'couch.png',
		//'tractor.png',
		//'race.png',
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

