// config contains
// -- position
// -- initial handler
// -- color
// -- head color
function Snake(config) {
	_.extend(this, config);

	this._handlers = [];
	this.pieces = [];

	this.pushHandler(config.handler);
	this.grow(this.position);
};

// handlers
// 	-- move the snake
// 	-- handle hit detection
// 	-- handle key input

Snake.prototype = {
	pushHandler: function(handler) {
		this._handlers.push(handler);
		handler.init(true);
	},

	popHandler: function(){
		this._handlers.pop();
		if(this._handlers.length) {
			this._handlers.last.init();
		}
	},

	grow: function(position) {
		this.pieces.add(position);
	},

	prune: function(index) {
		
	},
	
	render: function(context, offsetX, offsetY) {

	}
};


PullHandler = function(config) {
};

PullHandler.prototype = {
	init: function(isFirstTime) {
	},

	
};




