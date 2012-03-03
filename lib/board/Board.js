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

		squareVertexPositionBuffer: undefined,

		initBuffer: function(gl) {
			this.squareVertexPositionBuffer = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, this.squareVertexPositionBuffer);
			var vertices = [
			35, 5, 0, 5, 5, 0, 35, 35, 0, 5, 35, 0];
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
			this.squareVertexPositionBuffer.itemSize = 3;
			this.squareVertexPositionBuffer.numItems = 4;

			this.squareVertexColorBuffer = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, this.squareVertexColorBuffer);
			
			var colors = [
				1, 0, 0, 1,
				0, 1, 0, 1,
				0, 0, 1, 1,
				0, 0, 0, 1
			];

			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
			this.squareVertexColorBuffer.itemSize = 4;
			this.squareVertexColorBuffer.numItems = 4;
		},

		_initGl: function(gl) {
			gl.clearColor(0.0, 0.0, 0.0, 1.0);
			this.pMatrix = mat4.create();
			this.mvMatrix = mat4.create();

			this.initBuffer(gl);
			this.initShaders(gl);
		},

		getShader: function(gl, id) {
			var shaderScript = document.getElementById(id);
			if (!shaderScript) {
				return null;
			}

			var str = "";
			var k = shaderScript.firstChild;
			while (k) {
				if (k.nodeType == 3) {
					str += k.textContent;
				}
				k = k.nextSibling;
			}

			var shader;
			if (shaderScript.type == "x-shader/x-fragment") {
				shader = gl.createShader(gl.FRAGMENT_SHADER);
			} else if (shaderScript.type == "x-shader/x-vertex") {
				shader = gl.createShader(gl.VERTEX_SHADER);
			} else {
				return null;
			}

			gl.shaderSource(shader, str);
			gl.compileShader(shader);

			if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
				alert(gl.getShaderInfoLog(shader));
				return null;
			}

			return shader;
		},

		initShaders: function(gl) {
			var fragmentShader = this.getShader(gl, "shader-fs");
			var vertexShader = this.getShader(gl, "shader-vs");

			this.shaderProgram = gl.createProgram();
			gl.attachShader(this.shaderProgram, vertexShader);
			gl.attachShader(this.shaderProgram, fragmentShader);
			gl.linkProgram(this.shaderProgram);

			if (!gl.getProgramParameter(this.shaderProgram, gl.LINK_STATUS)) {
				alert("Could not initialise shaders");
			}

			gl.useProgram(this.shaderProgram);

			this.shaderProgram.vertexPositionAttribute = gl.getAttribLocation(this.shaderProgram, "aVertexPosition");
			gl.enableVertexAttribArray(this.shaderProgram.vertexPositionAttribute);

			//this.shaderProgram.vertexColorAttribute = gl.getAttribLocation(this.shaderProgram, "aVertexColor");
			//gl.enableVertexAttribArray(this.shaderProgram.vertexColorAttribute);
			this.shaderProgram.colorUniform = gl.getUniformLocation(this.shaderProgram, "uColor");

			this.shaderProgram.pMatrixUniform = gl.getUniformLocation(this.shaderProgram, "uPMatrix");
			this.shaderProgram.mvMatrixUniform = gl.getUniformLocation(this.shaderProgram, "uMVMatrix");
		},

		rendergl: function(delta, gl, anchorXpx, anchorYpx, width, height, timestamp) {
			if (!this.squareVertexPositionBuffer) {
				this._initGl(gl);
			}

			gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
			gl.clear(gl.COLOR_BUFFER_BIT);
			//mat4.ortho(anchorXpx, anchorXpx + width, anchorYpx + height, anchorYpx, 0.1, 100, this.pMatrix);
			mat4.ortho(0, gl.viewportWidth, gl.viewportHeight, 0, - 100, 100, this.pMatrix);
			//mat4.perspective(45, gl.viewportWidth / gl.viewportHeight, 0.1, 100, this.pMatrix);
			mat4.identity(this.mvMatrix);
			mat4.translate(this.mvMatrix, [10, 10, 0]);

			gl.bindBuffer(gl.ARRAY_BUFFER, this.squareVertexPositionBuffer);
			gl.vertexAttribPointer(this.shaderProgram.vertexPositionAttribute, this.squareVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

			//gl.bindBuffer(gl.ARRAY_BUFFER, this.squareVertexColorBuffer);
			//gl.vertexAttribPointer(this.shaderProgram.vertexColorAttribute, this.squareVertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);

			gl.uniformMatrix4fv(this.shaderProgram.pMatrixUniform, false, this.pMatrix);
			gl.uniformMatrix4fv(this.shaderProgram.mvMatrixUniform, false, this.mvMatrix);
			gl.uniform4fv(this.shaderProgram.colorUniform, [0, 0, 1, 0.4]);

			gl.drawArrays(gl.TRIANGLE_STRIP, 0, this.squareVertexPositionBuffer.numItems);
		},

		render: function(delta, context, anchorXpx, anchorYpx, timestamp) {
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

