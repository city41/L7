

board.addAnimation(new Shimmer({
	operateOn: 'tile', // tile, overlay or actor
	tiles: 'all',			// 'all', '<team>', or query function
	// other properties like rate, variance, color, etc
});

board.addAnimation(new Tween({
	target: tile,
	property: 'color',
	from: tile.color,
	to: [255, 0, 0, 1],
	duration: 1000,
	delay: 0,	// when to start it, positive integer or zero for immediate
	easing: 'easeInQuart', // linear, easeIn<type>, easeOut<type>, easeInOut<type>, where type: quad, cubic, quart, exp, circle, sine
});


board.addAnimation(new Jitter({
	target: actor.pieces,
	property: 'scale',
	range: 0.2,
	duration: 2000,
	type: 'linear', // smoothly go between -0.1 and positive 0.1, 'random' would be randomly pick a value inside the range
});


tile.sequence()
	.tween({
		target: 'inhabitant',
		property: 'scale',
		from: 0,
		to: 2,
		duration: 1000
	})
	.wait(1000)
	.reverserTween()
	.done();


tile.tween({...});

tile.jitter({...})

tile.composite()
	.tween({...})
	.jitter({...})
	.done();






tile.sequence(function(tile) {
	tile.tween(...);
	tile.wait(1000);
	tile.undoLastTween();
});

tile.sequence(function(tile) {
	tile.composite(function(tile) {
		tile.tween(...);
		tile.jitter(...);
	});
	tile.wait(1000);
	tile.undoLastComposite();
});


tile.repeat(4, function(tile) {
	var tween = tile.tween();
	tile.wait(1000);
	tile.undo(tween);
});

tile.repeat(Infinity, function(tile) {
	...
});



board.animate(tile, function(target) {
	target.sequence(function(target) {
		target.tween();
		target.wait();
		target.undo();
	});
});


tile.ani.sequence(function(ani) {
	ani.together(function(ani) {
		ani.scale();
		ani.jitter();
	});
	
	ani.wait();
});

actor.ani.sequence(function(ani) {
	ani.tween();
	...
});

board.ani.composite(function(ani) {
	ani.repeat(Infinity, function(ani) {
		ani.jitter();
	});
	ani.repeat(Infinity, function(ani) {
		ani.shimmer();
	});
});












