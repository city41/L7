(function() {
	var _global = this;

	_global.L7 = _global.L7 || {};

	_global.L7.global = _global;

	Object.defineProperty(_global.L7, 'useWebGL', {
		get: function() {
			return this._useWebGL;
		},
		set: function(useWebGL) {
			if(this.hasOwnProperty('_useWebGL')) {
				throw new Error('You can only set useWebGL once');
			}
			this._useWebGL = useWebGL;
		}
	});

	_global.L7.isFirefox = window.navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
	_global.L7.isChrome = window.navigator.userAgent.toLowerCase().indexOf('chrome') > -1;

	_global.L7.isSupportedBrowser = _global.L7.isFirefox || _global.L7.isChrome;

	_global.L7.isWebGLAvailable = (function() {
		var canvas = document.createElement('canvas');

		if(!canvas) {
			return false;
		}

		try {
			return !!canvas.getContext('experimental-webgl');
		} catch(e) {
			return false;
		}
	})();

})();

(function() {
	L7.AnimationFactory = function(owner, board) {
		this._owner = owner;
		this._board = board;
		this._buildStack = [];
		this._targetStack = [];
		this._addedAnis = [];
	};

	L7.AnimationFactory.prototype = {
		_getBoard: function() {
			return this._board || this._owner.board;
		},
		_determineTargets: function(targetOptions) {
			if(targetOptions.targets) {
				return targetOptions.targets;
			} else {
				return this._owner.getAnimationTargets(targetOptions.filter);
			}
		},
		_addAnimationToBoard: function(ani) {
			this._addedAnis.push(ani);
			this._getBoard().addDaemon(ani);
		},
		_addParentAnimation: function(builder, targetOptions, AniConstructor, consArg) {
			var ani = new AniConstructor(consArg);

			if(targetOptions) {
				var targets = this._determineTargets(targetOptions);
				this._targetStack.push(targets);
			}

			this._buildStack.push(ani);
			builder(this);
			this._buildStack.pop();
			if(targetOptions) {
				this._targetStack.pop();
			}

			if (this._buildStack.length === 0) {
				this._addAnimationToBoard(ani);
			} else {
				this._buildStack.last.children.add(ani);
			}
			return ani;
		},
		_addAnimation: function(config, AniConstructor) {
			if (!config.targets) {
				if(typeof config.filter !== 'undefined') {
					config.targets = this._owner.getAnimationTargets(config.filter);
				} else if(this._targetStack.length > 0) {
					config.targets = this._targetStack.last;
				} else {
					config.targets = this._owner.getAnimationTargets();
				}
			}

			var ani = new AniConstructor(config);

			if (this._buildStack.length === 0) {
				this._addAnimationToBoard(ani);
			} else {
				this._buildStack.last.children.add(ani);
			}
			return ani;
		},
		disco: function(config) {
			return this._addAnimation(config, L7.Disco);
		},
		shimmer: function(config) {
			return this._addAnimation(config, L7.Shimmer);
		},
		plasma: function(config) {
			return this._addAnimation(config, L7.Plasma);
		},
		setProperty: function(config) {
			config.duration = 0;
			config.from = config.to = config.value;
			return this.tween(config);
		},
		copyProperty: function(config) {
			return this._addAnimation(config, L7.CopyProperty);
		},
		tween: function(config) {
			return this._addAnimation(config, L7.Tween);
		},
		frame: function(config) {
			return this._addAnimation(config, L7.Frame);
		},
		fadeIn: function(config) {
			return this._addAnimation(config, L7.FadeIn);
		},
		sequence: function(targetOptionsOrBuilder, builderOrUndefined) {
			return this.repeat(1, targetOptionsOrBuilder, builderOrUndefined);
		},
		together: function(targetOptionsOrBuilder, builderOrUndefined) {
			var targetOptions;
			var builder;

			if (_.isFunction(targetOptionsOrBuilder)) {
				builder = targetOptionsOrBuilder;
			} else {
				targetOptions = targetOptionsOrBuilder;
				builder = builderOrUndefined;
			}

			return this._addParentAnimation(builder, targetOptions, L7.Together);
		},

		repeat: function(count, targetOptionsOrBuilder, builderOrUndefined) {
			var targetOptions;
			var builder;

			if (_.isFunction(targetOptionsOrBuilder)) {
				builder = targetOptionsOrBuilder;
			} else {
				targetOptions = targetOptionsOrBuilder;
				builder = builderOrUndefined;
			}

			return this._addParentAnimation(builder, targetOptions, L7.Repeat, count);
		},

		wait: function(millis) {
			return this.waitBetween(millis, millis);
		},

		waitBetween: function(min, max) {
			return this._addAnimation({
				min: min,
				max: max
			},
			L7.Wait);
		},

		invoke: function(func) {
			return this._addAnimation({
				func: func
			},
			L7.Invoke);
		},

		end: function() {
			var rootAni = this._buildStack.first;

			if(rootAni) {
				var me = this;
				return this.invoke(function() {
					me._getBoard().removeDaemon(rootAni);
				});
			}
		},

		die: function() {
			var board = this._getBoard();
			this._addedAnis.forEach(function(ani) {
				board.removeDaemon(ani);
			});
		}
	};

})();

(function() {
	L7.CopyProperty = function(config) {
		_.extend(this, config);
	};

	L7.CopyProperty.prototype = {
		reset: function() {
		},

		update: function() {
			if(this.done || this.disabled) {
				return;
			}

			var target;
			for(var i = 0; i < this.targets.length; ++i) {
				target = this.targets[i];
				target[this.destProperty] = target[this.srcProperty];
			}

			this.done = true;
		}
	};
})();

(function() {
	var _majorOverlayColor = [255, 255, 255, 0.9];
	var _minorOverlayColor = [255, 255, 255, 0.6];

	L7.Disco = function(config) {
		_.extend(this, config);
		this.reset();
	}

	L7.Disco.prototype = {
		reset: function() {
			this.done = false;
			this.even = true;
			this._elapsed = 0;
			this._discoCount = 0;
		},

		update: function(delta, timestamp, board) {
			if(this.done) {
				return;
			}

			this._elapsed += delta;

			if (this._elapsed >= this.rate) {
				this.even = !this.even;
				this._doDisco(this.even, this.targets, this.width);
				this._elapsed -= this.rate;
				++this._discoCount;
			}

			this.done = this._discoCount >= 2;
		},

		_doDisco: function(even, tiles, width) {
			for(var i = 0; i < tiles.length; ++i) {
				var x = i % width;
				if(x === 0) {
					even = !even;
				}

				if(even) {
					if((x & 1) === 0) {
						tiles[i].overlayColor = _majorOverlayColor;
					} else {
						tiles[i].overlayColor = _minorOverlayColor;
					}
				} else {
					if((x & 1) === 1) {
						tiles[i].overlayColor = _majorOverlayColor;
					} else {
						tiles[i].overlayColor = _minorOverlayColor;
					}
				}
			}
		}
	};
})();



/*
  Easing Equations v1.5
  May 1, 2003
  (c) 2003 Robert Penner, all rights reserved. 
  This work is subject to the terms in http://www.robertpenner.com/easing_terms_of_use.html.  
  
  These tweening functions provide different flavors of 
  math-based motion under a consistent API. 
  
  Types of easing:
  
	  Linear
	  Quadratic
	  Cubic
	  Quartic
	  Quintic
	  Sinusoidal
	  Exponential
	  Circular
	  Elastic
	  Back
	  Bounce

  Changes:
  1.5 - added bounce easing
  1.4 - added elastic and back easing
  1.3 - tweaked the exponential easing functions to make endpoints exact
  1.2 - inline optimizations (changing t and multiplying in one step)--thanks to Tatsuo Kato for the idea
  
  Discussed in Chapter 7 of 
  Robert Penner's Programming Macromedia Flash MX
  (including graphs of the easing equations)
  
  http://www.robertpenner.com/profmx
  http://www.amazon.com/exec/obidos/ASIN/0072223561/robertpennerc-20
*/


// simple linear tweening - no easing
// t: current time, b: beginning value, c: change in value, d: duration
Math.linearTween = function (t, b, c, d) {
	return c*t/d + b;
};


 ///////////// QUADRATIC EASING: t^2 ///////////////////

// quadratic easing in - accelerating from zero velocity
// t: current time, b: beginning value, c: change in value, d: duration
// t and d can be in frames or seconds/milliseconds
Math.easeInQuad = function (t, b, c, d) {
	return c*(t/=d)*t + b;
};

// quadratic easing out - decelerating to zero velocity
Math.easeOutQuad = function (t, b, c, d) {
	return -c *(t/=d)*(t-2) + b;
};

// quadratic easing in/out - acceleration until halfway, then deceleration
Math.easeInOutQuad = function (t, b, c, d) {
	if ((t/=d/2) < 1) return c/2*t*t + b;
	return -c/2 * ((--t)*(t-2) - 1) + b;
};


 ///////////// CUBIC EASING: t^3 ///////////////////////

// cubic easing in - accelerating from zero velocity
// t: current time, b: beginning value, c: change in value, d: duration
// t and d can be frames or seconds/milliseconds
Math.easeInCubic = function (t, b, c, d) {
	return c*(t/=d)*t*t + b;
};

// cubic easing out - decelerating to zero velocity
Math.easeOutCubic = function (t, b, c, d) {
	return c*((t=t/d-1)*t*t + 1) + b;
};

// cubic easing in/out - acceleration until halfway, then deceleration
Math.easeInOutCubic = function (t, b, c, d) {
	if ((t/=d/2) < 1) return c/2*t*t*t + b;
	return c/2*((t-=2)*t*t + 2) + b;
};


 ///////////// QUARTIC EASING: t^4 /////////////////////

// quartic easing in - accelerating from zero velocity
// t: current time, b: beginning value, c: change in value, d: duration
// t and d can be frames or seconds/milliseconds
Math.easeInQuart = function (t, b, c, d) {
	return c*(t/=d)*t*t*t + b;
};

// quartic easing out - decelerating to zero velocity
Math.easeOutQuart = function (t, b, c, d) {
	return -c * ((t=t/d-1)*t*t*t - 1) + b;
};

// quartic easing in/out - acceleration until halfway, then deceleration
Math.easeInOutQuart = function (t, b, c, d) {
	if ((t/=d/2) < 1) return c/2*t*t*t*t + b;
	return -c/2 * ((t-=2)*t*t*t - 2) + b;
};


 ///////////// QUINTIC EASING: t^5  ////////////////////

// quintic easing in - accelerating from zero velocity
// t: current time, b: beginning value, c: change in value, d: duration
// t and d can be frames or seconds/milliseconds
Math.easeInQuint = function (t, b, c, d) {
	return c*(t/=d)*t*t*t*t + b;
};

// quintic easing out - decelerating to zero velocity
Math.easeOutQuint = function (t, b, c, d) {
	return c*((t=t/d-1)*t*t*t*t + 1) + b;
};

// quintic easing in/out - acceleration until halfway, then deceleration
Math.easeInOutQuint = function (t, b, c, d) {
	if ((t/=d/2) < 1) return c/2*t*t*t*t*t + b;
	return c/2*((t-=2)*t*t*t*t + 2) + b;
};



 ///////////// SINUSOIDAL EASING: sin(t) ///////////////

// sinusoidal easing in - accelerating from zero velocity
// t: current time, b: beginning value, c: change in position, d: duration
Math.easeInSine = function (t, b, c, d) {
	return -c * Math.cos(t/d * (Math.PI/2)) + c + b;
};

// sinusoidal easing out - decelerating to zero velocity
Math.easeOutSine = function (t, b, c, d) {
	return c * Math.sin(t/d * (Math.PI/2)) + b;
};

// sinusoidal easing in/out - accelerating until halfway, then decelerating
Math.easeInOutSine = function (t, b, c, d) {
	return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;
};


 ///////////// EXPONENTIAL EASING: 2^t /////////////////

// exponential easing in - accelerating from zero velocity
// t: current time, b: beginning value, c: change in position, d: duration
Math.easeInExpo = function (t, b, c, d) {
	return (t==0) ? b : c * Math.pow(2, 10 * (t/d - 1)) + b;
};

// exponential easing out - decelerating to zero velocity
Math.easeOutExpo = function (t, b, c, d) {
	return (t==d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b;
};

// exponential easing in/out - accelerating until halfway, then decelerating
Math.easeInOutExpo = function (t, b, c, d) {
	if (t==0) return b;
	if (t==d) return b+c;
	if ((t/=d/2) < 1) return c/2 * Math.pow(2, 10 * (t - 1)) + b;
	return c/2 * (-Math.pow(2, -10 * --t) + 2) + b;
};


 /////////// CIRCULAR EASING: sqrt(1-t^2) //////////////

// circular easing in - accelerating from zero velocity
// t: current time, b: beginning value, c: change in position, d: duration
Math.easeInCirc = function (t, b, c, d) {
	return -c * (Math.sqrt(1 - (t/=d)*t) - 1) + b;
};

// circular easing out - decelerating to zero velocity
Math.easeOutCirc = function (t, b, c, d) {
	return c * Math.sqrt(1 - (t=t/d-1)*t) + b;
};

// circular easing in/out - acceleration until halfway, then deceleration
Math.easeInOutCirc = function (t, b, c, d) {
	if ((t/=d/2) < 1) return -c/2 * (Math.sqrt(1 - t*t) - 1) + b;
	return c/2 * (Math.sqrt(1 - (t-=2)*t) + 1) + b;
};


 /////////// ELASTIC EASING: exponentially decaying sine wave  //////////////

// t: current time, b: beginning value, c: change in value, d: duration, a: amplitude (optional), p: period (optional)
// t and d can be in frames or seconds/milliseconds

Math.easeInElastic = function (t, b, c, d, a, p) {
	if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
	if (a < Math.abs(c)) { a=c; var s=p/4; }
	else var s = p/(2*Math.PI) * Math.asin (c/a);
	return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
};

Math.easeOutElastic = function (t, b, c, d, a, p) {
	if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
	if (a < Math.abs(c)) { a=c; var s=p/4; }
	else var s = p/(2*Math.PI) * Math.asin (c/a);
	return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
};

Math.easeInOutElastic = function (t, b, c, d, a, p) {
	if (t==0) return b;  if ((t/=d/2)==2) return b+c;  if (!p) p=d*(.3*1.5);
	if (a < Math.abs(c)) { a=c; var s=p/4; }
	else var s = p/(2*Math.PI) * Math.asin (c/a);
	if (t < 1) return -.5*(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
	return a*Math.pow(2,-10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )*.5 + c + b;
};


 /////////// BACK EASING: overshooting cubic easing: (s+1)*t^3 - s*t^2  //////////////

// back easing in - backtracking slightly, then reversing direction and moving to target
// t: current time, b: beginning value, c: change in value, d: duration, s: overshoot amount (optional)
// t and d can be in frames or seconds/milliseconds
// s controls the amount of overshoot: higher s means greater overshoot
// s has a default value of 1.70158, which produces an overshoot of 10 percent
// s==0 produces cubic easing with no overshoot
Math.easeInBack = function (t, b, c, d, s) {
	if (s == undefined) s = 1.70158;
	return c*(t/=d)*t*((s+1)*t - s) + b;
};

// back easing out - moving towards target, overshooting it slightly, then reversing and coming back to target
Math.easeOutBack = function (t, b, c, d, s) {
	if (s == undefined) s = 1.70158;
	return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
};

// back easing in/out - backtracking slightly, then reversing direction and moving to target,
// then overshooting target, reversing, and finally coming back to target
Math.easeInOutBack = function (t, b, c, d, s) {
	if (s == undefined) s = 1.70158; 
	if ((t/=d/2) < 1) return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
	return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
};


 /////////// BOUNCE EASING: exponentially decaying parabolic bounce  //////////////

// bounce easing in
// t: current time, b: beginning value, c: change in position, d: duration
Math.easeInBounce = function (t, b, c, d) {
	return c - Math.easeOutBounce (d-t, 0, c, d) + b;
};

// bounce easing out
Math.easeOutBounce = function (t, b, c, d) {
	if ((t/=d) < (1/2.75)) {
		return c*(7.5625*t*t) + b;
	} else if (t < (2/2.75)) {
		return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
	} else if (t < (2.5/2.75)) {
		return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
	} else {
		return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
	}
};

// bounce easing in/out
Math.easeInOutBounce = function (t, b, c, d) {
	if (t < d/2) return Math.easeInBounce (t*2, 0, c, d) * .5 + b;
	return Math.easeOutBounce (t*2-d, 0, c, d) * .5 + c*.5 + b;
};


//trace (">> Penner easing equations loaded");







(function() {
	var _idCounter = 0;
	L7.FadeIn = function(config) {
		_.extend(this, config);
		this.reset();

		this._easeFunc = Math[this.easing || 'linearTween'];
		this._easeFunc = this._easeFunc || Math.linearTween;
	};

	L7.FadeIn.prototype = {
		reset: function() {
			this._elapsed = 0;
			this.done = this._elapsed >= this.duration;
			this._initted = false;
		},

		_initTargets: function() {
			this.targets.forEach(function(target) {
				target.color[3] = 0;
			});
		},

		update: function(delta, timestamp, board) {
			if (!this._initted) {
				this._initTargets();
				this._initted = true;
			}

			if (this.done || this.disabled) {
				return;
			}

			this._elapsed += delta;
			if (this._elapsed > this.duration) {
				this._elapsed = this.duration;
				this.done = true;
			}

			var l = this.targets.length;

			var alpha = this._easeFunc(this._elapsed, 0, 1, this.duration);
			while (l--) {
				this.targets[l].color[3] = alpha;
			}
		}
	};
})();

(function() {
	L7.Frame = function(config) {
		_.extend(this, config);
		this.pieceSetIndex = this.pieceSetIndex || 0;
		this.reset();
	};

	L7.Frame.prototype = {
		reset: function() {
			this._elapsed = 0;
			this._curFrame = 0;
			this.done = false;
			this._initted = false;
		},

		_initTargets: function() {
			this.targets.forEach(function(target) {
				target.setFrame(this.pieceSetIndex, 0);
				target._frameDir = 1;
				target._curFrame = 0;
			},
			this);
		},

		update: function(delta, timestamp, board) {
			if (!this._initted) {
				this._initTargets();
				this._initted = true;
			}

			if (this.done || this.disabled) {
				return;
			}

			this._elapsed += delta;
			if (this._elapsed >= this.rate) {
				this._elapsed -= this.rate;
				this._nextFrame();
			}
		},

		_nextFrame: function() {
			var looping = this.looping;
			var psi = this.pieceSetIndex;

			this.targets.forEach(function(target) {
				var max = target.pieceSets[psi].length - 1;
				target._curFrame += target._frameDir;

				if (target._curFrame < 0) {
					target._curFrame = 1;
					target._frameDir = 1;
				}

				if (target._curFrame > max) {
					if (looping === 'backforth') {
						target._curFrame = max - 1;
						target._frameDir = - 1;
					} else {
						target._curFrame = 0;
					}
				}

				target.setFrame(psi, target._curFrame);
			});
		}
	}
})();

(function() {
	var _idCounter = 0;
	L7.Invoke = function(config) {
		_.extend(this, config);
		this.reset();
	}

	L7.Invoke.prototype = {
		reset: function() {
			this.done = false;
		},

		update: function(delta, timestamp, board) {
			if(this.done) {
				return;
			}

			this.func();
			this.done = true;
		}
	};
})();


(function() {
	function dist(a, b, c, d) {
		return Math.sqrt((a - c) * (a - c) + (b - d) * (b - d));
	}

	function color(x, y, time, width, height) {
		// plasma function
		return (128 + (128 * Math.sin(x * 0.0625)) + 128 + (128 * Math.sin(y * 0.03125)) + 128 + (128 * Math.sin(dist(x + time, y - time, width, height) * 0.125)) + 128 + (128 * Math.sin(Math.sqrt(x * x + y * y) * 0.125))) * 0.25;
	}

	L7.Plasma = function(config) {
		_.extend(this, config);

		this._width = this._determineDim(this.targets, 'x');
		this._height = this._determineDim(this.targets, 'y');
		this._paletteOffset = 0;
		this._palette = this._createPalette();
		this.reset();
	};

	L7.Plasma.prototype = {
		reset: function() {
			this.done = false;
			this._elapsed = 0;
			this._doPlasma(this._width, this._height, this.targets, this._paletteOffset);
		},
		update: function(delta, timestamp, board) {
			this._elapsed += delta;
			if (this._elapsed >= this.rate) {
				this._paletteOffset += 1;
				this.done = true;
			}
		},

		_createPalette: function() {
			var palette = [];
			var rw = (this.weights && _.isNumber(this.weights[0])) ? this.weights[0] : 1;
			var gw = (this.weights && _.isNumber(this.weights[1])) ? this.weights[1] : 1;
			var bw = (this.weights && _.isNumber(this.weights[2])) ? this.weights[2] : 1;
			var alpha = this.alpha || 1;
			var n = this.noise || 1;

			for (var i = 0, r, g, b; i < 256; i++) {
				r = ~~ (128 + 128 * Math.sin(Math.PI * i / (32 / n)));
				g = ~~ (128 + 128 * Math.sin(Math.PI * i / (64 / n)));
				b = ~~ (128 + 128 * Math.sin(Math.PI * i / (128 / n)));
				r = Math.min(255, r*rw);
				g = Math.min(255, g*gw);
				b = Math.min(255, b*bw);

				palette[i] = [r,g,b,alpha];
			}

			return palette;
		},

		_determineDim: function(targets, dim) {
			var min = Math.min.apply(null, targets.map(function(t) {
				return t.position[dim]
			}));
			var max = Math.max.apply(null, targets.map(function(t) {
				return t.position[dim]
			}));

			return max - min + 1;
		},

		_doPlasma: function(width, height, targets, time) {
			for (var y = 0, x; y < height; ++y) {
				for (x = 0; x < width; ++x) {
					var t = targets[width * y + x];
					if (t) {
						t.overlayColor = this._palette[~~ (color(x, y, time, width, height) + time) % 256];
					}
				}
			}
		}
	};
})();

(function() {
	L7.Repeat = function(count) {
		this.children = [];
		this._currentChild = 0;
		this._curCount = 0;
		this.count = count;
	};

	L7.Repeat.prototype = {
		reset: function() {
			this.done = false;
			this._currentChild = 0;
			this._curCount = 0;

			this.children.forEach(function(child) {
				child.reset();
			});
		},

		update: function() {
			// TODO: problem, this is causing "time leak"
			// children might have less than delta to go, if so, they will only
			// go as far as they need to, and the rest of the delta gets thrown away
			// if there is left over delta, it should go to the next child

			this.done = this._curCount >= this.count;

			if(this.done) {
				return;
			}

			var curChild = this.children[this._currentChild];

			curChild.update.apply(curChild, arguments);


			if(curChild.done) {
				++this._currentChild;

				if(this._currentChild >= this.children.length) {
					this._currentChild = 0;

					++this._curCount;
					this.children.forEach(function(child) {
						child.reset();
					});
				}

			}
			this.done = this._curCount >= this.count;
		}
	};
})();


(function() {
	var _idCounter = 0;
	L7.Shimmer = function(config) {
		_.extend(this, config);
		this.reset();
	}

	L7.Shimmer.prototype = {
		reset: function() {
			this.done = false;
		},

		_initTargets: function() {
			var fullRange = this.maxAlpha - this.minAlpha;

			var color = this.color || [255, 255, 255, 1];

			this.targets.forEach(function(target) {
				target.opaque = true;
				target.overlayColor = color.slice(0);
				target.overlayColor[3] = L7.rand(this.minAlpha, this.maxAlpha);
				target.shimmerRate = Math.floor(L7.rand(this.baseRate - this.baseRate * this.rateVariance, this.baseRate + this.baseRate * this.rateVariance));
				target.shimmerAlphaPerMilli = fullRange / target.shimmerRate;
				target.shimmerDirection = 1;
			},
			this);
		},

		update: function(delta, timestamp, board) {
			if(!this._initted) {
				this._initTargets();
				this._initted = true;
			}

			if(this.done) {
				return;
			}

			this.targets.forEach(function(target) {
				var rate = target.shimmerAlphaPerMilli * target.shimmerDirection;
				var alphaChange = delta * rate;
				target.overlayColor[3] += alphaChange;
				var alpha = target.overlayColor[3];

				if (alpha > this.maxAlpha) {
					target.shimmerDirection = - 1;
					target.overlayColor[3] = this.maxAlpha;
				}

				if (alpha < this.minAlpha) {
					target.shimmerDirection = 1;
					target.overlayColor[3] = this.minAlpha;
				}
			},
			this);

			this.done = true;
		}
	};
})();


(function() {
	L7.Together = function() {
		this.children = [];
	};

	L7.Together.prototype = {
		reset: function() {
			this.done = false;
			this.children.forEach(function(child) {
				child.reset();
			});
		},

		update: function() {
			// TODO: problem, this is causing "time leak"
			// children might have less than delta to go, if so, they will only
			// go as far as they need to, and the rest of the delta gets thrown away
			// if there is left over delta, it should go to the next child

			if(this.done) {
				return;
			}

			var args = _.toArray(arguments);
			var childNotDone = false;

			this.children.forEach(function(child) {
				child.update.apply(child, args);
				if(!child.done) {
					childNotDone = true;
				}
			});

			this.done = !childNotDone;
		}
	};
})();


(function() {
	var _idCounter = 0;
	L7.Tween = function(config) {
		_.extend(this, config);
		this.reset();

		this._saveProperty = this.property + "_save_" + (_idCounter++);
		this._nonJitteredProperty = this.property + "_nonJittered_" + (_idCounter++);

		this._easeFunc = Math[this.easing || 'linearTween'];
		this._easeFunc = this._easeFunc || Math.linearTween;
	};

	L7.Tween.prototype = {
		reset: function() {
			this._elapsed = 0;
			this.done = this._elapsed >= this.duration;
			this._initted = false;
		},

		_initTargets: function() {
			this.targets.forEach(function(target) {
				target[this._saveProperty] = target[this.property];
				if(_.isArray(target[this._saveProperty])) {
					target[this._saveProperty] = target[this._saveProperty].slice(0);
				}

				var value = this.hasOwnProperty('from') ? this.from : target[this.property];

				if (!_.isUndefined(value)) {
					if (_.isArray(value)) {
						value = value.slice(0);
					}

					target[this.property] = value;
				}
			},
			this);
		},

		update: function(delta, timestamp, board) {
			if (!this._initted) {
				this._initTargets();
				this._initted = true;
			}

			if (this.done || this.disabled) {
				return;
			}

			this._elapsed += delta;
			if (this._elapsed > this.duration) {
				this._elapsed = this.duration;
				this.done = true;
			}

			this.targets.forEach(function(target) {
				this._tween(target);
			},
			this);

			if (this.done) {
				this.targets.forEach(function(target) {
					if (this.restoreAfter) {
						target[this.property] = target[this._saveProperty];
					}
					delete target[this._saveProperty];
					delete target[this._nonJitteredProperty];
				},
				this);
			}
		},

		_tween: function(target) {
			if (_.isArray(target[this.property])) {
				var array = target[this.property];
				for (var i = 0; i < array.length; ++i) {
					var from = this.from || target[this._saveProperty];
					array[i] = this._tweenValue(this._elapsed, from[i], this.to[i], this.duration);
				}
			} else if (_.isNumber(target[this.property])) {
				target[this.property] = this._tweenValue(this._elapsed, this.from, this.to, this.duration);
			}
		},

		_tweenValue: function(elapsed, from, to, duration) {
			var position = this._easeFunc(elapsed, from, to - from, duration);

			if (_.isNumber(this.jitterMin)) {
				position += L7.rand(this.jitterMin, this.jitterMax || 0);
			}

			return position;
		}
	};
})();

(function() {
	var _idCounter = 0;
	L7.Wait = function(config) {
		_.extend(this, config);
		this._specifiedDuration = this.duration;
		this.reset();
	}

	L7.Wait.prototype = {
		reset: function() {
			this.duration = this._specifiedDuration || L7.rand(this.min, this.max);
			this._elapsed = 0;
			this.done = this._elapsed >= this.duration;
		},

		update: function(delta, timestamp, board) {
			if(this.done) {
				return;
			}

			this._elapsed += delta;
			this.done = this._elapsed >= this.duration;
		}
	};
})();

(function() {
	var _noOffset = {
		x: 0,
		y: 0
	};

	L7.Actor = function(config) {
		_.extend(this, L7.Observable);
		_.extend(this, config);
		this.ani = new L7.AnimationFactory(this);

		this.position = this.position || L7.p(0, 0);
		this.keyInputs = this.keyInputs || {};

		if (this.framesConfig) {
			this.pieces = this._initFrames();
		} else {
			this.shape = this.shape || [[5]];
			this.pieces = this._createPieces();
		}

		this._listeners = {};

		this._offsetElapsed = 0;
	};

	L7.Actor.prototype = {
		setFrame: function(setIndex, frameIndex) {
			var board = this.board;

			if (this.pieceSets) {
				if (board) {
					board.removeActor(this);
					this.pieces = this.pieceSets[setIndex][frameIndex];
					board.addActor(this);
				} else {
					this.pieces = this.pieceSets[setIndex][frameIndex];
				}
			}
		},

		_getMaxFrame: function(sets) {
			var maxFrame = 0;
			sets = sets || [];

			sets.forEach(function(set) {
				set.forEach(function(index) {
					if (index > maxFrame) {
						maxFrame = index;
					}
				});
			});

			return maxFrame + 1;
		},

		_createPiecesFromImagehorizontal: function() {
			var offset = this.framesConfig.offset || L7.p(0, 0);
			var me = this;
			var pieceSources = [];

			var canvas = document.createElement('canvas');
			var context = canvas.getContext('2d');
			context.drawImage(this.framesConfig.src, 0, 0);

			var anchorOffset = this.framesConfig.anchor;
			var anchorPosition = this.position;

			function getRelPos(i) {
				i = i / 4;
				var x = i % me.framesConfig.width;
				var y = Math.floor(i / me.framesConfig.width);

				return L7.p(x, y);
			}

			var maxFrame = this._getMaxFrame(this.framesConfig.sets);
			var maxWidth = maxFrame * this.framesConfig.width;

			for (var x = 0; x < maxWidth; x += this.framesConfig.width) {
				var imageData = context.getImageData(x + offset.x, 0 + offset.y, this.framesConfig.width, this.framesConfig.height);
				var pieceSource = [];

				for (var i = 0; i < imageData.data.length; i += 4) {
					var alpha = imageData.data[i + 3] / 255;

					if (alpha) {
						var relPos = getRelPos(i);
						var anchorDelta = relPos.delta(anchorOffset);
						var piece = new L7.Piece({
							anchorDelta: anchorDelta,
							color: [imageData.data[i], imageData.data[i + 1], imageData.data[i + 2], alpha],
							owner: this,
							scale: _.isNumber(this.scale) ? this.scale: 1
						});
						pieceSource.push(piece);
					}
				}
				pieceSources.push(pieceSource);
			}

			return pieceSources;
		},

		_initFrames: function() {
			var pieceSources = this['_createPiecesFromImage' + this.framesConfig.direction]();

			this.pieceSets = [];

			this.framesConfig.sets.forEach(function(set) {
				var pieces = [];
				for (var i = 0; i < set.length; ++i) {
					pieces.push(pieceSources[set[i]]);
				}
				this.pieceSets.push(pieces);
			},
			this);

			return this.pieceSets[this.framesConfig.initialSet][this.framesConfig.initialFrame];
		},

		getAnimationTargets: function(filter) {
			if (filter) {
				return this.pieces.filter(filter);
			} else {
				return this.pieces;
			}
		},

		clicked: function() {
			this.fireEvent('click', this);
		},

		_getAnchorOffset: function() {
			var x, y;

			for (y = 0; y < this.shape.length; ++y) {
				for (x = 0; x < this.shape[y].length; ++x) {
					if (this.shape[y][x] === L7.Actor.ANCHOR) {
						return L7.p(x, y);
					}
				}
			}

			throw new Error("shape specified but lacks an anchor");
		},

		_getColor: function(x, y) {
			if (!this.color) {
				return;
			}

			if (_.isNumber(this.color[0])) {
				return this.color.slice(0);
			} else {
				return this.color[y][x].slice(0);
			}
		},

		_createPieces: function() {
			var pieces = [];

			var anchorOffset = this._getAnchorOffset();
			var anchorPosition = this.position;

			for (var y = 0; y < this.shape.length; ++y) {
				var srow = this.shape[y];
				for (var x = 0; x < srow.length; ++x) {
					if (this.shape[y][x]) {
						var anchorDelta = L7.p(x, y).delta(anchorOffset);
						var color = this._getColor(x, y);
						var piece = new L7.Piece({
							anchorDelta: anchorDelta,
							color: color,
							owner: this,
							scale: _.isNumber(this.scale) ? this.scale: 1
						});
						pieces.push(piece);
					}
				}
			}

			return pieces;
		},

		_getPiecePositionsAnchoredAt: function(pos) {
			var delta = pos.delta(this.position);
			var positions = [];

			_.each(this.pieces, function(piece) {
				positions.push(this.position.add(delta).add(piece.anchorDelta));
			},
			this);

			return positions;
		},

		left: function(amount) {
			this.goTo(this.position.add(-amount, 0));
		},

		right: function(amount) {
			this.goTo(this.position.add(amount, 0));
		},

		up: function(amount) {
			this.goTo(this.position.add(0, - amount));
		},

		down: function(amount) {
			this.goTo(this.position.add(0, amount));
		},

		goBack: function() {
			this.goTo(this._lastPosition.clone());
		},

		goTo: function(newPosition) {
			if (this.onGoTo) {
				if (!this.onGoTo(this._getPiecePositionsAnchoredAt(this.position), this._getPiecePositionsAnchoredAt(newPosition), this.board)) {
					return;
				}
			}

			if (!this.smoothMovement && this.board) {
				this.board.moveActor({
					actor: this,
					from: this.position,
					to: newPosition
				});
			} else {
				this._nextPosition = newPosition;
			}
		},

		die: function(suppressEvent) {
			if (this.board) {
				this.ani.die();
				this.board.removeActor(this);
			}
			this.dead = true;

			if (!suppressEvent) {
				this.fireEvent('dead', this);
			}
		},

		update: function(delta, timestamp) {
			this._updateKeyInputs(delta, timestamp);
			this._updateTimers(delta);
			this._lastTimestamp = timestamp;

			if (this.smoothMovement && this._nextPosition) {
				this._offsetElapsed += delta;
				if (this._offsetElapsed >= this.rate) {
					this._offsetElapsed -= this.rate;
					this.board.moveActor({
						actor: this,
						from: this.position,
						to: this._nextPosition
					});
					this.onSmoothMovement && this.onSmoothMovement();
				}

				var offsets = _noOffset;

				var offset = this._offsetElapsed / this.rate;
				var towards = this._nextPosition.delta(this.position);
				offsets = {
					x: offset * towards.x,
					y: offset * towards.y
				};

				this.pieces.forEach(function(piece) {
					piece.offset = offsets;
				});
			}
		},

		_updateKeyInputs: function(delta, timestamp) {
			var keyWasDown = false;
			_(this.keyInputs).each(function(value, key) {
				if (value.repeat && L7.Keys.down(key) || L7.Keys.downSince(key, this._lastTimestamp || 0)) {
					keyWasDown = true;
					value._elapsed = value._elapsed || 0;
					value._elapsed += delta;

					if (typeof value.enabled === 'undefined' || value.enabled.call(this)) {
						if (!value.rate || value._elapsed > value.rate) {
							value.handler.call(this, delta);
							value._elapsed -= (value.rate || 0);
						}
					}
				} else {
					value._elapsed = 0;
				}
			},
			this);

			if (!keyWasDown && this.onNoKeyDown) {
				this.onNoKeyDown(delta);
			}
		},

		_updateTimers: function(delta) {
			if (!this.timers) {
				return;
			}

			_.each(this.timers, function(timer) {
				if (typeof timer.enabled === 'undefined' || timer.enabled === true || (typeof timer.enabled === 'function' && timer.enabled.call(this))) {

					timer.elapsed = timer.elapsed || 0;
					timer.elapsed += delta;
					if (timer.elapsed >= timer.interval) {
						timer.elapsed -= timer.interval;
						timer.handler.call(this);
					}
				}
			},
			this);
		},

		pieceAt: function(pairOrX, yOrUndefined) {
			var x, y;

			if (_.isNumber(pairOrX)) {
				x = pairOrX;
				y = yOrUndefined;
			} else {
				x = pairOrX.x;
				y = pairOrX.y;
			}

			var l = this.pieces.length,
			p;

			while (l--) {
				p = this.pieces[l];
				var position = this.position.add(p.anchorDelta);
				if (position.x === x && position.y === y) {
					return p;
				}
			}
		}
	};

	Object.defineProperty(L7.Actor, 'ANCHOR', {
		get: function() {
			return 5;
		},
		enumerable: false
	});

	Object.defineProperty(L7.Actor.prototype, 'board', {
		get: function() {
			return this._board;
		},
		set: function(board) {
			var origBoard = this._board;
			this._board = board;

			if (board && board != origBoard && this.onBoardSet) {
				this.onBoardSet();
			}
		},
		enumerable: true
	});

})();

(function() {
	L7.Board = function(config) {
		_.extend(this, config || {});
		_.extend(this, L7.Observable);

		if (L7.useWebGL) {
			_.extend(L7.Board.prototype, L7.WebGLBoardRenderMixin);
		} else {
			_.extend(L7.Board.prototype, L7.CanvasBoardRenderMixin);
		}

		this.ani = new L7.AnimationFactory(this, this);
		this.size = new L7.Pair(this.width || 0, this.height || 0);
		this.borderWidth = this.borderWidth || 0;
		this.tileSize = this.tileSize || 0;
		this.freezeDuration = 0;

		this._rows = [];
		this.tiles = [];
		for (var y = 0; y < this.height; ++y) {
			var row = [];
			for (var x = 0; x < this.width; ++x) {
				var tile = new L7.Tile({
					x: x,
					y: y,
					board: this
				});
				tile.color = _.clone(this.defaultTileColor);
				row.push(tile);
				this.tiles.push(tile);
			}
			this._rows.push(row);
		}

		this.actors = [];
		this.freeActors = [];
		this.daemons = [];

		this.viewportWidth = Math.min(this.viewportWidth || this.width, this.width);
		this.viewportHeight = Math.min(this.viewportHeight || this.height, this.height);
		this.viewportAnchorX = (this.viewportAnchor && this.viewportAnchor.x) || 0;
		this.viewportAnchorY = (this.viewportAnchor && this.viewportAnchor.y) || 0;
		delete this.viewportAnchor;

		this._hitManager = new L7.HitManager();
	};

	L7.Board.prototype = {
		clicked: function(position) {
			var tile = this.tileAtPixels(position);

			if (tile && tile.inhabitants.length > 0) {
				tile.inhabitants.last.owner.clicked();
				return true;
			} else {
				return false;
			}
		},

		dump: function() {
			console.log('');
			console.log('');
			this._rows.forEach(function(row) {
				var rs = '';
				row.forEach(function(tile) {
					var color = tile.getColor();
					if (!color) {
						rs += '.';
					} else {
						if (tile.inhabitants.length) {
							rs += 'a';
						} else {
							rs += 't'
						}
					}
				});
				console.log(rs);
			});
		},

		actorsOnTeam: function(team) {
			return this.actors.filter(function(actor) {
				return actor.team === team;
			});
		},
		tilesTagged: function(tag) {
			return this.tiles.filter(function(tile) {
				return tile.tag === tag;
			});
		},
		getAnimationTargets: function(filter) {
			// TODO: support more intelligent filters like:
			// 'tiles=disco'
			// 'actors=apple'
			// 'tiles=disco&&water'
			// 'tiles = disco || water'
			// etc
			if (filter === 'tiles') {
				return this.tiles;
			}
			if (filter === 'actors') {
				return this.actors;
			}
			if (filter === 'board') {
				return [this];
			}
			if (_.isArray(filter)) {
				return filter;
			}
			return this.tiles;
		},

		destroy: function() {},

		_clamp: function(value, min, max) {
			if (value < min) {
				return min;
			}
			if (value >= max) {
				return max;
			}
			return value;
		},
		_tileToPixels: function(quantity) {
			return (this.tileSize + this.borderWidth) * quantity;
		},
		scrollCenterOn: function(position) {
			var x = this._tileToPixels(position.x) + this.tileSize / 2;
			var y = this._tileToPixels(position.y) + this.tileSize / 2;
			this.viewport.centerOn(x, y);
		},
		scrollY: function(amount) {
			if (this.viewport) {
				this.viewport.scrollY(this._tileToPixels(amount));
			}
		},
		scrollX: function(amount) {
			if (this.viewport) {
				this.viewport.scrollX(this._tileToPixels(amount));
			}
		},
		scrollXY: function(xamount, yamount) {
			this.scrollX(xamount);
			this.scrollY(yamount);
		},
		column: function(index) {
			if (index < 0) {
				index = this.width + index;
			}
			var tiles = [];

			for (var y = 0; y < this.height; ++y) {
				tiles.push(this.tileAt(L7.p(index, y)));
			}
			return tiles;
		},

		row: function(varArgIndices) {
			var tiles = [];

			_.each(arguments, function(index) {
				if (index < 0) {
					index = this.height + index;
				}

				for (var x = 0; x < this.width; ++x) {
					tiles.push(this.tileAt(L7.p(x, index)));
				}
			},
			this);

			return tiles;
		},

		rect: function(x, y, w, h) {
			var tiles = [];

			for (var yy = y; yy < y + h; ++yy) {
				for (var xx = x; xx < x + w; ++xx) {
					tiles.push(this.tileAt(xx, yy));
				}
			}

			return tiles;
		},

		query: function(predicate) {
			var tiles = [];

			this.tiles.forEach(function(tile) {
				if (predicate(tile)) {
					tiles.push(tile);
				}
			});

			return tiles;
		},

		tileAt: function(positionOrX, yOrUndefined) {
			var x = _.isObject(positionOrX) ? positionOrX.x: positionOrX;
			var y = _.isNumber(yOrUndefined) ? yOrUndefined: positionOrX.y;

			if (y < 0 || y >= this.height || x < 0 || x >= this.width) {
				return null;
			}

			var offset = y * this.width + x;
			return this.tiles[offset];
		},

		tileAtPixels: function(positionOrX, yOrUndefined) {
			var x = _.isObject(positionOrX) ? positionOrX.x: positionOrX;
			var y = _.isNumber(yOrUndefined) ? yOrUndefined: positionOrX.y;

			var ox = this.offsetX || 0;
			var oy = this.offsetY || 0;

			var tileX = Math.floor((x + ox) / (this.tileSize + this.borderWidth));
			var tileY = Math.floor((y + oy) / (this.tileSize + this.borderWidth));

			return this.tileAt(tileX, tileY);
		},
		pixelsForTile: function(tile) {
			return L7.p(this._tileToPixels(tile.x), this._tileToPixels(tile.y));
		},

		tileTopInPixels: function(tile) {
			return this._tileToPixels(tile.y);
		},

		tileBottomInPixels: function(tile) {
			return this.tileTopInPixels(tile) + this.tileSize;
		},

		each: function(operation, scope) {
			this.tiles.forEach(operation, scope);
		},

		// Actor related function
		_addPieces: function(pieces) {
			pieces.forEach(function(piece) {
				var tile = this.tileAt(piece.position);
				if (tile) {
					tile.add(piece);
				}
			},
			this);
		},
		removePieces: function(pieces) {
			pieces.forEach(function(piece) {
				var tile = this.tileAt(piece.position);
				if (tile) {
					tile.remove(piece);
				}
			},
			this);
		},
		promote: function(actor) {
			if (actor.pieces) {
				this.removePieces(actor.pieces);
				this._addPieces(actor.pieces);
			}
		},
		addActors: function(varargs) {
			var args = _.toArray(arguments);
			args.forEach(function(arg) {
				this.addActor(arg);
			},
			this);
		},
		addActor: function(actor) {
			if (actor.pieces) {
				this._addPieces(actor.pieces);
			}

			this.actors.push(actor);
			actor.board = this;
		},
		hasActor: function(actor) {
			return this.actors.indexOf(actor) > -1;
		},
		addFreeActor: function(freeActor) {
			this.freeActors.push(freeActor);
			freeActor.board = this;
		},
		removeFreeActor: function(freeActor) {
			this.freeActors.remove(freeActor);
			delete freeActor.board;
		},
		removeActor: function(actor) {
			if (actor.pieces) {
				this.removePieces(actor.pieces);
			}
			this.actors.remove(actor);
		},

		addDaemon: function(daemon) {
			this.daemons.push(daemon);
		},
		removeDaemon: function(daemon) {
			if (this.daemons.indexOf(daemon) > - 1 && daemon.onRemove) {
				daemon.onRemove(this);
			}
			this.daemons.remove(daemon);
		},

		isOutOfBounds: function(actor) {
			for (var i = 0, l = actor.pieces.length; i < l; ++i) {
				var p = actor.pieces[i].position;

				if (p.x < 0 || p.y < 0 || p.x >= this.width || p.y >= this.height) {
					return true;
				}
			}

			return false;
		},
		_movePiece: function(piece, delta) {
			var from = piece.position;
			var to = piece.position.add(delta);

			var fromTile = this.tileAt(from);
			if (fromTile) {
				fromTile.remove(piece);
			}

			var toTile = this.tileAt(to);
			if (toTile) {
				toTile.add(piece);
			}
		},

		movePiece: function(options) {
			this._movePiece(options.piece, options.delta || options.to.delta(options.from));
		},

		moveActor: function(options) {
			var delta = options.delta || options.to.delta(options.from);

			options.actor.pieces.forEach(function(piece) {
				this._movePiece(piece, delta);
			},
			this);

			options.actor._lastPosition = options.actor.position;
			options.actor.position = options.actor.position.add(delta);

			if (options.actor.onOutOfBounds && this.isOutOfBounds(options.actor)) {
				options.actor.onOutOfBounds.call(options.actor);
			}
		},

		freezeFor: function(freezeMillis, callback) {
			this.freezeDuration = freezeMillis;
			this.freezeCallback = callback;
		},

		_handleFreeze: function(delta) {
			if(this.freezeDuration > 0) {
				this.freezeDuration -= delta;

				if(this.freezeDuration <= 0) {
					this.freezeDuration = 0;
					if(this.freezeCallback) {
						this.freezeCallback();
					}
					return true;
				} else {
					return false;
				}
			}
			return true;
		},

		update: function(delta, timestamp) {
			if(this.freezeDuration && !this._handleFreeze(delta)) {
				return;
			}

			this.actors.forEach(function(actor) {
				actor.update(delta, timestamp);
			});

			this.freeActors.forEach(function(actor) {
				actor.update(delta, timestamp);
			});

			this.daemons.forEach(function(daemon) {
				daemon.update(delta, timestamp, this);
			},
			this);

			if (!this.disableHitDetection) {
				this._hitManager.detectHits(this.tiles);
			}
		}
	};

	Object.defineProperty(L7.Board.prototype, 'pixelHeight', {
		get: function() {
			return this.height * (this.tileSize + this.borderWidth) + this.borderWidth;
		},
		enumerable: true
	});

	Object.defineProperty(L7.Board.prototype, 'pixelWidth', {
		get: function() {
			return this.width * (this.tileSize + this.borderWidth) + this.borderWidth;
		},
		enumerable: true
	});
})();

L7.CanvasBoardRenderMixin = {
	render: function(delta, context, anchorXpx, anchorYpx, timestamp) {
		if (this.angle) {
			context.save();
			context.rotate(this.angle);
		}

		anchorXpx += this.offsetX || 0;
		anchorYpx += this.offsetY || 0;

		var c = context,
		bw = this.borderWidth,
		ts = this.tileSize,
		seedy = (anchorYpx / (ts + bw)) | 0,
		offsetY = - anchorYpx % (ts + bw),
		y,
		yl = Math.min(this._rows.length, Math.ceil((anchorYpx + c.canvas.height) / (ts + bw))),
		seedx = (anchorXpx / (ts + bw)) | 0,
		offsetX = - anchorXpx % (ts + bw),
		x,
		xl = Math.min(this._rows[0].length, Math.ceil((anchorXpx + c.canvas.width) / (ts + bw))),
		tile,
		color,
		lastColor,
		row;

		var deferRender = [];

		for (y = seedy; y < yl; ++y) {
			if (y >= 0) {
				row = this._rows[y];
				for (x = seedx; x < xl; ++x) {
					if (x >= 0) {

						tile = row[x];
						color = tile.getColor();

						if (color) {
							var scale = tile.getScale();
							if (!_.isNumber(scale)) {
								scale = 1;
							}

							var offset = tile.getOffset();

							if (scale !== 1 || (offset && (offset.x || offset.y))) {
								deferRender.push(tile);
								color = tile.getColor(true);
								scale = 1;
							}
							if (color) {
								if (this.borderFill) {
									c.fillStyle = this.borderFill;
									// top
									c.fillRect((x - seedx) * (ts + bw) + offsetX, (y - seedy) * (ts + bw) + offsetY, ts + (2 * bw), bw);
									// bottom
									c.fillRect((x - seedx) * (ts + bw) + offsetX, (y - seedy) * (ts + bw) + offsetY + ts + bw, ts + (2 * bw), bw);
									// left
									c.fillRect((x - seedx) * (ts + bw) + offsetX, (y - seedy) * (ts + bw) + offsetY, bw, ts + (2 * bw));
									// right
									c.fillRect((x - seedx) * (ts + bw) + offsetX + ts + bw, (y - seedy) * (ts + bw) + offsetY, bw, ts + (2 * bw));
								}
								c.fillStyle = L7.Color.toCssString(color);
								var size = Math.round(ts * scale);
								var offset = ts / 2 - size / 2;
								c.fillRect((x - seedx) * (ts + bw) + bw + offset + offsetX, (y - seedy) * (ts + bw) + bw + offset + offsetY, size, size);
							}
						}
					}
				}
			}
		}

		deferRender.sort(function(a, b) {
			return a.scale - b.scale;
		});

		for (var i = 0; i < deferRender.length; ++i) {
			var tile = deferRender[i];
			var scale = tile.getScale();

			if (!_.isNumber(scale)) {
				scale = 1;
			}

			var color = tile.getColor();

			if (color) {
				c.fillStyle = L7.Color.toCssString(color);
				var size = (ts * scale) | 0;
				var tileOffset = tile.getOffset();

				var tileOffx = 0,
				tileOffy = 0;
				if (tileOffset) {
					tileOffx = (ts * tileOffset.x) | 0;
					tileOffy = (ts * tileOffset.y) | 0;
				}

				var offset = ts / 2 - size / 2;
				c.fillRect((tile.x - seedx) * (ts + bw) + bw + offset + offsetX + tileOffx, (tile.y - seedy) * (ts + bw) + bw + offset + offsetY + tileOffy, size, size);
			}
		}

		// TODO: probably getting rid of free actors
		for (var i = 0; i < this.freeActors.length; ++i) {
			var freeActor = this.freeActors[i];
			var color = L7.Color.toCssString(freeActor.color);

			if (color) {
				c.fillStyle = color;
				c.fillRect(freeActor.position.x - anchorXpx, freeActor.position.y - anchorYpx, ts, ts);
			}
		}

		if (this.angle) {
			context.restore();
		}
	}
};

(function() {
	L7.HitManager = function() {};

	L7.HitManager.prototype = {
		detectHitsForActor: function(actor) {
			var l = actor.pieces.length;
			while(l--) {
				var piece = actor.pieces[l];
				var tile = actor.board.tileAt(piece.position);
				if(tile) {
					this._detectTileHits(tile);
				}
			}
		},

		detectHits: function(tiles) {
			tiles.forEach(function(tile) {
				this._detectTileHits(tile);
			},
			this);
		},

		_detectTileHits: function(tile) {

			tile.each(function(inhabitant) {
				if (_.isObject(inhabitant.owner) && _.isObject(inhabitant.owner.hitDetection)) {
					if (typeof inhabitant.owner.hitDetection.enabled === 'undefined' || inhabitant.owner.hitDetection.enabled.call(inhabitant.owner)) {

						_.each(inhabitant.owner.hitDetection, function(hitHandler, hitType) {
							if(tile.tag === hitType) {
								hitHandler.call(inhabitant.owner, tile, tile);
							}

							tile.each(function(otherInhabitant) {
								if (otherInhabitant !== inhabitant && otherInhabitant.owner && otherInhabitant.owner.team === hitType) {
									hitHandler.call(inhabitant.owner, tile, otherInhabitant.owner);
								}
							},
							this);
						},
						this);

					}
				}
			},
			this);
		}
	};

})();


(function() {
	L7.ParallaxBoard = function(config) {
		_.extend(this, config);
		this.boards = this.boards || [];

		this.boards.forEach(function(board, i) {
			board.parallaxRatio = board.parallaxRatio || 0;
			if (!_.isNumber(board.depth)) {
				board.depth = i;
			}
		},
		this);
	};

	L7.ParallaxBoard.prototype = {
		update: function() {
			var args = _.toArray(arguments);
			this.boards.forEach(function(board) {
				board.update.apply(board, args);
			});
		},
		render: function(delta, context, anchorX, anchorY, timestamp) {
			this.boards.forEach(function(board) {
				if(board.visible !== false) {
					board.render(delta, context, anchorX * board.parallaxRatio, anchorY * board.parallaxRatio, timestamp);
				}
			});
		},

		clicked: function(position) {
			var l = this.boards.length;
			while(l--) {
				if(this.boards[l].clicked(position)) {
					return;
				}
			}
		}
	};

	Object.defineProperty(L7.ParallaxBoard.prototype, 'viewport', {
		get: function() {
			return this.viewport;
		},
		set: function(viewport) {
			this.boards.forEach(function(board) {
				board.viewport = viewport;
			});
		},
		enumerable: true
	});

	Object.defineProperty(L7.ParallaxBoard.prototype, 'game', {
		get: function() {
			return this.game;
		},
		set: function(game) {
			this.boards.forEach(function(board) {
				board.game = game;
			});
		},
		enumerable: true
	});

})();

(function() {
	L7.Piece = function(config) {
		_.extend(this, config || {});
	};

	Object.defineProperty(L7.Piece.prototype, "position", {
		get: function() {
			if(this.owner) {
				return this.owner.position.add(this.anchorDelta);
			}
		},
		enumerable: true
	});

})();

(function() {
	L7.SingleInhabitantTile = function(config) {
		config = config || {};

		if (!_.isNumber(config.x)) {
			throw new Error("Tile: x is required");
		}

		if (!_.isNumber(config.y)) {
			throw new Error("Tile: y is required");
		}

		this.x = config.x;
		this.y = config.y;
		this.color = config.color;
		this.scale = config.scale;

		if(!_.isNumber(this.scale)) {
			this.scale = 1;
		}

		this.board = config.board;

		this.inhabitant = _.isArray(config.inhabitants) ? config.inhabitants[0] : null;

		this.position = L7.p(this.x, this.y);
		this.colors = [];
		this.composite = [];
	}

	L7.SingleInhabitantTile.prototype = {
		at: function(index) {
			return this.inhabitant;
		},
		each: function(operation, scope) {
			this.inhabitant && operation.call(scope, this.inhabitant);
		},
		add: function(inhabitant) {
			this.inhabitant = inhabitant;
		},
		remove: function(inhabitant) {
			if(this.inhabitant === inhabitant) {
				this.inhabitant = null;
			}
		},
		has: function(team) {
			if(this.tag === team) {
				return true;
			}
			return this.inhabitant && this.inhabitant.team === team;
		},
		hasOther: function(team, actor) {
			throw new Error("not implemented");
			if(this.tag === team) {
				return true;
			}
			return this.inhabitants.some(function(inhabitant) {
				return inhabitant.team === team || (inhabitant.owner && inhabitant.owner.team === team) && inhabitant.owner !== actor;
			});
		},

		getColor: function(skipInhabitants) {
			var c = 0;

			if(this.color) {
				this.colors[c++] = this.color;
			}

			if(skipInhabitants !== false && this.inhabitant && this.inhabitant.color) {
				this.colors[c++] = this.inhabitant.color;
			}

			if(this.overlayColor) {
				this.colors[c++] = this.overlayColor;
			}

			if(this.colors[c-1] && this.colors[c-1][3] === 1) {
				return this.colors[c-1];
			}

			if(c > 0) {
				L7.Color.composite(this.colors, c, this.composite);
				if(this.opaque) {
					this.composite[3] = 1;
				}
				return this.composite;
			}
		},

		getScale: function() {
			return (this.inhabitant && this.inhabitant.color && this.inhabitant.scale) || this.scale;
		},

		getOffset: function() {
			return this.inhabitant && this.inhabitant.offset;
		},

		up: function() {
			return this.board && this.board.tileAt(this.position.up());
		},
		down: function() {
			return this.board && this.board.tileAt(this.position.down());
		},
		left: function() {
			return this.board && this.board.tileAt(this.position.left());
		},
		right: function() {
			return this.board && this.board.tileAt(this.position.right());
		}
	};

	Object.defineProperty(L7.SingleInhabitantTile.prototype, 'count', {
		get: function() {
			if(this.inhabitant) {
				return 1;
			} else {
				return 0;
			}
		},
		enumerable: true
	});
})();

(function() {
	L7.StoryBoard = function(boardConfigs) {
		this.boardConfigs = boardConfigs;

		this._setCurrentBoard(0);

	};

	L7.StoryBoard.prototype = {
		_setCurrentBoard: function(index) {
			this._currentBoardIndex = index;
			var boardConfig = this.boardConfigs[index];

			if (boardConfig) {
				this._currentBoardConfig = boardConfig;
				var currentBoard = this._currentBoardConfig.board;

				this.width = currentBoard.width;
				this.height = currentBoard.height;
				this.tileSize = currentBoard.tileSize;
				this.borderWidth = currentBoard.borderWidth;

				this._currentDuration = boardConfig.duration;
				currentBoard.viewport = this.viewport;
				currentBoard.game = this.game;
			}
		},

		_setNextBoard: function() {
			if(this._currentBoardConfig.board && this._currentBoardConfig.board.destroy) {
				this._currentBoardConfig.board.destroy();
			}
			this._setCurrentBoard(this._currentBoardIndex + 1);
		},

		update: function(delta, timestamp) {
			if (this._currentBoardConfig) {
				this._currentBoardConfig.board.update(delta, timestamp);

				this._currentDuration -= delta;
				if(this._currentDuration <= 0) {
					this._setNextBoard();
				}
			}
		},

		render: function() {
			if (this._currentBoardConfig) {
				this._currentBoardConfig.board.render.apply(this._currentBoardConfig.board, arguments);
			}
		},

		clicked: function() {
			if (this._currentBoardConfig) {
				this._currentBoardConfig.board.clicked.apply(this._currentBoardConfig.board, arguments);
			}
		}
	};

	Object.defineProperty(L7.StoryBoard.prototype, 'pixelHeight', {
		get: function() {
			return this.height * (this.tileSize + this.borderWidth) + this.borderWidth;
		},
		enumerable: true
	});

	Object.defineProperty(L7.StoryBoard.prototype, 'pixelWidth', {
		get: function() {
			return this.width * (this.tileSize + this.borderWidth) + this.borderWidth;
		},
		enumerable: true
	});

	Object.defineProperty(L7.StoryBoard.prototype, 'viewport', {
		get: function() {
			return this._viewport;
		},
		set: function(v) {
			this._viewport = v;
			if (this._currentBoardConfig) {
				this._currentBoardConfig.board.viewport = v;
			}
		}
	});

	Object.defineProperty(L7.StoryBoard.prototype, 'game', {
		get: function() {
			return this._game;
		},
		set: function(g) {
			this._game = g;
			if (this._currentBoardConfig) {
				this._currentBoardConfig.board.game = g;
			}
		}
	});

})();

(function() {
	L7.Tile = function(config) {
		config = config || {};

		if (!_.isNumber(config.x)) {
			throw new Error("Tile: x is required");
		}

		if (!_.isNumber(config.y)) {
			throw new Error("Tile: y is required");
		}

		this.x = config.x;
		this.y = config.y;
		this.color = config.color;
		this.scale = config.scale;

		if(!_.isNumber(this.scale)) {
			this.scale = 1;
		}

		this.board = config.board;

		this.inhabitants = _.clone(config.inhabitants || []);
		this.position = L7.p(this.x, this.y);
		this.colors = [];
		this.composite = [];
	}

	L7.Tile.prototype = {
		at: function(index) {
			return this.inhabitants[index];
		},
		each: function(operation, scope) {
			this.inhabitants.forEach(operation, scope);
		},
		add: function(inhabitant) {
			this.inhabitants.push(inhabitant);
		},
		remove: function(inhabitant) {
			this.inhabitants.remove(inhabitant);
		},
		has: function(team) {
			if(this.tag === team) {
				return true;
			}
			return this.inhabitants.some(function(inhabitant) {
				return inhabitant.team === team || (inhabitant.owner && inhabitant.owner.team === team);
			});
		},
		hasOther: function(team, actor) {
			if(this.tag === team) {
				return true;
			}
			return this.inhabitants.some(function(inhabitant) {
				return inhabitant.team === team || (inhabitant.owner && inhabitant.owner.team === team) && inhabitant.owner !== actor;
			});
		},

		getColor: function(skipInhabitants) {
			var c = 0;

			if(this.color) {
				this.colors[c++] = this.color;
			}

			if(skipInhabitants !== false) {
				for(var i = 0, l = this.inhabitants.length; i < l; ++i) {
					var inhabColor = this.inhabitants[i].color;
					if(inhabColor) {
						this.colors[c++] = inhabColor;
					}
				}
			}

			if(this.overlayColor) {
				this.colors[c++] = this.overlayColor;
			}

			if(this.colors[c-1] && this.colors[c-1][3] === 1) {
				return this.colors[c-1];
			}

			if(c > 0) {
				L7.Color.composite(this.colors, c, this.composite);
				if(this.opaque) {
					this.composite[3] = 1;
				}
				return this.composite;
			}
		},

		getScale: function() {
			if (this.inhabitants.length === 0 || !this.inhabitants.last.color) {
				return this.scale;
			} else {
				return this.inhabitants.last.scale;
			}
		},

		getOffset: function() {
			return this.inhabitants.length !== 0 && this.inhabitants.last.offset;
		},

		up: function() {
			return this.board && this.board.tileAt(this.position.up());
		},
		down: function() {
			return this.board && this.board.tileAt(this.position.down());
		},
		left: function() {
			return this.board && this.board.tileAt(this.position.left());
		},
		right: function() {
			return this.board && this.board.tileAt(this.position.right());
		}
	};

	Object.defineProperty(L7.Tile.prototype, 'count', {
		get: function() {
			return this.inhabitants.length;
		},
		enumerable: true
	});
})();

(function() {
	var _blankColor = [0, 0, 0, 0];
	var _defaultOffsets = {
		x: 0,
		y: 0
	};

	L7.WebGLBoardRenderMixin = {
		render: function(delta, gl, anchorXpx, anchorYpx, timestamp) {
			if (!this.squareVertexPositionBuffer) {
				this._glInit(gl);
			}

			// just shifting the view within the offset of one tile
			var shiftX = anchorXpx % (this.tileSize + this.borderWidth);
			var shiftY = anchorYpx % (this.tileSize + this.borderWidth);

			var translateX = shiftX + (this.offsetX || 0);
			var translateY = shiftY + (this.offsetY || 0);

			mat4.identity(this.mvMatrix);
			mat4.translate(this.mvMatrix, [-translateX, - translateY, 0]);
			gl.uniformMatrix4fv(gl.mvMatrixUniform, false, this.mvMatrix);

			gl.bindBuffer(gl.ARRAY_BUFFER, this.squareVertexPositionBuffer);
			gl.vertexAttribPointer(gl.vertexPositionAttribute, this.squareVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

			gl.bindBuffer(gl.ARRAY_BUFFER, this.centerVertexPositionBuffer);
			gl.vertexAttribPointer(gl.centerPositionAttribute, this.centerVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

			this._glSetTiles(gl, anchorXpx, anchorYpx);
			gl.drawArrays(gl.TRIANGLES, 0, this.squareVertexPositionBuffer.numItems);
		},

		_glInit: function(gl) {
			this.mvMatrix = mat4.create();
			this._glInitBuffer(gl);
		},

		_glInitBuffer: function(gl) {
			this.squareVertexPositionBuffer = gl.createBuffer();
			this.squareVertexPositionBuffer.itemSize = 3;

			this.centerVertexPositionBuffer = gl.createBuffer();
			this.centerVertexPositionBuffer.itemSize = 2;

			gl.bindBuffer(gl.ARRAY_BUFFER, this.squareVertexPositionBuffer);

			this.verticesPerTile = this.borderWidth > 0 ? 30: 6;
			var i = 0;
			var ci = 0;
			var z = this.depth || 0;

			function pushTileVertices(x, y, size) {
				vertices[i++] = x;
				vertices[i++] = y;
				vertices[i++] = z;

				vertices[i++] = x + size;
				vertices[i++] = y;
				vertices[i++] = z;

				vertices[i++] = x + size;
				vertices[i++] = y + size;
				vertices[i++] = z;

				vertices[i++] = x;
				vertices[i++] = y;
				vertices[i++] = z;

				vertices[i++] = x + size;
				vertices[i++] = y + size;
				vertices[i++] = z;

				vertices[i++] = x;
				vertices[i++] = y + size;
				vertices[i++] = z;
			}

			function pushBorderVertices(x, y, ts, bw) {
				var fullSide = ts + 2 * bw;
				// top border
				vertices[i++] = x;
				vertices[i++] = y;
				vertices[i++] = z;
				vertices[i++] = x + fullSide;
				vertices[i++] = y;
				vertices[i++] = z;
				vertices[i++] = x + fullSide;
				vertices[i++] = y + bw;
				vertices[i++] = z;

				vertices[i++] = x;
				vertices[i++] = y;
				vertices[i++] = z;
				vertices[i++] = x + fullSide;
				vertices[i++] = y + bw;
				vertices[i++] = z;
				vertices[i++] = x;
				vertices[i++] = y + bw;
				vertices[i++] = z;

				// right border
				var rx = x + bw + ts;
				var ry = y;
				vertices[i++] = rx;
				vertices[i++] = ry;
				vertices[i++] = z;
				vertices[i++] = rx + bw;
				vertices[i++] = ry;
				vertices[i++] = z;
				vertices[i++] = rx + bw;
				vertices[i++] = ry + fullSide;
				vertices[i++] = z;

				vertices[i++] = rx;
				vertices[i++] = ry;
				vertices[i++] = z;
				vertices[i++] = rx + bw;
				vertices[i++] = ry + fullSide;
				vertices[i++] = z;
				vertices[i++] = rx;
				vertices[i++] = ry + fullSide;
				vertices[i++] = z;

				// bottom border
				var bx = x;
				var by = y + bw + ts;
				vertices[i++] = bx;
				vertices[i++] = by;
				vertices[i++] = z;
				vertices[i++] = bx + fullSide;
				vertices[i++] = by;
				vertices[i++] = z;
				vertices[i++] = bx + fullSide;
				vertices[i++] = by + bw;
				vertices[i++] = z;

				vertices[i++] = bx;
				vertices[i++] = by;
				vertices[i++] = z;
				vertices[i++] = bx + fullSide;
				vertices[i++] = by + bw;
				vertices[i++] = z;
				vertices[i++] = bx;
				vertices[i++] = by + bw;
				vertices[i++] = z;

				// left border
				var lx = x;
				var ly = y;
				vertices[i++] = lx;
				vertices[i++] = ly;
				vertices[i++] = z;
				vertices[i++] = lx + bw;
				vertices[i++] = ly;
				vertices[i++] = z;
				vertices[i++] = lx + bw;
				vertices[i++] = ly + fullSide;
				vertices[i++] = z;

				vertices[i++] = lx;
				vertices[i++] = ly;
				vertices[i++] = z;
				vertices[i++] = lx + bw;
				vertices[i++] = ly + fullSide;
				vertices[i++] = z;
				vertices[i++] = lx;
				vertices[i++] = ly + fullSide;
				vertices[i++] = z;
			}

			var ts = this.tileSize;
			var bw = this.borderWidth;
			this.vboWidth = Math.ceil(Math.min(this.width, this.viewport.width / (ts + bw) + 1));
			this.vboHeight = Math.ceil(Math.min(this.height, this.viewport.height / (ts + bw) + 1));
			
			var vertices = new Float32Array(this.vboWidth * this.vboHeight * this.squareVertexPositionBuffer.itemSize * this.verticesPerTile);
			var centerVertices = new Float32Array(this.vboWidth * this.vboHeight * this.centerVertexPositionBuffer.itemSize * this.verticesPerTile);

			for (var y = 0; y < this.vboHeight; ++y) {
				for (var x = 0; x < this.vboWidth; ++x) {
					var tx = x * (ts + bw) + bw;
					var ty = y * (ts + bw) + bw;

					if (this.borderWidth > 0) {
						pushBorderVertices(tx - bw, ty - bw, ts, bw);
					}

					pushTileVertices(tx, ty, ts);

					for (var c = 0; c < this.verticesPerTile; ++c) {
						centerVertices[ci++] = tx + ts / 2;
						centerVertices[ci++] = ty + ts / 2;
					}
				}
			}

			gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
			this.squareVertexPositionBuffer.numItems = vertices.length / this.squareVertexPositionBuffer.itemSize;

			gl.bindBuffer(gl.ARRAY_BUFFER, this.centerVertexPositionBuffer);
			gl.bufferData(gl.ARRAY_BUFFER, centerVertices, gl.STATIC_DRAW);

			this.colorOffsetsBuffer = gl.createBuffer();
			this.colorOffsetsBuffer.itemSize = 6;
			this.colorOffsetsData = new Float32Array(this.vboWidth * this.vboHeight * this.verticesPerTile * this.colorOffsetsBuffer.itemSize);
			gl.bindBuffer(gl.ARRAY_BUFFER, this.colorOffsetsBuffer);
			gl.bufferData(gl.ARRAY_BUFFER, this.colorOffsetsData, gl.DYNAMIC_DRAW);
		},

		_getTileShaderOffsetX: function(index, offx, scale) {
			if (index === 0 || index === 3 || index === 5) {
				return -2 * (offx - scale) + 1;
			}

			return 2 * (offx + scale) + 1;
		},

		_getTileShaderOffsetY: function(index, offy, scale) {
			if (index === 0 || index === 3 || index === 1) {
				return -2 * (offy - scale) + 1;
			}

			return 2 * (offy + scale) + 1;
		},

		_getBorderShaderOffsetX: function(index, offx, scale) {
			// inner right
			if (index === 6 || index === 9 || index === 11) {
				return 2 * (offx + scale) + 1;
			}

			// inner left
			if (index === 18 || index == 21 || index === 23) {
				return - 2 * (offx - scale) + 1;
			}

			return 1;
		},

		_getBorderShaderOffsetY: function(index, offy, scale) {
			// inner top
			if (index === 5 || index === 2 || index === 4) {
				return - 2 * (offy - scale) + 1;
			}

			// inner bottom
			if (index === 12 || index === 15 || index === 13) {
				return 2 * (offy + scale) + 1;
			}

			return 1;
		},

		_glSetTiles: function(gl, anchorXpx, anchorYpx) {
			var bw = this.borderWidth,
			ts = this.tileSize,
			seedy = (anchorYpx / (ts + bw)) | 0,
			y,
			yl,
			seedx = (anchorXpx / (ts + bw)) | 0,
			x,
			xl,
			tile,
			color,
			scale,
			alteredScale,
			offx,
			offy,
			row,
			cdi = 0;

			this.standardBorderColor = this.standardBorderColor || (this.borderFill ? L7.Color.toArray(this.borderFill) : _blankColor);

			this.colorOffsetsData = this.colorOffsetsData || new Float32Array(this.vboWidth * this.vboHeight * this.verticesPerTile * this.colorOffsetsBuffer.itemSize);

			gl.bindBuffer(gl.ARRAY_BUFFER, this.colorOffsetsBuffer);

			for (y = seedy, yl = seedy + this.vboHeight; y < yl; ++y) {
				if (y >= 0 && y < this.height) {
					row = this._rows[y];
					for (x = seedx, xl = seedx + this.vboWidth; x < xl; ++x) {
						if (x >= 0 && x < this.width) {
							tile = row[x];
							color = tile.getColor() || _blankColor;
							var offsets = tile.getOffset() || _defaultOffsets;
							offx = offsets.x;
							offy = offsets.y;
							scale = tile.getScale();
							alteredScale = (scale - 1) / 2;

							if (this.borderWidth > 0) {
								// border colors, there are 24 border vertices preceding a tile
								var borderColor;
								if (offx || offy || scale != 1) {
									borderColor = tile.color || _blankColor;
								} else {
									borderColor = color[3] ? this.standardBorderColor: _blankColor;
								}

								for (var b = 0; b < 24; ++b) {
									this.colorOffsetsData[cdi++] = borderColor[0] / 255;
									this.colorOffsetsData[cdi++] = borderColor[1] / 255;
									this.colorOffsetsData[cdi++] = borderColor[2] / 255;
									this.colorOffsetsData[cdi++] = borderColor[3];
									// offsets
									this.colorOffsetsData[cdi++] = this._getBorderShaderOffsetX(b, offx, alteredScale);
									this.colorOffsetsData[cdi++] = this._getBorderShaderOffsetY(b, offy, alteredScale);
								}
							}

							// each tile is made up of six vertices
							for (var t = 0; t < 6; ++t) {
								this.colorOffsetsData[cdi++] = color[0] / 255;
								this.colorOffsetsData[cdi++] = color[1] / 255;
								this.colorOffsetsData[cdi++] = color[2] / 255;
								this.colorOffsetsData[cdi++] = color[3];
								// offsets
								this.colorOffsetsData[cdi++] = this._getTileShaderOffsetX(t, offx, alteredScale);
								this.colorOffsetsData[cdi++] = this._getTileShaderOffsetY(t, offy, alteredScale);
							}
						} else {
							for (var filler = 0; filler < this.verticesPerTile * 6; ++filler) {
								this.colorOffsetsData[cdi++] = 0;
							}
						}
					}
				} else {
					for (var filler = 0; filler < this.verticesPerTile * 6 * this.vboWidth; ++filler) {
						this.colorOffsetsData[cdi++] = 0;
					}
				}

			}
			// bufferSubData here
			gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.colorOffsetsData);
			gl.vertexAttribPointer(gl.vertexColorAttribute, 4, gl.FLOAT, false, this.colorOffsetsBuffer.itemSize * 4, 0);
			gl.vertexAttribPointer(gl.offsetsAttribute, 2, gl.FLOAT, false, this.colorOffsetsBuffer.itemSize * 4, 4 * 4);
		}
	};
})();

(function() {
	function _composite(under, over) {
		var alphaO = over[3],
			alphaU = under[3],
			invAlphaO = 1 - alphaO,
			i,
			len;

		for(i = 0, len = under.length - 1; i < len; ++i) {
			under[i] = Math.round((over[i] * alphaO) 
				+ ((under[i] * alphaU) * invAlphaO));
		}

		under[3] = (under[3] + over[3]) / 2;
	}

	function _hexToArray(hex) {
		hex = hex.substring(1); // chop off #
		var oxr = hex.substring(0, 2);
		var oxg = hex.substring(2, 4);
		var oxb = hex.substring(4, 6);

		result = [parseInt(oxr, 16), parseInt(oxg, 16), parseInt(oxb, 16), 1];

		return result;
	}

	function _rgbToArray(rgbString) {
		// rgb(255, 122, 33)
		// rgba(244, 122, 55, .1)
		var leftParen = rgbString.indexOf('(');
		var numberString = rgbString.substring(leftParen + 1);

		var values = [];
		var split = numberString.split(',');

		for(var i = 0, l = split.length; i < l; ++i) {
			values.push(parseFloat(split[i]));
		}

		if(values.length === 3) {
			values.push(1);
		}

		return values;
	}

	L7.Color = {

		toCssString: function(colorArray) {
			if(colorArray.length === 3) {
				return 'rgb(' + Math.round(colorArray[0]) + ',' + Math.round(colorArray[1]) + ',' + Math.round(colorArray[2]) + ')';
			} else {
				return 'rgba(' + Math.round(colorArray[0]) + ',' + Math.round(colorArray[1]) + ',' + Math.round(colorArray[2]) + ',' +  colorArray[3] + ')';
			}
		},

		isBuiltInString: function(colorString) {
			if (typeof colorString !== 'string') {
				return false;
			}

			return _builtInColors.hasOwnProperty(colorString.toLowerCase());
		},

		isHexString: function(colorString) {
			if (typeof colorString !== 'string') {
				return false;
			}

			if (colorString[0] !== '#' || colorString.length !== 7) {
				return false;
			}

			colorString = colorString.toUpperCase();

			for (var i = 1, l = colorString.length; i < l; ++i) {
				var c = colorString[i];
				if (c < '0' || c > 'F') {
					return false
				}
			}

			return true;
		},

		isOpaque: function(color) {
			if(this.isHexString(color) || this.isBuiltInString(color)) {
				return true;
			}

			var asArray = this.toArray(color);

			return asArray && asArray[3] === 1;
		},

		isRgbString: function(colorString) {
			// very primitive, just sees if strings are generally of the form "rgb(...)" or rgba(...)"
			// does NOT fully detect if the string is an rgb string (yet...)
			if (typeof colorString !== 'string') {
				return false;
			}

			if (colorString.length < 10) {
				return false;
			}

			if (colorString.indexOf('rgb') !== 0) {
				return false;
			}

			if (colorString[colorString.length - 1] !== ')') {
				return false;
			}

			if (colorString[3] !== '(' && colorString[4] !== '(') {
				return false;
			}

			return true;
		},

		toArray: function(colorString) {
			if(_.isArray(colorString) && colorString.length === 4) {
				return colorString;
			}

			if (this.isHexString(colorString)) {
				return _hexToArray(colorString);
			}
			if(this.isBuiltInString(colorString)) {
				return _hexToArray(_builtInColors[colorString]);
			}
			if(this.isRgbString(colorString)) {
				return _rgbToArray(colorString);
			}
		},

		fromArrayToHex: function(colorArray, options) {
			var hexString = '#';

			var count = (options && options.includeAlpha && colorArray.length === 4) ? 4 : 3;

			for(var i = 0; i < count; ++i) {
				var hex = colorArray[i].toString(16);
				if(hex.length < 2) {
					hex = '0' + hex;
				}
				hexString += hex;
			}
			return hexString.toUpperCase();
		},

		composite: function(colorArray, count, dest) {
			dest[0] = dest[1] = dest[2] = dest[3] = 1;
			for(var i = 0; i < count; ++i) {
				_composite(dest, colorArray[i]);
			}
		},

		fromFloats: function(r, g, b, a) {
			return [
				Math.round(255 * r),
				Math.round(255 * g),
				Math.round(255 * b),
				a
			];
		}
	};

	var _builtInColors = {
		aliceblue: '#F0F8FF',
		antiquewhite: '#FAEBD7',
		aqua: '#00FFFF',
		aquamarine: '#7FFFD4',
		azure: '#F0FFFF',
		beige: '#F5F5DC',
		bisque: '#FFE4C4',
		black: '#000000',
		blanchedalmond: '#FFEBCD',
		blue: '#0000FF',
		blueviolet: '#8A2BE2',
		brown: '#A52A2A',
		burlywood: '#DEB887',
		cadetblue: '#5F9EA0',
		chartreuse: '#7FFF00',
		chocolate: '#D2691E',
		coral: '#FF7F50',
		cornflowerblue: '#6495ED',
		cornsilk: '#FFF8DC',
		crimson: '#DC143C',
		cyan: '#00FFFF',
		darkblue: '#00008B',
		darkcyan: '#008B8B',
		darkgoldenrod: '#B8860B',
		darkgray: '#A9A9A9',
		darkgrey: '#A9A9A9',
		darkgreen: '#006400',
		darkkhaki: '#BDB76B',
		darkmagenta: '#8B008B',
		darkolivegreen: '#556B2F',
		darkorange: '#FF8C00',
		darkorchid: '#9932CC',
		darkred: '#8B0000',
		darksalmon: '#E9967A',
		darkseagreen: '#8FBC8F',
		darkslateblue: '#483D8B',
		darkslategray: '#2F4F4F',
		darkslategrey: '#2F4F4F',
		darkturquoise: '#00CED1',
		darkviolet: '#9400D3',
		deeppink: '#FF1493',
		deepskyblue: '#00BFFF',
		dimgray: '#696969',
		dimgrey: '#696969',
		dodgerblue: '#1E90FF',
		firebrick: '#B22222',
		floralwhite: '#FFFAF0',
		forestgreen: '#228B22',
		fuchsia: '#FF00FF',
		gainsboro: '#DCDCDC',
		ghostwhite: '#F8F8FF',
		gold: '#FFD700',
		goldenrod: '#DAA520',
		gray: '#808080',
		grey: '#808080',
		green: '#008000',
		greenyellow: '#ADFF2F',
		honeydew: '#F0FFF0',
		hotpink: '#FF69B4',
		indianred: '#CD5C5C',
		indigo: '#4B0082',
		ivory: '#FFFFF0',
		khaki: '#F0E68C',
		lavender: '#E6E6FA',
		lavenderblush: '#FFF0F5',
		lawngreen: '#7CFC00',
		lemonchiffon: '#FFFACD',
		lightblue: '#ADD8E6',
		lightcoral: '#F08080',
		lightcyan: '#E0FFFF',
		lightgoldenrodyellow: '#FAFAD2',
		lightgray: '#D3D3D3',
		lightgrey: '#D3D3D3',
		lightgreen: '#90EE90',
		lightpink: '#FFB6C1',
		lightsalmon: '#FFA07A',
		lightseagreen: '#20B2AA',
		lightskyblue: '#87CEFA',
		lightslategray: '#778899',
		lightslategrey: '#778899',
		lightsteelblue: '#B0C4DE',
		lightyellow: '#FFFFE0',
		lime: '#00FF00',
		limegreen: '#32CD32',
		linen: '#FAF0E6',
		magenta: '#FF00FF',
		maroon: '#800000',
		mediumaquamarine: '#66CDAA',
		mediumblue: '#0000CD',
		mediumorchid: '#BA55D3',
		mediumpurple: '#9370D8',
		mediumseagreen: '#3CB371',
		mediumslateblue: '#7B68EE',
		mediumspringgreen: '#00FA9A',
		mediumturquoise: '#48D1CC',
		mediumvioletred: '#C71585',
		midnightblue: '#191970',
		mintcream: '#F5FFFA',
		mistyrose: '#FFE4E1',
		moccasin: '#FFE4B5',
		navajowhite: '#FFDEAD',
		navy: '#000080',
		oldlace: '#FDF5E6',
		olive: '#808000',
		olivedrab: '#6B8E23',
		orange: '#FFA500',
		orangered: '#FF4500',
		orchid: '#DA70D6',
		palegoldenrod: '#EEE8AA',
		palegreen: '#98FB98',
		paleturquoise: '#AFEEEE',
		palevioletred: '#D87093',
		papayawhip: '#FFEFD5',
		peachpuff: '#FFDAB9',
		peru: '#CD853F',
		pink: '#FFC0CB',
		plum: '#DDA0DD',
		powderblue: '#B0E0E6',
		purple: '#800080',
		red: '#FF0000',
		rosybrown: '#BC8F8F',
		royalblue: '#4169E1',
		saddlebrown: '#8B4513',
		salmon: '#FA8072',
		sandybrown: '#F4A460',
		seagreen: '#2E8B57',
		seashell: '#FFF5EE',
		sienna: '#A0522D',
		silver: '#C0C0C0',
		skyblue: '#87CEEB',
		slateblue: '#6A5ACD',
		slategray: '#708090',
		slategrey: '#708090',
		snow: '#FFFAFA',
		springgreen: '#00FF7F',
		steelblue: '#4682B4',
		tan: '#D2B48C',
		teal: '#008080',
		thistle: '#D8BFD8',
		tomato: '#FF6347',
		turquoise: '#40E0D0',
		violet: '#EE82EE',
		wheat: '#F5DEB3',
		white: '#FFFFFF',
		whitesmoke: '#F5F5F5',
		yellow: '#FFFF00',
		yellowgreen: '#9ACD32'
	};

})();

(function() {
	L7.ColorLevelLoader = function(image, tileSize, borderWidth, borderFill) {
		this.image = image;
		this.width = image.width;
		this.height = image.height;
		this.tileSize = tileSize;
		this.borderWidth = borderWidth;
		this.borderFill = borderFill || 'black';
	};

	L7.ColorLevelLoader.prototype = {
		load: function() {
			var board = new L7.Board(this);

			var data = this._getData();

			for (var i = 0; i < data.length; i += 4) {
				var color = this._extractColor(data, i);

				if(color[3] > 0) {
					var position = this._getPosition(i);
					board.tileAt(position).color = color;
				}
			}
			return board;
		},

		_getData: function() {
			var canvas = document.createElement('canvas');
			canvas.width = this.width;
			canvas.height = this.height;

			var context = canvas.getContext('2d');
			context.drawImage(this.image, 0, 0);

			return context.getImageData(0, 0, this.width, this.height).data;
		},

		_extractColor: function(data, index) {
			var pixelArray = [];

			for (var i = index; i < index + 4; ++i) {
				pixelArray.push(data[i]);
			}

			pixelArray[3] /= 255;

			return pixelArray;
		},

		_getPosition: function(index) {
			index = Math.floor(index / 4);
			var x = index % this.width;
			var y = Math.floor(index / this.width);

			return L7.p(x, y);
		}
	};

})();


(function() {
	function _strip(src) {
		var lastPeriod = src.lastIndexOf('.');
		var lastSlash = src.lastIndexOf('/');

		if(lastPeriod > -1) {
			src = src.substring(0, lastPeriod);
		}
		if(lastSlash > -1) {
			src = src.substring(lastSlash + 1);
		}

		return src.replace(/[^a-zA-Z0-9]/g, '');
	}

	L7.ImageLoader = function(config) {
		_.extend(this, config);

		if(this.loadNow) {
			this.load();
		}
	};

	L7.ImageLoader.prototype = {
		load: function() {
			this._pendingCount = this.srcs.length;
			this._images = {};
			var me = this;

			this.srcs.forEach(function(src) {
				var image = new Image();
				image.onload = function() {
					me._images[_strip(src)] = image;
					--me._pendingCount;
					if(me._pendingCount === 0) {
						me.handler(me._images);
					}
				};
				image.src = src;
			});
		}
	};

})();

(function() {
	L7.LevelLoader = function(config) {
		_.extend(this, config);
		this.width = config.image.width;
		this.height = config.image.height;
	};

	L7.LevelLoader.prototype = {
		load: function() {
			var boardConfig = _.extend(this.boardConfig, {
				width: this.width,
				height: this.height
			});

			var board = new L7.Board(boardConfig);
			var actors = {};

			var data = this._getData();

			for (var i = 0; i < data.length; i += 4) {
				var color = this._extractColor(data, i);

				var entry = this.legend[color];

				if (entry) {
					var position = this._getPosition(i);

					if (entry.hasOwnProperty('constructor')) {
						var config = _.extend({},
						entry.config || {},
						{
							position: position
						});

						if (!_.isArray(entry.constructor)) {
							entry.constructor = [entry.constructor];
						}

						entry.constructor.forEach(function(constructor) {
							var actor = new constructor(config);

							actors[color] = actors[color] || [];
							actors[color].push(actor);
							board.addActor(actor);
						});
					}
					if (entry.tag) {
						board.tileAt(position).tag = entry.tag;
					}
					if(entry.color) {
						board.tileAt(position).color = entry.color;
					}
				}
			}
			return {
				board: board,
				actors: actors
			};
		},
		_getData: function() {
			var canvas = document.createElement('canvas');
			canvas.width = this.width;
			canvas.height = this.height;

			var context = canvas.getContext('2d');
			context.drawImage(this.image, 0, 0);

			return context.getImageData(0, 0, this.width, this.height).data;
		},

		_extractColor: function(data, index) {
			var pixelArray = [];

			for (var i = index; i < index + 3; ++i) {
				pixelArray.push(data[i]);
			}

			return L7.Color.fromArrayToHex(pixelArray);
		},

		_getPosition: function(index) {
			index = Math.floor(index / 4);
			var x = index % this.width;
			var y = Math.floor(index / this.width);

			return L7.p(x, y);
		}
	};

})();

(function() {
	L7.CanvasGameRenderer = function(viewport) {
		this.viewport = viewport;
	};

	L7.CanvasGameRenderer.prototype = {
		init: function(canvas) {
			canvas.style.imageRendering = '-webkit-optimize-contrast';
		},

		renderFrame: function(canvas, board, delta, anchorXpx, anchorYpx, timestamp) {
			var context = canvas.getContext('2d');
			context.clearRect(0, 0, canvas.width, canvas.height);
			board.render(delta, context, anchorXpx, anchorYpx, timestamp);
		}
	};

})();

(function() {
	var _maxDelta = (1 / 60) * 1000;

	window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame || window.oRequestAnimationFrame || function(callback) {
		window.setTimeout(callback, _maxDelta);
	};

	function _getConfig(configOrBoard) {
		if (typeof configOrBoard.render !== 'function' && typeof configOrBoard.update !== 'function') {
			return configOrBoard;
		}
		var b = configOrBoard;

		return {
			width: b.width * (b.tileSize + b.borderWidth) + b.borderWidth,
			height: b.height * (b.tileSize + b.borderWidth) + b.borderWidth,
			board: b
		};
	}

	L7.Game = function(configOrBoard) {
		_.extend(this, L7.Observable);
		var config = _getConfig(configOrBoard);
		_.extend(this, config);
		_.bindAll(this, '_doFrame');
		this.viewport = new L7.Viewport(this);

		if (this.board) {
			this.board.viewport = this.viewport;
		}
		this.container = this.container || document.body;

		if(this.clearOutContainer) {
			this._clearContainer(this.container);
		}

		this.renderer = L7.useWebGL ? new L7.WebGLGameRenderer(this.viewport) : new L7.CanvasGameRenderer(this.viewport);
		this._createCanvas();
		this.renderer.init(this.canvas);

		L7.Keys.init(this.canvas);
		L7.Mouse.init(this.canvas);

		this.delays = [];

		var me = this;
		L7.global.addEventListener('blur', function() {
			delete me._lastTimestamp;
		});

		if(this.board) {
			this.board.game = this;
		}
	};

	L7.Game.prototype = {
		_clearContainer: function(container) {
			container.innerHTML = '';
		},

		_createCanvas: function() {
			this.canvas = document.createElement('canvas');
			this.canvas.width = this.viewport.width;
			this.canvas.height = this.viewport.height;

			this.container.appendChild(this.canvas);

			var me = this;
			this.canvas.addEventListener('click', function(e) {
				me._onCanvasClick(e);
			}, false);
		},

		go: function() {
			delete this._lastTimestamp;
			this._doFrame(Date.now());
		},

		after: function(millis, callback) {
			this.delays.add({
				remaining: millis,
				handler: callback
			});
		},

		replaceBoard: function(newBoard) {
			if (this.board && this.board.destroy) {
				this.board.destroy();
			}
			this.board = newBoard;
			this.board.viewport = this.viewport;
			this.board.game = this;
			this.viewport.reset();
		},

		_updateDelays: function(delta) {
			var toDelete = [];
			this.delays.forEach(function(delay) {
				delay.remaining -= delta;
				if (delay.remaining <= 0) {
					delay.handler.call(delay.scope, this);
					toDelete.push(delay);
				}
			},
			this);

			toDelete.forEach(function(deleteMe) {
				this.delays.remove(deleteMe);
			},
			this);
		},

		_displayFps: function(end) {
			var seconds = (end - this._frameCountStart) / 1000;
			var fps = this._frameCount / seconds;

			if(this.fpsContainer) {
				this.fpsContainer.innerHTML = (fps | 0) + ' fps';
			} else {
				//console.log('fps: ' + fps);
			}
		},

		_updateFps: function(timestamp) {
			if(!this._frameCountStart) {
				this._frameCountStart = timestamp;
				this._frameCount = 1;
			} else {
				++this._frameCount;
				var delta = timestamp - this._frameCountStart;
				if(delta > 4000) {
					this._displayFps(timestamp);
					delete this._frameCountStart;
				}
			}
		},

		_doFrame: function(timestamp) {
			this._hasDoneFrame = true;
			this._updateFps(timestamp);

			var fullDelta = timestamp - (this._lastTimestamp || timestamp);
			this._lastTimestamp = timestamp;

			var delta = fullDelta;
			while (delta > 0) {
				var step = Math.min(_maxDelta, delta);
				this._updateDelays(step);
				this.board.update(step, timestamp);
				delta -= step;
			}

			this.renderer.renderFrame(this.canvas, this.board, fullDelta, this.viewport.anchorX, this.viewport.anchorY, timestamp);

			if (!this.paused) {
				requestAnimationFrame(this._doFrame);
			}
		},

		_onCanvasClick: function(e) {
			var canvasX = (e.x || e.clientX) - e.target.offsetLeft;
			var canvasY = (e.y || e.clientY) - e.target.offsetTop;

			this.board.clicked(L7.p(canvasX, canvasY));
		}
	};

	Object.defineProperty(L7.Game.prototype, 'paused', {
		get: function() {
			return this._paused;
		},
		set: function(paused) {
			var curPaused = this._paused;
			this._paused = paused;

			if (!paused) {
				this.go();
			} else if(!this._hasDoneFrame) {
				this._doFrame(Date.now());
			}

			if(curPaused !== paused) {
				this.fireEvent('pausechanged', paused);
			}
		}
	});
})();

(function() {
	L7.Keys = {
		arrows : {
			'37' : 'left',
			'38' : 'up',
			'39' : 'right',
			'40' : 'down'
		},
		init: function() {
			this._hook = window;

			this._keyDownListener = _.bind(this._onKeyDown, this);
			this._hook.addEventListener("keydown", this._keyDownListener, false);

			this._keyUpListener = _.bind(this._onKeyUp, this);
			this._hook.addEventListener("keyup", this._keyUpListener, false);

			this._downKeys = {};
		},

		_getCharacter: function(keyCode) {
			var arrow = this.arrows[keyCode.toString()];

			return arrow || String.fromCharCode(keyCode).toLowerCase();
		},

		_onKeyDown: function(e) {
			var character = this._getCharacter(e.keyCode);

			if (!this._downKeys[character]) {
				this._downKeys[character] = Date.now();
			}
		},

		_onKeyUp: function(e) {
			var character = this._getCharacter(e.keyCode);

			delete this._downKeys[character];
		},

		down: function(key) {
			return this._downKeys[key] !== undefined;
		},

		downSince: function(key, timestamp) {
			return this.down(key) && this._downKeys[key] > timestamp;
		}
	}
})();


(function() {
	L7.Mouse = {
		init: function(hook) {
			this._hook = hook;
			this._mouseMoveListener = _.bind(this._onMouseMove, this);
			this._hook.addEventListener('mousemove', this._mouseMoveListener, false);
			this._pos = L7.p();
		},

		_onMouseMove: function(e) {
			this._pos = L7.p(e.offsetX, e.offsetY);
		}
	};

	Object.defineProperty(L7.Mouse, 'position', {
		get: function() {
			return this._pos;
		},
		enumerable: true
	});
})();

(function() {
	L7.Viewport = function(config) {
		config = config || {};
		_.extend(this, config);

		if(_.isUndefined(this.preventOverscroll)) {
			this.preventOverscroll = false;
		}

		this.anchorX = (config.initialAnchor && config.initialAnchor.x) || 0;
		this.anchorY = (config.initialAnchor && config.initialAnchor.y) || 0;
		this.width = this.width || 100;
		this.height = this.height || 100;
	};

	L7.Viewport.prototype = {
		scrollY: function(amount) {
			this.anchorY += amount;
		},

		scrollX: function(amount) {
			this.anchorX += amount;
		},
		
		centerOn: function(xOrPair, yOrUndefined) {
			var x = xOrPair.x || xOrPair;
			var y = xOrPair.y || yOrUndefined;

			this.anchorX = Math.floor(x - this.width / 2)
			this.anchorY = Math.floor(y - this.height / 2)
		},

		reset: function() {
			this.anchorY = this.anchorX = 0;
		}
	};

})();

(function() {
	var _fragmentShaderCode = "precision lowp float;" +
		"varying vec4 vColor;" + 
		"void main(void) {" +
		"gl_FragColor = vColor;" +
		"}";

	var _vertexShaderCode = "attribute vec3 aVertexPosition;" +
		"attribute vec2 aOffsets;" +
		"attribute vec2 aVertexCenter;" +
		"attribute vec4 aVertexColor;" +
		"uniform mat4 uMVMatrix;" +
		"uniform mat4 uPMatrix;" +
		"varying vec4 vColor;" +
		"void main(void) {" +
		"float diffX = aVertexPosition.x - aVertexCenter.x;" +
		"float offsetX = (aOffsets.x * diffX) - diffX;" +
		"float diffY = aVertexPosition.y - aVertexCenter.y;" +
		"float offsetY = (aOffsets.y * diffY) - diffY;" +
		"float offsetZ = 0.0;" +
		"if(offsetX != 0.0 || offsetY != 0.0) {" +
		"offsetZ = 0.1;" +
		"}" +
		"gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition + vec3(offsetX, offsetY, offsetZ), 1.0);" +
		"vColor = aVertexColor;" + 
		"}";

	L7.WebGLGameRenderer = function(viewport) {
		this.viewport = viewport;
	};

	L7.WebGLGameRenderer.prototype = {
		_getShader: function(src, type) {
			var shader = this.gl.createShader(type);

			this.gl.shaderSource(shader, src);
			this.gl.compileShader(shader);

			if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
				throw new Error(this.gl.getShaderInfoLog(shader));
			}

			return shader;
		},

		_initShaders: function() {
			var fragmentShader = this._getShader(_fragmentShaderCode, this.gl.FRAGMENT_SHADER);
			var vertexShader = this._getShader(_vertexShaderCode, this.gl.VERTEX_SHADER);

			var shaderProgram = this.gl.createProgram();
			this.gl.attachShader(shaderProgram, vertexShader);
			this.gl.attachShader(shaderProgram, fragmentShader);
			this.gl.linkProgram(shaderProgram);

			if (!this.gl.getProgramParameter(shaderProgram, this.gl.LINK_STATUS)) {
				throw new Error("Could not initialise shaders");
			}

			this.gl.useProgram(shaderProgram);

			this.gl.vertexPositionAttribute = this.gl.getAttribLocation(shaderProgram, "aVertexPosition");
			this.gl.enableVertexAttribArray(this.gl.vertexPositionAttribute);

			this.gl.offsetsAttribute = this.gl.getAttribLocation(shaderProgram, "aOffsets");
			this.gl.enableVertexAttribArray(this.gl.offsetsAttribute);

			this.gl.centerPositionAttribute = this.gl.getAttribLocation(shaderProgram, "aVertexCenter");
			this.gl.enableVertexAttribArray(this.gl.centerPositionAttribute);

			this.gl.vertexColorAttribute = this.gl.getAttribLocation(shaderProgram, "aVertexColor");
			this.gl.enableVertexAttribArray(this.gl.vertexColorAttribute);

			this.pMatrixUniform = this.gl.getUniformLocation(shaderProgram, "uPMatrix");
			this.gl.mvMatrixUniform = this.gl.getUniformLocation(shaderProgram, "uMVMatrix");
		},

		init: function(canvas) {
			this.gl = canvas.getContext('experimental-webgl');

			this.gl.clearColor(0, 0, 0, 1);
			this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
    	this.gl.enable(this.gl.BLEND);
      this.gl.enable(this.gl.DEPTH_TEST);
			
			this.pMatrix = mat4.create();

			this._initShaders();
		},

		renderFrame: function(canvas, board, delta, anchorXpx, anchorYpx, timestamp) {
			this.gl.viewport(0, 0, this.viewport.width, this.viewport.height);
			this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

			mat4.ortho(0, this.viewport.width, this.viewport.height, 0, -100, 100, this.pMatrix);
			this.gl.uniformMatrix4fv(this.pMatrixUniform, false, this.pMatrix);

			board.render(delta, this.gl, anchorXpx, anchorYpx, timestamp);
		}
	};
})();

(function() {
	var _pi = Math.PI;
	var _twoPi = _pi * 2;
	var _piOver2 = _pi / 2;


	L7.Pair = function Pair(a, b) {
		this._a = a || 0;
		this._b = b || 0;
	};

	L7.Pair.prototype = {
		clone: function() {
			return L7.p(this.x, this.y);
		},

		equals: function(other) {
			if (other) {
				return (other === this) || (other._a === this._a && other._b == this._b) || (other.x === this._a && other.y == this._b) || (other.width == this._a && other.height == this._b);
			}
			return false;
		},
		up: function() {
			return L7.p(this.x, this.y - 1);
		},
		left: function() {
			return L7.p(this.x - 1, this.y);
		},
		right: function() {
			return L7.p(this.x + 1, this.y);
		},
		down: function() {
			return L7.p(this.x, this.y + 1);
		},
		add: function(otherPairOrNumber, numberOrUndefined) {
			var x, y;

			if (typeof otherPairOrNumber.x === 'number') {
				x = otherPairOrNumber.x;
			} else {
				x = otherPairOrNumber || 0;
			}

			if (typeof otherPairOrNumber.y === 'number') {
				y = otherPairOrNumber.y;
			} else {
				y = numberOrUndefined || 0;
			}

			return L7.p(this.x + x, this.y + y);
		},
		subtract: function(otherPairOrNumber, numberOrUndefined) {
			if (typeof otherPairOrNumber.x === 'number') {
				x = otherPairOrNumber.x;
			} else {
				x = otherPairOrNumber || 0;
			}

			if (typeof otherPairOrNumber.y === 'number') {
				y = otherPairOrNumber.y;
			} else {
				y = numberOrUndefined || 0;
			}

			return L7.p(this.x - x, this.y - y);
		},
		negate: function() {
			return L7.p(-this.x, - this.y);
		},
		multiply: function(scalar) {
			return L7.p(this.x * scalar, this.y * scalar);
		},
		round: function() {
			return L7.pr(this.x, this.y);
		},
		dot: function(other) {
			return this.x * other.x + this.y * other.y;
		},
		length: function() {
			return Math.sqrt(this.dot(this));
		},
		normalize: function() {
			return this.multiply(1.0 / this.length());
		},
		distanceFrom: function(other) {
			var delta = this.delta(other);

			return Math.sqrt(delta.dot(delta));
		},
		degreeAngleFrom: function(other) {
			return L7.radiansToDegrees(this.radianAngleFrom(other));
		},
		radianAngleFrom: function(other) {
			var x = this.x - other.x;
			var y = this.y - other.y;

			// special case for x equals zero, division by zero
			if (x === 0) {
				if (y < 0) {
					return _piOver2 * 3;
				} else {
					return _piOver2;
				}
			}

			// special case for y equals zero, the negative gets lost
			if (y === 0) {
				if (x < 0) {
					return _pi;
				} else {
					return 0;
				}
			}

			var tan = y / x;
			var radians = Math.atan(tan);

			// quad 1
			if (x > 0 && y > 0) {
				return radians;

				// quad 2, add 180
			} else if (x < 0 && y > 0) {
				return radians + _pi;

				// quad 3, add 180
			} else if (x < 0 && y < 0) {
				return radians + _pi;

				// if(x > 0 && y < 0) {
			} else {
				return radians + _twoPi;
			}
		},
		toString: function() {
			return "[" + this._a + "," + this._b + "]";
		}
	};

	L7.Pair.prototype.delta = L7.Pair.prototype.subtract;

	Object.defineProperty(L7.Pair.prototype, "width", {
		get: function() {
			return this._a;
		}
	});

	Object.defineProperty(L7.Pair.prototype, "height", {
		get: function() {
			return this._b;
		}
	});

	Object.defineProperty(L7.Pair.prototype, "x", {
		get: function() {
			return this._a;
		}
	});

	Object.defineProperty(L7.Pair.prototype, "y", {
		get: function() {
			return this._b;
		}
	});

	// simple utility methods
	L7.s = function(w, h) {
		return new L7.Pair(w, h);
	};

	L7.p = L7.s;

	L7.sr = function(w, h) {
		return new L7.Pair(Math.round(w), Math.round(h));
	};

	L7.pr = L7.sr;
})();

(function() {
	L7.Observable = {
		on: function(eventName, handler, scope) {
			this._listeners = this._listeners || {};

			if (!this._listeners[eventName]) {
				this._listeners[eventName] = [];
			}

			this._listeners[eventName].push({
				handler: handler,
				scope: scope
			});
		},

		fireEvent: function(eventName, varargs) {
			this._listeners = this._listeners || {};
			var listeners = this._listeners[eventName];

			if (_.isArray(listeners)) {
				var args = _.toArray(arguments);
				args.shift();
				_.each(listeners, function(listener) {
					listener.handler.apply(listener.scope, args);
				});
			}
		}
	};
})();

(function() {
	var _idCounter = 0;

	function getLastActor(tile) {
		return tile.inhabitants && tile.inhabitants.length && tile.inhabitants.last.owner;
	}

	function random11() {
		return L7.rand(-1, 1, true);
	}

	L7.ParticleSystem = function(config) {
		_.extend(this, config);
		this._particles = [];
		this.id = _idCounter++;
		this._particleTeam = this.team || 'particle-' + this.id;

		for (var i = 0; i < this.totalParticles; ++i) {
			this._particles.push(new L7.Actor({
				position: this.position.clone(),
				team: this._particleTeam
			}));
		}

		this._elapsed = 0;
		this._emitCounter = 0;
		this._particleIndex = 0;
		this._particleCount = 0;
		this.active = this.active || false;
	};

	L7.ParticleSystem.prototype = {
		onRemove: function(board) {
			this.reset();
			this._particles.forEach(function(actor) {
				this._initParticle(actor);
				board.removeActor(actor);
			}, this);
			this._addedActors = false;
		},

		reset: function() {
			this._particleCount = 0;
			this._particleIndex = 0;
		},

		_isFull: function() {
			return this._particleCount === this.totalParticles;
		},

		_initParticle: function(particle) {
			// position
			particle.rx = this.position.x + this.posVar.x * random11();
			particle.ry = this.position.y + this.posVar.y * random11();

			// direction
			var a = L7.degreesToRadians(this.angle + this.angleVar * random11());
			var v = L7.p(Math.cos(a), Math.sin(a));
			var s = this.speed + this.speedVar * random11();
			v = v.multiply(s);
			particle.dir = { x: v.x, y: v.y };

			// radial accel
			particle.radialAccel = this.radialAccel + this.radialAccelVar * random11();

			if(!!particle.radialAccel) {
				particle.radialAccel = 0;
			}

			// tangential accel
			particle.tangentialAccel = this.tangentialAccel + this.tangentialAccelVar * random11();
			if(!particle.tangentialAccel) {
				particle.tangentialAccel = 0;
			}

			// life
			var life = this.life + this.lifeVar * random11();
			particle.life = Math.max(0, life);

			// color
			var startColor = [
			this.startColor[0] + this.startColorVar[0] * random11(), this.startColor[1] + this.startColorVar[1] * random11(), this.startColor[2] + this.startColorVar[2] * random11(), this.startColor[3] + this.startColorVar[3] * random11()];

			var endColor = [
			this.endColor[0] + this.endColorVar[0] * random11(), this.endColor[1] + this.endColorVar[1] * random11(), this.endColor[2] + this.endColorVar[2] * random11(), this.endColor[3] + this.endColorVar[3] * random11()];

			particle.color = startColor;
			particle.pieces[0].color = startColor;
			particle.deltaColor = [(endColor[0] - startColor[0]) / particle.life, (endColor[1] - startColor[1]) / particle.life, (endColor[2] - startColor[2]) / particle.life, (endColor[3] - startColor[3]) / particle.life];

			if (!_.isUndefined(this.startSize)) {
				var startSize = this.startSize + this.startSizeVar * random11();
				startSize = Math.max(0, startSize);
				particle.size = startSize;
				if (!_.isUndefined(this.endSize)) {
					var endSize = this.endSize + this.endSizeVar * random11();
					particle.deltaSize = (endSize - startSize) / particle.life;
				} else {
					particle.deltaSize = 0;
				}
			} else {
				particle.size = 1;
				particle.deltaSize = 0;
			}
		},

		_addParticle: function() {
			if (this._isFull()) {
				return false;
			}

			var p = this._particles[this._particleCount];
			this._initParticle(p); 
			++this._particleCount;

			return true;
		},

		update: function(delta, timestamp, board) {
			if (!this.active) {
				return;
			}

			delta = delta / 1000;

			if (this.emissionRate) {
				var rate = 1.0 / this.emissionRate;
				this._emitCounter += delta;

				while (!this._isFull() && this._emitCounter > rate) {
					this._addParticle();
					this._emitCounter -= rate;
				}

			}

			this._elapsed += delta;
			this.active = this._elapsed < this.duration;

			this._particleIndex = 0;

			while (this._particleIndex < this._particleCount) {
				var p = this._particles[this._particleIndex];
				this._updateParticle(p, delta, this._particleIndex);
			}

			this._updateBoard(board);
		},

		_updateParticle: function(p, delta, i) {
			if (p.life > 0) {
				p.tmp = p.tmp || { x: 0, y: 0 };
				p.tmp.x = 0;
				p.tmp.y = 0;

				p.radial = p.radial || { x: 0, y: 0 };
				p.radial.x = 0;
				p.radial.y = 0;

				if(p.position.x !== this.position.x || p.position.y !== this.position.y) {
					var radialP = L7.p(p.rx, p.ry).normalize();
					p.radial.x = radialP.x;
					p.radial.y = radialP.y;
				}

				var tangential = _.clone(p.radial);

				p.radial.x *= p.radialAccel;
				p.radial.y *= p.radialAccel;

				var newy = tangential.x;
				tangential.x = - tangential.y;
				tangential.y = newy;
				tangential.x *= p.tangentialAccel;
				tangential.y *= p.tangentialAccel;

				p.tmp.x = p.radial.x + tangential.x + this.gravity.x;
				p.tmp.y = p.radial.y + tangential.y + this.gravity.y;

				p.tmp.x *= delta;
				p.tmp.y *= delta;

				p.dir.x += p.tmp.x;
				p.dir.y += p.tmp.y;

				p.tmp.x = p.dir.x * delta;
				p.tmp.y = p.dir.y * delta;

				p.rx += p.tmp.x;
				p.ry += p.tmp.y;

				p.goTo(L7.pr(p.rx, p.ry));

				p.color[0] += p.deltaColor[0] * delta;
				p.color[1] += p.deltaColor[1] * delta;
				p.color[2] += p.deltaColor[2] * delta;
				p.color[3] += p.deltaColor[3] * delta;

				p.size += p.deltaSize * delta;
				p.size = Math.max(0, p.size);
				p.pieces[0].scale = p.size;

				p.life -= delta;

				++this._particleIndex;
			} else {
				var temp = this._particles[i];
				this._particles[i] = this._particles[this._particleCount - 1];
				this._particles[this._particleCount - 1] = temp;

				--this._particleCount;
			}
		},

		_updateBoard: function(board) {
			if(!this._addedActors) {
				this._particles.forEach(function(p) {
					board.addActor(p);
				});
				this._addedActors = true;
			}

			var offScreen = L7.p(-1, -1);

			for(var i = this._particleCount; i < this._particles.length; ++i) {
				this._particles[i].goTo(offScreen);
			}
		}
	}

})();

// gl-matrix 1.2.4 - https://github.com/toji/gl-matrix/blob/master/LICENSE.md
(function(a){a.glMatrixArrayType=a.MatrixArray=null;a.vec3={};a.mat3={};a.mat4={};a.quat4={};a.setMatrixArrayType=function(a){return glMatrixArrayType=MatrixArray=a};a.determineMatrixArrayType=function(){return setMatrixArrayType("undefined"!==typeof Float32Array?Float32Array:Array)};determineMatrixArrayType()})("undefined"!=typeof exports?global:this);vec3.create=function(a){var b=new MatrixArray(3);a?(b[0]=a[0],b[1]=a[1],b[2]=a[2]):b[0]=b[1]=b[2]=0;return b};
vec3.set=function(a,b){b[0]=a[0];b[1]=a[1];b[2]=a[2];return b};vec3.add=function(a,b,c){if(!c||a===c)return a[0]+=b[0],a[1]+=b[1],a[2]+=b[2],a;c[0]=a[0]+b[0];c[1]=a[1]+b[1];c[2]=a[2]+b[2];return c};vec3.subtract=function(a,b,c){if(!c||a===c)return a[0]-=b[0],a[1]-=b[1],a[2]-=b[2],a;c[0]=a[0]-b[0];c[1]=a[1]-b[1];c[2]=a[2]-b[2];return c};vec3.multiply=function(a,b,c){if(!c||a===c)return a[0]*=b[0],a[1]*=b[1],a[2]*=b[2],a;c[0]=a[0]*b[0];c[1]=a[1]*b[1];c[2]=a[2]*b[2];return c};
vec3.negate=function(a,b){b||(b=a);b[0]=-a[0];b[1]=-a[1];b[2]=-a[2];return b};vec3.scale=function(a,b,c){if(!c||a===c)return a[0]*=b,a[1]*=b,a[2]*=b,a;c[0]=a[0]*b;c[1]=a[1]*b;c[2]=a[2]*b;return c};vec3.normalize=function(a,b){b||(b=a);var c=a[0],d=a[1],e=a[2],g=Math.sqrt(c*c+d*d+e*e);if(g){if(1===g)return b[0]=c,b[1]=d,b[2]=e,b}else return b[0]=0,b[1]=0,b[2]=0,b;g=1/g;b[0]=c*g;b[1]=d*g;b[2]=e*g;return b};
vec3.cross=function(a,b,c){c||(c=a);var d=a[0],e=a[1],a=a[2],g=b[0],f=b[1],b=b[2];c[0]=e*b-a*f;c[1]=a*g-d*b;c[2]=d*f-e*g;return c};vec3.length=function(a){var b=a[0],c=a[1],a=a[2];return Math.sqrt(b*b+c*c+a*a)};vec3.dot=function(a,b){return a[0]*b[0]+a[1]*b[1]+a[2]*b[2]};vec3.direction=function(a,b,c){c||(c=a);var d=a[0]-b[0],e=a[1]-b[1],a=a[2]-b[2],b=Math.sqrt(d*d+e*e+a*a);if(!b)return c[0]=0,c[1]=0,c[2]=0,c;b=1/b;c[0]=d*b;c[1]=e*b;c[2]=a*b;return c};
vec3.lerp=function(a,b,c,d){d||(d=a);d[0]=a[0]+c*(b[0]-a[0]);d[1]=a[1]+c*(b[1]-a[1]);d[2]=a[2]+c*(b[2]-a[2]);return d};vec3.dist=function(a,b){var c=b[0]-a[0],d=b[1]-a[1],e=b[2]-a[2];return Math.sqrt(c*c+d*d+e*e)};
vec3.unproject=function(a,b,c,d,e){e||(e=a);var g=mat4.create(),f=new MatrixArray(4);f[0]=2*(a[0]-d[0])/d[2]-1;f[1]=2*(a[1]-d[1])/d[3]-1;f[2]=2*a[2]-1;f[3]=1;mat4.multiply(c,b,g);if(!mat4.inverse(g))return null;mat4.multiplyVec4(g,f);if(0===f[3])return null;e[0]=f[0]/f[3];e[1]=f[1]/f[3];e[2]=f[2]/f[3];return e};vec3.str=function(a){return"["+a[0]+", "+a[1]+", "+a[2]+"]"};
mat3.create=function(a){var b=new MatrixArray(9);a&&(b[0]=a[0],b[1]=a[1],b[2]=a[2],b[3]=a[3],b[4]=a[4],b[5]=a[5],b[6]=a[6],b[7]=a[7],b[8]=a[8]);return b};mat3.set=function(a,b){b[0]=a[0];b[1]=a[1];b[2]=a[2];b[3]=a[3];b[4]=a[4];b[5]=a[5];b[6]=a[6];b[7]=a[7];b[8]=a[8];return b};mat3.identity=function(a){a||(a=mat3.create());a[0]=1;a[1]=0;a[2]=0;a[3]=0;a[4]=1;a[5]=0;a[6]=0;a[7]=0;a[8]=1;return a};
mat3.transpose=function(a,b){if(!b||a===b){var c=a[1],d=a[2],e=a[5];a[1]=a[3];a[2]=a[6];a[3]=c;a[5]=a[7];a[6]=d;a[7]=e;return a}b[0]=a[0];b[1]=a[3];b[2]=a[6];b[3]=a[1];b[4]=a[4];b[5]=a[7];b[6]=a[2];b[7]=a[5];b[8]=a[8];return b};mat3.toMat4=function(a,b){b||(b=mat4.create());b[15]=1;b[14]=0;b[13]=0;b[12]=0;b[11]=0;b[10]=a[8];b[9]=a[7];b[8]=a[6];b[7]=0;b[6]=a[5];b[5]=a[4];b[4]=a[3];b[3]=0;b[2]=a[2];b[1]=a[1];b[0]=a[0];return b};
mat3.str=function(a){return"["+a[0]+", "+a[1]+", "+a[2]+", "+a[3]+", "+a[4]+", "+a[5]+", "+a[6]+", "+a[7]+", "+a[8]+"]"};mat4.create=function(a){var b=new MatrixArray(16);a&&(b[0]=a[0],b[1]=a[1],b[2]=a[2],b[3]=a[3],b[4]=a[4],b[5]=a[5],b[6]=a[6],b[7]=a[7],b[8]=a[8],b[9]=a[9],b[10]=a[10],b[11]=a[11],b[12]=a[12],b[13]=a[13],b[14]=a[14],b[15]=a[15]);return b};
mat4.set=function(a,b){b[0]=a[0];b[1]=a[1];b[2]=a[2];b[3]=a[3];b[4]=a[4];b[5]=a[5];b[6]=a[6];b[7]=a[7];b[8]=a[8];b[9]=a[9];b[10]=a[10];b[11]=a[11];b[12]=a[12];b[13]=a[13];b[14]=a[14];b[15]=a[15];return b};mat4.identity=function(a){a||(a=mat4.create());a[0]=1;a[1]=0;a[2]=0;a[3]=0;a[4]=0;a[5]=1;a[6]=0;a[7]=0;a[8]=0;a[9]=0;a[10]=1;a[11]=0;a[12]=0;a[13]=0;a[14]=0;a[15]=1;return a};
mat4.transpose=function(a,b){if(!b||a===b){var c=a[1],d=a[2],e=a[3],g=a[6],f=a[7],h=a[11];a[1]=a[4];a[2]=a[8];a[3]=a[12];a[4]=c;a[6]=a[9];a[7]=a[13];a[8]=d;a[9]=g;a[11]=a[14];a[12]=e;a[13]=f;a[14]=h;return a}b[0]=a[0];b[1]=a[4];b[2]=a[8];b[3]=a[12];b[4]=a[1];b[5]=a[5];b[6]=a[9];b[7]=a[13];b[8]=a[2];b[9]=a[6];b[10]=a[10];b[11]=a[14];b[12]=a[3];b[13]=a[7];b[14]=a[11];b[15]=a[15];return b};
mat4.determinant=function(a){var b=a[0],c=a[1],d=a[2],e=a[3],g=a[4],f=a[5],h=a[6],i=a[7],j=a[8],k=a[9],l=a[10],n=a[11],o=a[12],m=a[13],p=a[14],a=a[15];return o*k*h*e-j*m*h*e-o*f*l*e+g*m*l*e+j*f*p*e-g*k*p*e-o*k*d*i+j*m*d*i+o*c*l*i-b*m*l*i-j*c*p*i+b*k*p*i+o*f*d*n-g*m*d*n-o*c*h*n+b*m*h*n+g*c*p*n-b*f*p*n-j*f*d*a+g*k*d*a+j*c*h*a-b*k*h*a-g*c*l*a+b*f*l*a};
mat4.inverse=function(a,b){b||(b=a);var c=a[0],d=a[1],e=a[2],g=a[3],f=a[4],h=a[5],i=a[6],j=a[7],k=a[8],l=a[9],n=a[10],o=a[11],m=a[12],p=a[13],r=a[14],s=a[15],A=c*h-d*f,B=c*i-e*f,t=c*j-g*f,u=d*i-e*h,v=d*j-g*h,w=e*j-g*i,x=k*p-l*m,y=k*r-n*m,z=k*s-o*m,C=l*r-n*p,D=l*s-o*p,E=n*s-o*r,q=A*E-B*D+t*C+u*z-v*y+w*x;if(!q)return null;q=1/q;b[0]=(h*E-i*D+j*C)*q;b[1]=(-d*E+e*D-g*C)*q;b[2]=(p*w-r*v+s*u)*q;b[3]=(-l*w+n*v-o*u)*q;b[4]=(-f*E+i*z-j*y)*q;b[5]=(c*E-e*z+g*y)*q;b[6]=(-m*w+r*t-s*B)*q;b[7]=(k*w-n*t+o*B)*q;b[8]=
(f*D-h*z+j*x)*q;b[9]=(-c*D+d*z-g*x)*q;b[10]=(m*v-p*t+s*A)*q;b[11]=(-k*v+l*t-o*A)*q;b[12]=(-f*C+h*y-i*x)*q;b[13]=(c*C-d*y+e*x)*q;b[14]=(-m*u+p*B-r*A)*q;b[15]=(k*u-l*B+n*A)*q;return b};mat4.toRotationMat=function(a,b){b||(b=mat4.create());b[0]=a[0];b[1]=a[1];b[2]=a[2];b[3]=a[3];b[4]=a[4];b[5]=a[5];b[6]=a[6];b[7]=a[7];b[8]=a[8];b[9]=a[9];b[10]=a[10];b[11]=a[11];b[12]=0;b[13]=0;b[14]=0;b[15]=1;return b};
mat4.toMat3=function(a,b){b||(b=mat3.create());b[0]=a[0];b[1]=a[1];b[2]=a[2];b[3]=a[4];b[4]=a[5];b[5]=a[6];b[6]=a[8];b[7]=a[9];b[8]=a[10];return b};mat4.toInverseMat3=function(a,b){var c=a[0],d=a[1],e=a[2],g=a[4],f=a[5],h=a[6],i=a[8],j=a[9],k=a[10],l=k*f-h*j,n=-k*g+h*i,o=j*g-f*i,m=c*l+d*n+e*o;if(!m)return null;m=1/m;b||(b=mat3.create());b[0]=l*m;b[1]=(-k*d+e*j)*m;b[2]=(h*d-e*f)*m;b[3]=n*m;b[4]=(k*c-e*i)*m;b[5]=(-h*c+e*g)*m;b[6]=o*m;b[7]=(-j*c+d*i)*m;b[8]=(f*c-d*g)*m;return b};
mat4.multiply=function(a,b,c){c||(c=a);var d=a[0],e=a[1],g=a[2],f=a[3],h=a[4],i=a[5],j=a[6],k=a[7],l=a[8],n=a[9],o=a[10],m=a[11],p=a[12],r=a[13],s=a[14],a=a[15],A=b[0],B=b[1],t=b[2],u=b[3],v=b[4],w=b[5],x=b[6],y=b[7],z=b[8],C=b[9],D=b[10],E=b[11],q=b[12],F=b[13],G=b[14],b=b[15];c[0]=A*d+B*h+t*l+u*p;c[1]=A*e+B*i+t*n+u*r;c[2]=A*g+B*j+t*o+u*s;c[3]=A*f+B*k+t*m+u*a;c[4]=v*d+w*h+x*l+y*p;c[5]=v*e+w*i+x*n+y*r;c[6]=v*g+w*j+x*o+y*s;c[7]=v*f+w*k+x*m+y*a;c[8]=z*d+C*h+D*l+E*p;c[9]=z*e+C*i+D*n+E*r;c[10]=z*g+C*
j+D*o+E*s;c[11]=z*f+C*k+D*m+E*a;c[12]=q*d+F*h+G*l+b*p;c[13]=q*e+F*i+G*n+b*r;c[14]=q*g+F*j+G*o+b*s;c[15]=q*f+F*k+G*m+b*a;return c};mat4.multiplyVec3=function(a,b,c){c||(c=b);var d=b[0],e=b[1],b=b[2];c[0]=a[0]*d+a[4]*e+a[8]*b+a[12];c[1]=a[1]*d+a[5]*e+a[9]*b+a[13];c[2]=a[2]*d+a[6]*e+a[10]*b+a[14];return c};
mat4.multiplyVec4=function(a,b,c){c||(c=b);var d=b[0],e=b[1],g=b[2],b=b[3];c[0]=a[0]*d+a[4]*e+a[8]*g+a[12]*b;c[1]=a[1]*d+a[5]*e+a[9]*g+a[13]*b;c[2]=a[2]*d+a[6]*e+a[10]*g+a[14]*b;c[3]=a[3]*d+a[7]*e+a[11]*g+a[15]*b;return c};
mat4.translate=function(a,b,c){var d=b[0],e=b[1],b=b[2],g,f,h,i,j,k,l,n,o,m,p,r;if(!c||a===c)return a[12]=a[0]*d+a[4]*e+a[8]*b+a[12],a[13]=a[1]*d+a[5]*e+a[9]*b+a[13],a[14]=a[2]*d+a[6]*e+a[10]*b+a[14],a[15]=a[3]*d+a[7]*e+a[11]*b+a[15],a;g=a[0];f=a[1];h=a[2];i=a[3];j=a[4];k=a[5];l=a[6];n=a[7];o=a[8];m=a[9];p=a[10];r=a[11];c[0]=g;c[1]=f;c[2]=h;c[3]=i;c[4]=j;c[5]=k;c[6]=l;c[7]=n;c[8]=o;c[9]=m;c[10]=p;c[11]=r;c[12]=g*d+j*e+o*b+a[12];c[13]=f*d+k*e+m*b+a[13];c[14]=h*d+l*e+p*b+a[14];c[15]=i*d+n*e+r*b+a[15];
return c};mat4.scale=function(a,b,c){var d=b[0],e=b[1],b=b[2];if(!c||a===c)return a[0]*=d,a[1]*=d,a[2]*=d,a[3]*=d,a[4]*=e,a[5]*=e,a[6]*=e,a[7]*=e,a[8]*=b,a[9]*=b,a[10]*=b,a[11]*=b,a;c[0]=a[0]*d;c[1]=a[1]*d;c[2]=a[2]*d;c[3]=a[3]*d;c[4]=a[4]*e;c[5]=a[5]*e;c[6]=a[6]*e;c[7]=a[7]*e;c[8]=a[8]*b;c[9]=a[9]*b;c[10]=a[10]*b;c[11]=a[11]*b;c[12]=a[12];c[13]=a[13];c[14]=a[14];c[15]=a[15];return c};
mat4.rotate=function(a,b,c,d){var e=c[0],g=c[1],c=c[2],f=Math.sqrt(e*e+g*g+c*c),h,i,j,k,l,n,o,m,p,r,s,A,B,t,u,v,w,x,y,z;if(!f)return null;1!==f&&(f=1/f,e*=f,g*=f,c*=f);h=Math.sin(b);i=Math.cos(b);j=1-i;b=a[0];f=a[1];k=a[2];l=a[3];n=a[4];o=a[5];m=a[6];p=a[7];r=a[8];s=a[9];A=a[10];B=a[11];t=e*e*j+i;u=g*e*j+c*h;v=c*e*j-g*h;w=e*g*j-c*h;x=g*g*j+i;y=c*g*j+e*h;z=e*c*j+g*h;e=g*c*j-e*h;g=c*c*j+i;d?a!==d&&(d[12]=a[12],d[13]=a[13],d[14]=a[14],d[15]=a[15]):d=a;d[0]=b*t+n*u+r*v;d[1]=f*t+o*u+s*v;d[2]=k*t+m*u+A*
v;d[3]=l*t+p*u+B*v;d[4]=b*w+n*x+r*y;d[5]=f*w+o*x+s*y;d[6]=k*w+m*x+A*y;d[7]=l*w+p*x+B*y;d[8]=b*z+n*e+r*g;d[9]=f*z+o*e+s*g;d[10]=k*z+m*e+A*g;d[11]=l*z+p*e+B*g;return d};mat4.rotateX=function(a,b,c){var d=Math.sin(b),b=Math.cos(b),e=a[4],g=a[5],f=a[6],h=a[7],i=a[8],j=a[9],k=a[10],l=a[11];c?a!==c&&(c[0]=a[0],c[1]=a[1],c[2]=a[2],c[3]=a[3],c[12]=a[12],c[13]=a[13],c[14]=a[14],c[15]=a[15]):c=a;c[4]=e*b+i*d;c[5]=g*b+j*d;c[6]=f*b+k*d;c[7]=h*b+l*d;c[8]=e*-d+i*b;c[9]=g*-d+j*b;c[10]=f*-d+k*b;c[11]=h*-d+l*b;return c};
mat4.rotateY=function(a,b,c){var d=Math.sin(b),b=Math.cos(b),e=a[0],g=a[1],f=a[2],h=a[3],i=a[8],j=a[9],k=a[10],l=a[11];c?a!==c&&(c[4]=a[4],c[5]=a[5],c[6]=a[6],c[7]=a[7],c[12]=a[12],c[13]=a[13],c[14]=a[14],c[15]=a[15]):c=a;c[0]=e*b+i*-d;c[1]=g*b+j*-d;c[2]=f*b+k*-d;c[3]=h*b+l*-d;c[8]=e*d+i*b;c[9]=g*d+j*b;c[10]=f*d+k*b;c[11]=h*d+l*b;return c};
mat4.rotateZ=function(a,b,c){var d=Math.sin(b),b=Math.cos(b),e=a[0],g=a[1],f=a[2],h=a[3],i=a[4],j=a[5],k=a[6],l=a[7];c?a!==c&&(c[8]=a[8],c[9]=a[9],c[10]=a[10],c[11]=a[11],c[12]=a[12],c[13]=a[13],c[14]=a[14],c[15]=a[15]):c=a;c[0]=e*b+i*d;c[1]=g*b+j*d;c[2]=f*b+k*d;c[3]=h*b+l*d;c[4]=e*-d+i*b;c[5]=g*-d+j*b;c[6]=f*-d+k*b;c[7]=h*-d+l*b;return c};
mat4.frustum=function(a,b,c,d,e,g,f){f||(f=mat4.create());var h=b-a,i=d-c,j=g-e;f[0]=2*e/h;f[1]=0;f[2]=0;f[3]=0;f[4]=0;f[5]=2*e/i;f[6]=0;f[7]=0;f[8]=(b+a)/h;f[9]=(d+c)/i;f[10]=-(g+e)/j;f[11]=-1;f[12]=0;f[13]=0;f[14]=-(2*g*e)/j;f[15]=0;return f};mat4.perspective=function(a,b,c,d,e){a=c*Math.tan(a*Math.PI/360);b*=a;return mat4.frustum(-b,b,-a,a,c,d,e)};
mat4.ortho=function(a,b,c,d,e,g,f){f||(f=mat4.create());var h=b-a,i=d-c,j=g-e;f[0]=2/h;f[1]=0;f[2]=0;f[3]=0;f[4]=0;f[5]=2/i;f[6]=0;f[7]=0;f[8]=0;f[9]=0;f[10]=-2/j;f[11]=0;f[12]=-(a+b)/h;f[13]=-(d+c)/i;f[14]=-(g+e)/j;f[15]=1;return f};
mat4.lookAt=function(a,b,c,d){d||(d=mat4.create());var e,g,f,h,i,j,k,l,n=a[0],o=a[1],a=a[2];f=c[0];h=c[1];g=c[2];k=b[0];c=b[1];e=b[2];if(n===k&&o===c&&a===e)return mat4.identity(d);b=n-k;c=o-c;k=a-e;l=1/Math.sqrt(b*b+c*c+k*k);b*=l;c*=l;k*=l;e=h*k-g*c;g=g*b-f*k;f=f*c-h*b;(l=Math.sqrt(e*e+g*g+f*f))?(l=1/l,e*=l,g*=l,f*=l):f=g=e=0;h=c*f-k*g;i=k*e-b*f;j=b*g-c*e;(l=Math.sqrt(h*h+i*i+j*j))?(l=1/l,h*=l,i*=l,j*=l):j=i=h=0;d[0]=e;d[1]=h;d[2]=b;d[3]=0;d[4]=g;d[5]=i;d[6]=c;d[7]=0;d[8]=f;d[9]=j;d[10]=k;d[11]=
0;d[12]=-(e*n+g*o+f*a);d[13]=-(h*n+i*o+j*a);d[14]=-(b*n+c*o+k*a);d[15]=1;return d};mat4.fromRotationTranslation=function(a,b,c){c||(c=mat4.create());var d=a[0],e=a[1],g=a[2],f=a[3],h=d+d,i=e+e,j=g+g,a=d*h,k=d*i,d=d*j,l=e*i,e=e*j,g=g*j,h=f*h,i=f*i,f=f*j;c[0]=1-(l+g);c[1]=k+f;c[2]=d-i;c[3]=0;c[4]=k-f;c[5]=1-(a+g);c[6]=e+h;c[7]=0;c[8]=d+i;c[9]=e-h;c[10]=1-(a+l);c[11]=0;c[12]=b[0];c[13]=b[1];c[14]=b[2];c[15]=1;return c};
mat4.str=function(a){return"["+a[0]+", "+a[1]+", "+a[2]+", "+a[3]+", "+a[4]+", "+a[5]+", "+a[6]+", "+a[7]+", "+a[8]+", "+a[9]+", "+a[10]+", "+a[11]+", "+a[12]+", "+a[13]+", "+a[14]+", "+a[15]+"]"};quat4.create=function(a){var b=new MatrixArray(4);a&&(b[0]=a[0],b[1]=a[1],b[2]=a[2],b[3]=a[3]);return b};quat4.set=function(a,b){b[0]=a[0];b[1]=a[1];b[2]=a[2];b[3]=a[3];return b};
quat4.calculateW=function(a,b){var c=a[0],d=a[1],e=a[2];if(!b||a===b)return a[3]=-Math.sqrt(Math.abs(1-c*c-d*d-e*e)),a;b[0]=c;b[1]=d;b[2]=e;b[3]=-Math.sqrt(Math.abs(1-c*c-d*d-e*e));return b};quat4.dot=function(a,b){return a[0]*b[0]+a[1]*b[1]+a[2]*b[2]+a[3]*b[3]};quat4.inverse=function(a,b){var c=a[0],d=a[1],e=a[2],g=a[3],c=(c=c*c+d*d+e*e+g*g)?1/c:0;if(!b||a===b)return a[0]*=-c,a[1]*=-c,a[2]*=-c,a[3]*=c,a;b[0]=-a[0]*c;b[1]=-a[1]*c;b[2]=-a[2]*c;b[3]=a[3]*c;return b};
quat4.conjugate=function(a,b){if(!b||a===b)return a[0]*=-1,a[1]*=-1,a[2]*=-1,a;b[0]=-a[0];b[1]=-a[1];b[2]=-a[2];b[3]=a[3];return b};quat4.length=function(a){var b=a[0],c=a[1],d=a[2],a=a[3];return Math.sqrt(b*b+c*c+d*d+a*a)};quat4.normalize=function(a,b){b||(b=a);var c=a[0],d=a[1],e=a[2],g=a[3],f=Math.sqrt(c*c+d*d+e*e+g*g);if(0===f)return b[0]=0,b[1]=0,b[2]=0,b[3]=0,b;f=1/f;b[0]=c*f;b[1]=d*f;b[2]=e*f;b[3]=g*f;return b};
quat4.multiply=function(a,b,c){c||(c=a);var d=a[0],e=a[1],g=a[2],a=a[3],f=b[0],h=b[1],i=b[2],b=b[3];c[0]=d*b+a*f+e*i-g*h;c[1]=e*b+a*h+g*f-d*i;c[2]=g*b+a*i+d*h-e*f;c[3]=a*b-d*f-e*h-g*i;return c};quat4.multiplyVec3=function(a,b,c){c||(c=b);var d=b[0],e=b[1],g=b[2],b=a[0],f=a[1],h=a[2],a=a[3],i=a*d+f*g-h*e,j=a*e+h*d-b*g,k=a*g+b*e-f*d,d=-b*d-f*e-h*g;c[0]=i*a+d*-b+j*-h-k*-f;c[1]=j*a+d*-f+k*-b-i*-h;c[2]=k*a+d*-h+i*-f-j*-b;return c};
quat4.toMat3=function(a,b){b||(b=mat3.create());var c=a[0],d=a[1],e=a[2],g=a[3],f=c+c,h=d+d,i=e+e,j=c*f,k=c*h,c=c*i,l=d*h,d=d*i,e=e*i,f=g*f,h=g*h,g=g*i;b[0]=1-(l+e);b[1]=k+g;b[2]=c-h;b[3]=k-g;b[4]=1-(j+e);b[5]=d+f;b[6]=c+h;b[7]=d-f;b[8]=1-(j+l);return b};
quat4.toMat4=function(a,b){b||(b=mat4.create());var c=a[0],d=a[1],e=a[2],g=a[3],f=c+c,h=d+d,i=e+e,j=c*f,k=c*h,c=c*i,l=d*h,d=d*i,e=e*i,f=g*f,h=g*h,g=g*i;b[0]=1-(l+e);b[1]=k+g;b[2]=c-h;b[3]=0;b[4]=k-g;b[5]=1-(j+e);b[6]=d+f;b[7]=0;b[8]=c+h;b[9]=d-f;b[10]=1-(j+l);b[11]=0;b[12]=0;b[13]=0;b[14]=0;b[15]=1;return b};
quat4.slerp=function(a,b,c,d){d||(d=a);var e=a[0]*b[0]+a[1]*b[1]+a[2]*b[2]+a[3]*b[3],g,f;if(1<=Math.abs(e))return d!==a&&(d[0]=a[0],d[1]=a[1],d[2]=a[2],d[3]=a[3]),d;g=Math.acos(e);f=Math.sqrt(1-e*e);if(0.001>Math.abs(f))return d[0]=0.5*a[0]+0.5*b[0],d[1]=0.5*a[1]+0.5*b[1],d[2]=0.5*a[2]+0.5*b[2],d[3]=0.5*a[3]+0.5*b[3],d;e=Math.sin((1-c)*g)/f;c=Math.sin(c*g)/f;d[0]=a[0]*e+b[0]*c;d[1]=a[1]*e+b[1]*c;d[2]=a[2]*e+b[2]*c;d[3]=a[3]*e+b[3]*c;return d};
quat4.str=function(a){return"["+a[0]+", "+a[1]+", "+a[2]+", "+a[3]+"]"};
(function() {
	L7.FadeBase = function(config) {
		_.extend(this, config);
		this.elapsed = 0;
		if(this.color) {
			this.color = L7.Color.toArray(this.color);
		}	
	};

	L7.FadeBase.prototype = {
		update: function(delta, timestamp) {
			this.elapsed += delta;
			var percentage = this.elapsed / this.duration;
			this.updateColor(this.color, percentage);

			if(percentage > 1 && this.onComplete) {
				this.onComplete(this);
			}

			this.board.update(delta, timestamp);
		},

		render: function(delta, context, anchorX, anchorY, timestamp) {
			this.board.render(delta, context, anchorX, anchorY, timestamp);
			context.save();
			context.fillStyle = L7.Color.toCssString(this.color);
			context.fillRect(0, 0, context.canvas.width, context.canvas.height);
			context.restore();
		}
	};

	Object.defineProperty(L7.FadeBase.prototype, 'viewport', {
			set: function(viewport) {
				this._viewport = viewport;
				if(this.board) {
					this.board.viewport = viewport;
				}
			},
			get: function() {
				return this._viewport;
			},
			enumerable: true
	});
})();


(function() {
	L7.TransitionFadeIn = function(config) {
		config.color = config.from;
		L7.FadeBase.call(this, config);
	};

	L7.TransitionFadeIn.prototype = new L7.FadeBase();

	L7.TransitionFadeIn.prototype.updateColor = function(color, percentage) {
		color[3] = 1 - percentage;
	};
})();


(function() {
	L7.FadeOut = function(config) {
		config.color = config.to;
		L7.FadeBase.call(this, config);
	};

	L7.FadeOut.prototype = new L7.FadeBase();

	L7.FadeOut.prototype.updateColor = function(color, percentage) {
		color[3] = percentage;
	};
})();



(function() {
	L7.FadeOutIn = function(config) {
		_.extend(this, config);
		_.bindAll(this, '_onFadeOutComplete', '_onFadeInComplete');

		this.delegate = new L7.FadeOut({
			board: this.fromBoard,
			to: this.color,
			duration: this.duration / 2,
			onComplete: this._onFadeOutComplete
		});
	};

	L7.FadeOutIn.prototype = {
		_onFadeOutComplete: function() {
			this.delegate = new L7.FadeIn({
				board: this.toBoard,
				from: this.color,
				duration: this.duration / 2,
				onComplete: this._onFadeInComplete
			});
			this.delegate.viewport = this.viewport;
		},

		_onFadeInComplete: function() {
			if (this.onComplete) {
				this.onComplete();
			} else if (this.game) {
				this.game.replaceBoard(this.toBoard);
			}
		},

		update: function() {
			this.delegate.update.apply(this.delegate, arguments);
		},
		render: function() {
			this.delegate.render.apply(this.delegate, arguments);
		}
	};

	Object.defineProperty(L7.FadeOutIn.prototype, 'viewport', {
		set: function(viewport) {
			this._viewport = viewport;
			if (this.delegate) {
				this.delegate.viewport = viewport;
			}
		},
		get: function() {
			return this._viewport;
		},
		enumerable: true
	});
})();

(function() {
	if(typeof Array.prototype.add === 'undefined') {
		Array.prototype.add = function(item) {
			this.push(item);
			return this;
		};
	}

	if(typeof Array.prototype.remove === 'undefined') {
		Array.prototype.remove = function(item) {
			var index = this.indexOf(item);

			if(index >= 0) {
				this.splice(index, 1);
			}
			return this;
		};
	}

	if(typeof Array.prototype.last === 'undefined') {
		Object.defineProperty(Array.prototype, 'last', {
			get: function() {
				return this[this.length - 1];
			},
			enumerable: false
		});
	}

	if(typeof Array.prototype.first === 'undefined') {
		Object.defineProperty(Array.prototype, 'first', {
			get: function() {
				return this[0];
			},
			enumerable: false
		});
	}

})();

(function() {
	function _isInteger(num) {
		return num === (num | 0);
	};

	L7.rand = function(minOrMax, maxOrUndefined, dontFloor) {
		if(_.isUndefined(dontFloor)) {
			dontFloor = false;
		}

		var min = _.isNumber(maxOrUndefined) ? minOrMax : 0;
		var max = _.isNumber(maxOrUndefined) ? maxOrUndefined : minOrMax;

		var range = max - min;

		var result = Math.random() * range + min;
		if(_isInteger(min) && _isInteger(max) && !dontFloor) {
			return Math.floor(result);
		} else {
			return result;
		}
	};

	L7.coin = function() {
		return L7.rand(0, 2) === 0;
	};

	L7.degreesToRadians = function(degrees) {
		degrees = degrees || 0;
		return degrees * Math.PI / 180;
	};

	L7.radiansToDegrees = function(radians) {
		radians = radians || 0;
		return radians * 180 / Math.PI;
	};
})();

