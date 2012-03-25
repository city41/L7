window.sar = window.sar || {};

sar.storyboard = [
	{
		src: 'schoeff.png',
		start: 'right',
		scroll: 'left',
		rate: 1000
	},
	{


];

sar.boardSrcs = [
	'schoeff.png',
	'beautiful.png'
];

sar.storyboard = function(ani) {
	ani.fadeInOut({
		targets: sar.board('schoeff'),
		duration: 1000,
		easing: 'easeInCubic'
	});

	ani.sequence(function(ani) {
		ani.wait(900);
		ani.scroll({
			targets: sar.board('beautiful'),
			start: 'right',
			direction: 'left',
			duration: 3000,
			offsetY: 200
		});
	});
};



sar.go = function() {

};


