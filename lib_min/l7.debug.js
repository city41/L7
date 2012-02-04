(function() {
	var _global = this;

	_global.L7 = _global.L7 || {};

	_global.L7.global = _global;

})();

(function() {
	L7.Actor = function(config) {
		_.extend(this, config);

		this.position = this.position || L7.p(0, 0);
		this.shape = this.shape || [[5]];
		this.keyInputs = this.keyInputs || {};

		this.pieces = this._createPieces();
		this._listeners = {};
	};

	L7.Actor.prototype = {
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
			return this.color;
			var color;
			if (_.isString(this.color)) {
				color = this.color;
			} else if (_.isArray(this.color)) {
				color = this.color[y][x];
			}
			return color;
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
							owner: this
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
			if(actor.pieces) {
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
			var c = context,
			bw = this.borderWidth,
			ts = this.tileSize,
			seedYFunc = anchorYpx < 0 ? Math.ceil : Math.floor,
			seedy = seedYFunc(anchorYpx / (ts + bw)),
			offsetY = -anchorYpx % (ts + bw),
			y,
			yl = Math.min(this._rows.length, Math.ceil((anchorYpx + c.canvas.height) / (ts + bw))),
			seedXFunc = anchorXpx < 0 ? Math.ceil : Math.floor,
			seedx = seedXFunc(anchorXpx / (ts + bw)),
			offsetX = -anchorXpx % (ts + bw),
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
							scale = tile.getScale();
							if (!_.isNumber(scale)) {
								scale = 1;
							}

							if (scale !== 0 && color) {
								if (scale <= 1) {
									if(this.borderFill) {
										c.fillStyle = this.borderFill;
										c.fillRect((x - seedx) * (ts + bw) + offsetX, (y - seedy) * (ts + bw) + offsetY, ts + (2*bw), ts + (2*bw));
									}
									c.fillStyle = color;
									var size = Math.round(ts * scale);
									var offset = ts / 2 - size / 2;
									c.fillRect((x - seedx) * (ts + bw) + bw + offset + offsetX, (y - seedy) * (ts + bw) + bw + offset + offsetY, size, size);
								} else {
									scaledOut.push(tile);
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
				debugger;
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

			for(var i = 0; i < this.freeActors.length; ++i) {
				var freeActor = this.freeActors[i];
				var color = L7.Color.toCssString(freeActor.color);

				if(color) {
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

		getColor: function() {
			var colors = [];

			if(this.color) {
				colors.push(this.color);
			}

			if(this.inhabitants.length > 0 && this.inhabitants.last.color) {
				colors.push(this.inhabitants.last.color);
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
				return 'rgb(' + colorArray[0] + ',' + colorArray[1] + ',' + colorArray[2] + ')';
			} else {
				return 'rgba(' + colorArray[0] + ',' + colorArray[1] + ',' + colorArray[2] + ',' +  (colorArray[3]) + ')';
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

			output[3] = 1;

			return output;
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

	window.requestAnimationFrame = window.requestAnimationFrame ||
		window.mozRequestAnimationFrame ||  
   	window.webkitRequestAnimationFrame || 
		window.msRequestAnimationFrame ||
		window.oRequestAnimationFrame ||
		function(callback) {
			window.setTimeout(callback, 1000 / 60);
		};

	function _getConfig(configOrBoard) {
		if(!(configOrBoard instanceof L7.Board)) {
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

		if(this.board) {
			this.board.viewport = this.viewport;
		}
		this.container = this.container || document.body;
		this.canvas = this._createCanvas();

		this.delays = [];
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
			this._lastTimestamp = Date.now();
			this._doFrame(this._lastTimestamp);
		},

		after: function(millis, callback) {
			this.delays.add({
				remaining: millis,
				handler: callback
			});
		},

		replaceBoard: function(newBoard) {
			if(this.board && this.board.destroy) {
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
				if(delay.remaining <= 0) {
					delay.handler.call(delay.scope, this);
					toDelete.push(delay);
				}
			}, this);

			toDelete.forEach(function(deleteMe) {
				this.delays.remove(deleteMe);
			}, this);
		},

		_doFrame: function(timestamp) {
			var fullDelta = timestamp - this._lastTimestamp;
			this._lastTimestamp = timestamp;
			
			var delta = fullDelta;
			while(delta > 0) {
				var step = Math.min(_maxDelta, delta);
				this._updateDelays(step);
				this.board.update(step, timestamp);
				delta -= step;
			}

			var context = this.canvas.getContext('2d');
			context.clearRect(0, 0, this.canvas.width, this.canvas.height);

			this.board.render(fullDelta, context, this.viewport.anchorX, this.viewport.anchorY, timestamp);
			requestAnimationFrame(this._doFrame);
		}
	};

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
	L7.Pair = function Pair(a, b) {
		this._a = a || 0;
		this._b = b || 0;
	};

	L7.Pair.prototype = {
		clone: function() {
			return L7.p(this.x, this.y);
		},

		equals: function(other) {
			if(other) {
				return (other === this) || 
					(other._a === this._a && other._b == this._b) ||
					(other.x === this._a && other.y == this._b) ||
					(other.width == this._a && other.height == this._b);
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

			if(typeof otherPairOrNumber.x === 'number') {
				x = otherPairOrNumber.x;
			} else {
				x = otherPairOrNumber || 0;
			}

			if(typeof otherPairOrNumber.y === 'number') {
				y = otherPairOrNumber.y;
			} else {
				y = numberOrUndefined || 0;
			}

			return L7.p(this.x + x, this.y + y);
		},
		subtract: function(otherPairOrNumber, numberOrUndefined) {
			if(typeof otherPairOrNumber.x === 'number') {
				x = otherPairOrNumber.x;
			} else {
				x = otherPairOrNumber || 0;
			}

			if(typeof otherPairOrNumber.y === 'number') {
				y = otherPairOrNumber.y;
			} else {
				y = numberOrUndefined || 0;
			}

			return L7.p(this.x - x, this.y - y);
		},
		negate: function() {
			return L7.p(-this.x, -this.y);
		},
		multiply: function(scalar) {
			return L7.p(this.x * scalar, this.y * scalar);
		},
		dot: function(other) {
			return this.x * other.x + this.y * other.y;
		},
		distanceFrom: function(other) {
			var delta = this.delta(other);

			return Math.sqrt(delta.dot(delta));
		},
		toString: function p_toString() {
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

// Underscore.js 1.2.3
// (c) 2009-2011 Jeremy Ashkenas, DocumentCloud Inc.
// Underscore is freely distributable under the MIT license.
// Portions of Underscore are inspired or borrowed from Prototype,
// Oliver Steele's Functional, and John Resig's Micro-Templating.
// For all details and documentation:
// http://documentcloud.github.com/underscore
(function(){function r(a,c,d){if(a===c)return a!==0||1/a==1/c;if(a==null||c==null)return a===c;if(a._chain)a=a._wrapped;if(c._chain)c=c._wrapped;if(a.isEqual&&b.isFunction(a.isEqual))return a.isEqual(c);if(c.isEqual&&b.isFunction(c.isEqual))return c.isEqual(a);var e=l.call(a);if(e!=l.call(c))return false;switch(e){case "[object String]":return a==String(c);case "[object Number]":return a!=+a?c!=+c:a==0?1/a==1/c:a==+c;case "[object Date]":case "[object Boolean]":return+a==+c;case "[object RegExp]":return a.source==
c.source&&a.global==c.global&&a.multiline==c.multiline&&a.ignoreCase==c.ignoreCase}if(typeof a!="object"||typeof c!="object")return false;for(var f=d.length;f--;)if(d[f]==a)return true;d.push(a);var f=0,g=true;if(e=="[object Array]"){if(f=a.length,g=f==c.length)for(;f--;)if(!(g=f in a==f in c&&r(a[f],c[f],d)))break}else{if("constructor"in a!="constructor"in c||a.constructor!=c.constructor)return false;for(var h in a)if(m.call(a,h)&&(f++,!(g=m.call(c,h)&&r(a[h],c[h],d))))break;if(g){for(h in c)if(m.call(c,
h)&&!f--)break;g=!f}}d.pop();return g}var s=this,F=s._,o={},k=Array.prototype,p=Object.prototype,i=k.slice,G=k.concat,H=k.unshift,l=p.toString,m=p.hasOwnProperty,v=k.forEach,w=k.map,x=k.reduce,y=k.reduceRight,z=k.filter,A=k.every,B=k.some,q=k.indexOf,C=k.lastIndexOf,p=Array.isArray,I=Object.keys,t=Function.prototype.bind,b=function(a){return new n(a)};if(typeof exports!=="undefined"){if(typeof module!=="undefined"&&module.exports)exports=module.exports=b;exports._=b}else typeof define==="function"&&
define.amd?define("underscore",function(){return b}):s._=b;b.VERSION="1.2.3";var j=b.each=b.forEach=function(a,c,b){if(a!=null)if(v&&a.forEach===v)a.forEach(c,b);else if(a.length===+a.length)for(var e=0,f=a.length;e<f;e++){if(e in a&&c.call(b,a[e],e,a)===o)break}else for(e in a)if(m.call(a,e)&&c.call(b,a[e],e,a)===o)break};b.map=function(a,c,b){var e=[];if(a==null)return e;if(w&&a.map===w)return a.map(c,b);j(a,function(a,g,h){e[e.length]=c.call(b,a,g,h)});return e};b.reduce=b.foldl=b.inject=function(a,
c,d,e){var f=arguments.length>2;a==null&&(a=[]);if(x&&a.reduce===x)return e&&(c=b.bind(c,e)),f?a.reduce(c,d):a.reduce(c);j(a,function(a,b,i){f?d=c.call(e,d,a,b,i):(d=a,f=true)});if(!f)throw new TypeError("Reduce of empty array with no initial value");return d};b.reduceRight=b.foldr=function(a,c,d,e){var f=arguments.length>2;a==null&&(a=[]);if(y&&a.reduceRight===y)return e&&(c=b.bind(c,e)),f?a.reduceRight(c,d):a.reduceRight(c);var g=b.toArray(a).reverse();e&&!f&&(c=b.bind(c,e));return f?b.reduce(g,
c,d,e):b.reduce(g,c)};b.find=b.detect=function(a,c,b){var e;D(a,function(a,g,h){if(c.call(b,a,g,h))return e=a,true});return e};b.filter=b.select=function(a,c,b){var e=[];if(a==null)return e;if(z&&a.filter===z)return a.filter(c,b);j(a,function(a,g,h){c.call(b,a,g,h)&&(e[e.length]=a)});return e};b.reject=function(a,c,b){var e=[];if(a==null)return e;j(a,function(a,g,h){c.call(b,a,g,h)||(e[e.length]=a)});return e};b.every=b.all=function(a,c,b){var e=true;if(a==null)return e;if(A&&a.every===A)return a.every(c,
b);j(a,function(a,g,h){if(!(e=e&&c.call(b,a,g,h)))return o});return e};var D=b.some=b.any=function(a,c,d){c||(c=b.identity);var e=false;if(a==null)return e;if(B&&a.some===B)return a.some(c,d);j(a,function(a,b,h){if(e||(e=c.call(d,a,b,h)))return o});return!!e};b.include=b.contains=function(a,c){var b=false;if(a==null)return b;return q&&a.indexOf===q?a.indexOf(c)!=-1:b=D(a,function(a){return a===c})};b.invoke=function(a,c){var d=i.call(arguments,2);return b.map(a,function(a){return(c.call?c||a:a[c]).apply(a,
d)})};b.pluck=function(a,c){return b.map(a,function(a){return a[c]})};b.max=function(a,c,d){if(!c&&b.isArray(a))return Math.max.apply(Math,a);if(!c&&b.isEmpty(a))return-Infinity;var e={computed:-Infinity};j(a,function(a,b,h){b=c?c.call(d,a,b,h):a;b>=e.computed&&(e={value:a,computed:b})});return e.value};b.min=function(a,c,d){if(!c&&b.isArray(a))return Math.min.apply(Math,a);if(!c&&b.isEmpty(a))return Infinity;var e={computed:Infinity};j(a,function(a,b,h){b=c?c.call(d,a,b,h):a;b<e.computed&&(e={value:a,
computed:b})});return e.value};b.shuffle=function(a){var c=[],b;j(a,function(a,f){f==0?c[0]=a:(b=Math.floor(Math.random()*(f+1)),c[f]=c[b],c[b]=a)});return c};b.sortBy=function(a,c,d){return b.pluck(b.map(a,function(a,b,g){return{value:a,criteria:c.call(d,a,b,g)}}).sort(function(a,c){var b=a.criteria,d=c.criteria;return b<d?-1:b>d?1:0}),"value")};b.groupBy=function(a,c){var d={},e=b.isFunction(c)?c:function(a){return a[c]};j(a,function(a,b){var c=e(a,b);(d[c]||(d[c]=[])).push(a)});return d};b.sortedIndex=
function(a,c,d){d||(d=b.identity);for(var e=0,f=a.length;e<f;){var g=e+f>>1;d(a[g])<d(c)?e=g+1:f=g}return e};b.toArray=function(a){return!a?[]:a.toArray?a.toArray():b.isArray(a)?i.call(a):b.isArguments(a)?i.call(a):b.values(a)};b.size=function(a){return b.toArray(a).length};b.first=b.head=function(a,b,d){return b!=null&&!d?i.call(a,0,b):a[0]};b.initial=function(a,b,d){return i.call(a,0,a.length-(b==null||d?1:b))};b.last=function(a,b,d){return b!=null&&!d?i.call(a,Math.max(a.length-b,0)):a[a.length-
1]};b.rest=b.tail=function(a,b,d){return i.call(a,b==null||d?1:b)};b.compact=function(a){return b.filter(a,function(a){return!!a})};b.flatten=function(a,c){return b.reduce(a,function(a,e){if(b.isArray(e))return a.concat(c?e:b.flatten(e));a[a.length]=e;return a},[])};b.without=function(a){return b.difference(a,i.call(arguments,1))};b.uniq=b.unique=function(a,c,d){var d=d?b.map(a,d):a,e=[];b.reduce(d,function(d,g,h){if(0==h||(c===true?b.last(d)!=g:!b.include(d,g)))d[d.length]=g,e[e.length]=a[h];return d},
[]);return e};b.union=function(){return b.uniq(b.flatten(arguments,true))};b.intersection=b.intersect=function(a){var c=i.call(arguments,1);return b.filter(b.uniq(a),function(a){return b.every(c,function(c){return b.indexOf(c,a)>=0})})};b.difference=function(a){var c=b.flatten(i.call(arguments,1));return b.filter(a,function(a){return!b.include(c,a)})};b.zip=function(){for(var a=i.call(arguments),c=b.max(b.pluck(a,"length")),d=Array(c),e=0;e<c;e++)d[e]=b.pluck(a,""+e);return d};b.indexOf=function(a,
c,d){if(a==null)return-1;var e;if(d)return d=b.sortedIndex(a,c),a[d]===c?d:-1;if(q&&a.indexOf===q)return a.indexOf(c);for(d=0,e=a.length;d<e;d++)if(d in a&&a[d]===c)return d;return-1};b.lastIndexOf=function(a,b){if(a==null)return-1;if(C&&a.lastIndexOf===C)return a.lastIndexOf(b);for(var d=a.length;d--;)if(d in a&&a[d]===b)return d;return-1};b.range=function(a,b,d){arguments.length<=1&&(b=a||0,a=0);for(var d=arguments[2]||1,e=Math.max(Math.ceil((b-a)/d),0),f=0,g=Array(e);f<e;)g[f++]=a,a+=d;return g};
var E=function(){};b.bind=function(a,c){var d,e;if(a.bind===t&&t)return t.apply(a,i.call(arguments,1));if(!b.isFunction(a))throw new TypeError;e=i.call(arguments,2);return d=function(){if(!(this instanceof d))return a.apply(c,e.concat(i.call(arguments)));E.prototype=a.prototype;var b=new E,g=a.apply(b,e.concat(i.call(arguments)));return Object(g)===g?g:b}};b.bindAll=function(a){var c=i.call(arguments,1);c.length==0&&(c=b.functions(a));j(c,function(c){a[c]=b.bind(a[c],a)});return a};b.memoize=function(a,
c){var d={};c||(c=b.identity);return function(){var b=c.apply(this,arguments);return m.call(d,b)?d[b]:d[b]=a.apply(this,arguments)}};b.delay=function(a,b){var d=i.call(arguments,2);return setTimeout(function(){return a.apply(a,d)},b)};b.defer=function(a){return b.delay.apply(b,[a,1].concat(i.call(arguments,1)))};b.throttle=function(a,c){var d,e,f,g,h,i=b.debounce(function(){h=g=false},c);return function(){d=this;e=arguments;var b;f||(f=setTimeout(function(){f=null;h&&a.apply(d,e);i()},c));g?h=true:
a.apply(d,e);i();g=true}};b.debounce=function(a,b){var d;return function(){var e=this,f=arguments;clearTimeout(d);d=setTimeout(function(){d=null;a.apply(e,f)},b)}};b.once=function(a){var b=false,d;return function(){if(b)return d;b=true;return d=a.apply(this,arguments)}};b.wrap=function(a,b){return function(){var d=G.apply([a],arguments);return b.apply(this,d)}};b.compose=function(){var a=arguments;return function(){for(var b=arguments,d=a.length-1;d>=0;d--)b=[a[d].apply(this,b)];return b[0]}};b.after=
function(a,b){return a<=0?b():function(){if(--a<1)return b.apply(this,arguments)}};b.keys=I||function(a){if(a!==Object(a))throw new TypeError("Invalid object");var b=[],d;for(d in a)m.call(a,d)&&(b[b.length]=d);return b};b.values=function(a){return b.map(a,b.identity)};b.functions=b.methods=function(a){var c=[],d;for(d in a)b.isFunction(a[d])&&c.push(d);return c.sort()};b.extend=function(a){j(i.call(arguments,1),function(b){for(var d in b)b[d]!==void 0&&(a[d]=b[d])});return a};b.defaults=function(a){j(i.call(arguments,
1),function(b){for(var d in b)a[d]==null&&(a[d]=b[d])});return a};b.clone=function(a){return!b.isObject(a)?a:b.isArray(a)?a.slice():b.extend({},a)};b.tap=function(a,b){b(a);return a};b.isEqual=function(a,b){return r(a,b,[])};b.isEmpty=function(a){if(b.isArray(a)||b.isString(a))return a.length===0;for(var c in a)if(m.call(a,c))return false;return true};b.isElement=function(a){return!!(a&&a.nodeType==1)};b.isArray=p||function(a){return l.call(a)=="[object Array]"};b.isObject=function(a){return a===
Object(a)};b.isArguments=function(a){return l.call(a)=="[object Arguments]"};if(!b.isArguments(arguments))b.isArguments=function(a){return!(!a||!m.call(a,"callee"))};b.isFunction=function(a){return l.call(a)=="[object Function]"};b.isString=function(a){return l.call(a)=="[object String]"};b.isNumber=function(a){return l.call(a)=="[object Number]"};b.isNaN=function(a){return a!==a};b.isBoolean=function(a){return a===true||a===false||l.call(a)=="[object Boolean]"};b.isDate=function(a){return l.call(a)==
"[object Date]"};b.isRegExp=function(a){return l.call(a)=="[object RegExp]"};b.isNull=function(a){return a===null};b.isUndefined=function(a){return a===void 0};b.noConflict=function(){s._=F;return this};b.identity=function(a){return a};b.times=function(a,b,d){for(var e=0;e<a;e++)b.call(d,e)};b.escape=function(a){return(""+a).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#x27;").replace(/\//g,"&#x2F;")};b.mixin=function(a){j(b.functions(a),function(c){J(c,
b[c]=a[c])})};var K=0;b.uniqueId=function(a){var b=K++;return a?a+b:b};b.templateSettings={evaluate:/<%([\s\S]+?)%>/g,interpolate:/<%=([\s\S]+?)%>/g,escape:/<%-([\s\S]+?)%>/g};b.template=function(a,c){var d=b.templateSettings,d="var __p=[],print=function(){__p.push.apply(__p,arguments);};with(obj||{}){__p.push('"+a.replace(/\\/g,"\\\\").replace(/'/g,"\\'").replace(d.escape,function(a,b){return"',_.escape("+b.replace(/\\'/g,"'")+"),'"}).replace(d.interpolate,function(a,b){return"',"+b.replace(/\\'/g,
"'")+",'"}).replace(d.evaluate||null,function(a,b){return"');"+b.replace(/\\'/g,"'").replace(/[\r\n\t]/g," ")+";__p.push('"}).replace(/\r/g,"\\r").replace(/\n/g,"\\n").replace(/\t/g,"\\t")+"');}return __p.join('');",e=new Function("obj","_",d);return c?e(c,b):function(a){return e.call(this,a,b)}};var n=function(a){this._wrapped=a};b.prototype=n.prototype;var u=function(a,c){return c?b(a).chain():a},J=function(a,c){n.prototype[a]=function(){var a=i.call(arguments);H.call(a,this._wrapped);return u(c.apply(b,
a),this._chain)}};b.mixin(b);j("pop,push,reverse,shift,sort,splice,unshift".split(","),function(a){var b=k[a];n.prototype[a]=function(){b.apply(this._wrapped,arguments);return u(this._wrapped,this._chain)}});j(["concat","join","slice"],function(a){var b=k[a];n.prototype[a]=function(){return u(b.apply(this._wrapped,arguments),this._chain)}});n.prototype.chain=function(){this._chain=true;return this};n.prototype.value=function(){return this._wrapped}}).call(this);
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

	L7.rand = function(minOrMax, maxOrUndefined) {
		var min = _.isNumber(maxOrUndefined) ? minOrMax : 0;
		var max = _.isNumber(maxOrUndefined) ? maxOrUndefined : minOrMax;

		var range = max - min;

		var result = Math.random() * range + min;
		if(_isInteger(min) && _isInteger(max)) {
			return Math.floor(result);
		} else {
			return result;
		}
	};
})();

