(function() {
	var _global = this;

	_global.L7 = _global.L7 || {};

	_global.L7.global = _global;

})();

(function() {
	L7.AnimationFactory = function(owner, board) {
		this._owner = owner;
		this._board = board;
		this._buildStack = [];
		this._targetStack = [];
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
				this._getBoard().addDaemon(ani);
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
				this._getBoard().addDaemon(ani);
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
		tween: function(config) {
			return this._addAnimation(config, L7.Tween);
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
	}

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

				var value = this.from;

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

			if (this.jitter) {
				position += L7.rand(-this.jitter, this.jitter);
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
	L7.Actor = function(config) {
		_.extend(this, config);
		this.ani = new L7.AnimationFactory(this);

		this.position = this.position || L7.p(0, 0);
		this.shape = this.shape || [[5]];
		this.keyInputs = this.keyInputs || {};

		this.pieces = this._createPieces();
		this._listeners = {};
	};

	L7.Actor.prototype = {
		getAnimationTargets: function(filter) {
			if(filter) {
				return this.pieces.filter(filter);
			} else {
				return this.pieces;
			}
		},

		on: function(eventName, handler, scope) {
			if(!this._listeners[eventName]) {
				this._listeners[eventName] = [];
			}

			this._listeners[eventName].push({
				handler: handler,
				scope: scope
			});
		},

		fireEvent: function(eventName, varargs) {
			var listeners = this._listeners[eventName];

			if(_.isArray(listeners)) {
				var args = _.toArray(arguments);
				args.shift();
				_.each(listeners, function(listener) {
					listener.handler.apply(listener.scope, args);
				});
			}
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
			if(!this.color) {
				return;
			}

			if(_.isNumber(this.color[0])) {
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
						var piecePosition = anchorPosition.add(anchorDelta); 
						var color = this._getColor(x, y);
						var piece = new L7.Piece({
							position: piecePosition,
							color: color,
							isAnchor: this.shape[y][x] === L7.Actor.ANCHOR,
							owner: this,
							scale: _.isNumber(this.scale) ? this.scale : 1
						});
						if (piece.isAnchor) {
							this.anchorPiece = piece;
						}
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
				positions.push(piece.position.add(delta));
			});

			return positions;
		},

		left: function(amount) {
			this.goTo(this.position.add(-amount, 0));
		},

		right: function(amount) {
			this.goTo(this.position.add(amount, 0));
		},

		up: function(amount) {
			this.goTo(this.position.add(0, -amount));
		},

		down: function(amount) {
			this.goTo(this.position.add(0, amount));
		},

		goBack: function() {
			this.goTo(this._lastPosition.clone());
		},

		goTo: function(pos) {
			if(this.onGoTo) {
				if(!this.onGoTo(this._getPiecePositionsAnchoredAt(this.position), this._getPiecePositionsAnchoredAt(pos), this.board)) {
					return;
				}
			}

			this._lastPosition = this.position.clone();

			this.position = pos;

			if(this.board) {
				this.board.moveActor({
					actor: this,
					from: this._lastPosition,
					to: this.position
				});
			}
		},
		update: function(delta, timestamp) {
			var keyWasDown = false;
			_(this.keyInputs).each(function(value, key) {
				if (value.repeat && L7.Keys.down(key) || L7.Keys.downSince(key, this._lastTimestamp || 0)) {
					keyWasDown = true;
					if (typeof value.enabled === 'undefined' || value.enabled.call(this)) {
						value.handler.call(this, delta);
					}
				}
			},
			this);

			if(!keyWasDown && this.onNoKeyDown) {
				this.onNoKeyDown(delta);
			}

			this._updateTimers(delta);

			this._lastTimestamp = timestamp;
		},

		_updateTimers: function(delta) {
			if (!this.timers) {
				return;
			}

			_.each(this.timers, function(timer) {
				if (typeof timer.enabled === 'undefined'
					|| timer.enabled === true 
					|| (typeof timer.enabled === 'function' && timer.enabled.call(this))) {

					timer.elapsed = timer.elapsed || 0;
					timer.elapsed += delta;
					if (timer.elapsed >= timer.interval) {
						timer.elapsed -= timer.interval;
						timer.handler.call(this);
					}
				}
			},
			this);
		}
	};

	Object.defineProperty(L7.Actor, 'ANCHOR', {
		get: function() {
			return 5
		},
		enumerable: false
	});

})();

(function() {
	L7.Board = function(config) {
		_.extend(this, config || {});
		this.ani = new L7.AnimationFactory(this, this);
		this.size = new L7.Pair(this.width || 0, this.height || 0);
		this.borderWidth = this.borderWidth || 0;
		this.tileSize = this.tileSize || 0;

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
		dump: function() {
			console.log('');
			console.log('');
			this._rows.forEach(function(row) {
				var rs = '';
				row.forEach(function(tile) {
					var color = tile.getColor();
					if(!color) {
						rs += '.';
					} else {
						if(tile.inhabitants.length) {
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

			var tileX = Math.floor(x / (this.tileSize + this.borderWidth));
			var tileY = Math.floor(y / (this.tileSize + this.borderWidth));

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
		_removePieces: function(pieces) {
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
				this._removePieces(actor.pieces);
				this._addPieces(actor.pieces);
			}
		},
		addActor: function(actor) {
			if (actor.pieces) {
				this._addPieces(actor.pieces);
			}

			this.actors.push(actor);
			actor.board = this;
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
				this._removePieces(actor.pieces);
			}
			this.actors.remove(actor);
			delete actor.board;
		},

		addDaemon: function(daemon) {
			this.daemons.push(daemon);
		},
		removeDaemon: function(daemon) {
			if(this.daemons.indexOf(daemon) > -1 && daemon.onRemove) {
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
			piece.position = to;

		},
		movePiece: function(options) {
			this._movePiece(options.piece, options.delta || options.to.delta(options.from));
		},
		moveActor: function(options) {
			options.actor.pieces.forEach(function(piece) {
				this._movePiece(piece, options.delta || options.to.delta(options.from));
			},
			this);

			if (options.actor.onOutOfBounds && this.isOutOfBounds(options.actor)) {
				options.actor.onOutOfBounds.call(options.actor);
			}
		},

		update: function(delta, timestamp) {
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

			this._hitManager.detectHits(this.tiles);
		},

		render: function(delta, context, anchorXpx, anchorYpx, timestamp) {
			anchorXpx += this.offsetX || 0;
			anchorYpx += this.offsetY || 0;

			var c = context,
			bw = this.borderWidth,
			ts = this.tileSize,
			seedYFunc = anchorYpx < 0 ? Math.ceil: Math.floor,
			seedy = seedYFunc(anchorYpx / (ts + bw)),
			offsetY = - anchorYpx % (ts + bw),
			y,
			yl = Math.min(this._rows.length, Math.ceil((anchorYpx + c.canvas.height) / (ts + bw))),
			seedXFunc = anchorXpx < 0 ? Math.ceil: Math.floor,
			seedx = seedXFunc(anchorXpx / (ts + bw)),
			offsetX = - anchorXpx % (ts + bw),
			x,
			xl = Math.min(this._rows[0].length, Math.ceil((anchorXpx + c.canvas.width) / (ts + bw))),
			tile,
			color,
			lastColor,
			row;

			var scaledOut = [];

			for (y = seedy; y < yl; ++y) {
				if (y >= 0) {
					row = this._rows[y];
					for (x = seedx; x < xl; ++x) {
						if (x >= 0) {
	

							tile = row[x];
							color = tile.getColor();

							if (color) {
								scale = tile.getScale();
								if (!_.isNumber(scale)) {
									scale = 1;
								}

								if (scale !== 1) {
									scaledOut.push(tile);
									color = tile.getColor(true);
									scale = 1;
								}
								if(color) {
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
									c.fillStyle = color;
									var size = Math.round(ts * scale);
									var offset = ts / 2 - size / 2;
									c.fillRect((x - seedx) * (ts + bw) + bw + offset + offsetX, (y - seedy) * (ts + bw) + bw + offset + offsetY, size, size);
								}
							}
						}
					}
				}
			}

			scaledOut.sort(function(a, b) {
				return a.scale - b.scale;
			});

			for (var i = 0; i < scaledOut.length; ++i) {
				var tile = scaledOut[i];
				var scale = tile.getScale();
				var color = tile.getColor();

				if (color) {
					c.fillStyle = color;
					var size = Math.round(ts * scale);
					var offset = ts / 2 - size / 2;
					c.fillRect((tile.x - seedx) * (ts + bw) + bw + offset + offsetX, (tile.y - seedy) * (ts + bw) + bw + offset + offsetY, size, size);
				}
			}

			for (var i = 0; i < this.freeActors.length; ++i) {
				var freeActor = this.freeActors[i];
				var color = L7.Color.toCssString(freeActor.color);

				if (color) {
					c.fillStyle = color;
					c.fillRect(freeActor.position.x - anchorXpx, freeActor.position.y - anchorYpx, ts, ts);
				}
			}
		}
	};

})();

(function() {
	L7.HitManager = function() {};

	L7.HitManager.prototype = {
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

		this.boards.forEach(function(board) {
			if(!_.isNumber(board.parallaxRatio)) {
				throw new Error("ParallaxBoard: given a board that lacks a parallax ratio");
			}
		});
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
				board.render(delta, context, anchorX * board.parallaxRatio, anchorY * board.parallaxRatio, timestamp);
			});
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
})();

(function() {
	L7.Piece = function(config) {
		_.extend(this, config || {});
	};

	L7.Piece.prototype = {
		render: function() {
			if(this.sprite) {
				this.sprite.overlay = this._overlay;
				this.sprite.render.apply(this.sprite, arguments);
			}
		}
	};

	Object.defineProperty(L7.Piece.prototype, 'overlay', {
		get: function() {
			return this._overlay;
		},
		set: function(overlay) {
			this._overlay = overlay;
		},
		enumerable: true
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
		this.board = config.board;

		this.inhabitants = _.clone(config.inhabitants || []);
		this.position = L7.p(this.x, this.y);
	};

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
			var colors = [];

			if(this.color) {
				colors.push(this.color);
			}

			if(!skipInhabitants) {
				for(var i = 0; i < this.inhabitants.length; ++i) {
					var inhabColor = this.inhabitants[i].color;
					if(inhabColor) {
						colors.push(inhabColor);
					}
				}
			}

			if(this.overlayColor) {
				colors.push(this.overlayColor);
			}

			if(colors.length > 0) {
				var composited = L7.Color.composite.apply(L7.Color, colors);
				return L7.Color.toCssString(composited);
			}
		},

		getColorOld: function() {
			// this is the original version. Keeping it around because it's possible faster?
			var color;
			if (this.inhabitants.length === 0 || !this.inhabitants[this.inhabitants.length -1].color) {
				color = this.color;
			} else {
				var topInhab = this.inhabitants[this.inhabitants.length - 1];

				if (L7.Color.isOpaque(topInhab.color) || ! this.color) {
					color = topInhab.color;
				} else {
					var base = this.color.slice(0);
					color = L7.Color.composite(base, topInhab.color);
				}
			}

			if (this.overlayColor) {
				if (!color || L7.Color.isOpaque(this.overlayColor)) {
					color = this.overlayColor;
				} else {
					color = L7.Color.composite(color.slice(0), this.overlayColor);
				}
			}

			if (color) {
				var css = L7.Color.toCssString(color);
				return css;
			}
		},

		getScale: function() {
			if (this.inhabitants.length === 0 || !this.inhabitants.last.color) {
				return this.scale;
			} else {
				return this.inhabitants.last.scale;
			}
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

		composite: function(colorVarArgs) {
			var output = this.toArray(arguments[0]).slice(0);
			for(var i = 1; i < arguments.length; ++i) {
				_composite(output, this.toArray(arguments[i]));
			}

			//output[3] = 1;

			return output;
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
	L7.ImageLoader = function(config) {
		_.extend(this, config);

		if(this.loadNow) {
			this.load();
		}
	};

	L7.ImageLoader.prototype = {
		load: function() {
			this._pendingCount = this.srcs.length;
			this._images = [];
			var me = this;

			this.srcs.forEach(function(src) {
				var image = new Image();
				image.onload = function() {
					var index = me.srcs.indexOf(src);
					me._images[index] = image;
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
	var _maxDelta = (1 / 60) * 1000;

	window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame || window.oRequestAnimationFrame || function(callback) {
		window.setTimeout(callback, 1000 / 60);
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
		var config = _getConfig(configOrBoard);
		_.extend(this, config);
		_.bindAll(this, '_doFrame');
		this.viewport = new L7.Viewport(this);

		if (this.board) {
			this.board.viewport = this.viewport;
		}
		this.container = this.container || document.body;
		this.canvas = this._createCanvas();

		L7.Keys.init(this.canvas);
		L7.Mouse.init(this.canvas);

		this.delays = [];

		var me = this;
		L7.global.addEventListener('blur', function() {
			delete me._lastTimestamp;
		});
	};

	L7.Game.prototype = {
		_createCanvas: function() {
			var canvas = document.createElement('canvas');
			canvas.width = this.viewport.width;
			canvas.height = this.viewport.height;
			canvas.style.imageRendering = '-webkit-optimize-contrast';

			this.container.appendChild(canvas);
			return canvas;
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

		_pause: function() {
			var context = this.canvas.getContext('2d');
			context.save();
			context.fillStyle = 'rgba(255,255,255,0.5)';
			context.fillRect(0, 0, this.canvas.width, this.canvas.height);
			context.restore();
		},

		_doFrame: function(timestamp) {
			var fullDelta = timestamp - (this._lastTimestamp || timestamp);
			this._lastTimestamp = timestamp;

			var delta = fullDelta;
			while (delta > 0) {
				var step = Math.min(_maxDelta, delta);
				this._updateDelays(step);
				this.board.update(step, timestamp);
				delta -= step;
			}

			var context = this.canvas.getContext('2d');
			context.clearRect(0, 0, this.canvas.width, this.canvas.height);

			this.board.render(fullDelta, context, this.viewport.anchorX, this.viewport.anchorY, timestamp);

			if(!this.paused) {
				requestAnimationFrame(this._doFrame);
			}
		}
	};

	Object.defineProperty(L7.Game.prototype, 'paused', {
		get: function() {
			return this._paused;
		},
		set: function(paused) {
			var curPaused = this._paused;
			this._paused = paused;

			if (curPaused !== paused) {
				if (paused) {
					this._pause();
				} else {
					this.go();
				}
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
			this.endColor[0] * this.endColorVar[0] * random11(), this.endColor[1] * this.endColorVar[1] * random11(), this.endColor[2] * this.endColorVar[2] * random11(), this.endColor[3] * this.endColorVar[3] * random11()];

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
				var tmp = { x: 0, y: 0 };
				var radial = { x: 0, y: 0 };

				//if (p.rx !== 0 && p.ry !== 0) {
				if(p.position.x !== this.position.x || p.position.y !== this.position.y) {
					var radialP = L7.p(p.rx, p.ry).normalize();
					radial = { x: radialP.x, y: radialP.y };
				}

				var tangential = _.clone(radial);

				radial.x *= p.radialAccel;
				radial.y *= p.radialAccel;

				var newy = tangential.x;
				tangential.x = - tangential.y;
				tangential.y = newy;
				tangential.x *= p.tangentialAccel;
				tangential.y *= p.tangentialAccel;

				tmp.x = radial.x + tangential.x + this.gravity.x;
				tmp.y = radial.y + tangential.y + this.gravity.y;

				tmp.x *= delta;
				tmp.y *= delta;

				p.dir.x += tmp.x;
				p.dir.y += tmp.y;

				tmp.x = p.dir.x * delta;
				tmp.y = p.dir.y * delta;

				p.rx += tmp.x;
				p.ry += tmp.y;

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
	L7.FadeIn = function(config) {
		config.color = config.from;
		L7.FadeBase.call(this, config);
	};

	L7.FadeIn.prototype = new L7.FadeBase();

	L7.FadeIn.prototype.updateColor = function(color, percentage) {
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

