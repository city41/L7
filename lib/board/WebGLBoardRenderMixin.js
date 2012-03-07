(function() {
	var _blankColor = [0, 0, 0, 0];
	L7.WebGLBoardRenderMixin = {
		render: function(delta, gl, anchorXpx, anchorYpx, timestamp) {
			if (!this.squareVertexPositionBuffer) {
				this._glInit(gl);
			}

			anchorXpx += this.offsetX || 0;
			anchorYpx += this.offsetY || 0;

			mat4.identity(this.mvMatrix);
			mat4.translate(this.mvMatrix, [-anchorXpx, - anchorYpx, 0]);
			gl.uniformMatrix4fv(gl.mvMatrixUniform, false, this.mvMatrix);

			gl.bindBuffer(gl.ARRAY_BUFFER, this.squareVertexPositionBuffer);
			gl.vertexAttribPointer(gl.vertexPositionAttribute, this.squareVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

			this._glSetTiles(gl, anchorXpx, anchorYpx);
			gl.drawArrays(gl.TRIANGLES, 0, this.squareVertexPositionBuffer.numItems);
		},

		_glInit: function(gl) {
			this.mvMatrix = mat4.create();
			this._glInitBuffer(gl);
		},

		_glInitBuffer: function(gl) {
			this.squareVertexPositionBuffer = gl.createBuffer();
			this.squareVertexPositionBuffer.itemSize = 2;

			gl.bindBuffer(gl.ARRAY_BUFFER, this.squareVertexPositionBuffer);

			this.verticesPerTile = this.borderWidth > 0 ? 30: 6;
			var vertices = new Float32Array(this.width * this.height * this.verticesPerTile * this.squareVertexPositionBuffer.itemSize);
			var i = 0;

			function pushTileVertices(x, y, size) {
				vertices[i++] = x;
				vertices[i++] = y;

				vertices[i++] = x + size;
				vertices[i++] = y;

				vertices[i++] = x + size;
				vertices[i++] = y + size;

				vertices[i++] = x;
				vertices[i++] = y;

				vertices[i++] = x + size;
				vertices[i++] = y + size;

				vertices[i++] = x;
				vertices[i++] = y + size;
			}

			function pushBorderVertices(x, y, ts, bw) {
				var fullSide = ts + 2 * bw;
				// top border
				vertices[i++] = x;
				vertices[i++] = y;
				vertices[i++] = x + fullSide;
				vertices[i++] = y;
				vertices[i++] = x + fullSide;
				vertices[i++] = y + bw;

				vertices[i++] = x;
				vertices[i++] = y;
				vertices[i++] = x + fullSide;
				vertices[i++] = y + bw;
				vertices[i++] = x;
				vertices[i++] = y + bw;

				// right border
				var rx = x + bw + ts;
				var ry = y + bw;
				vertices[i++] = rx;
				vertices[i++] = ry;
				vertices[i++] = rx + bw;
				vertices[i++] = ry;
				vertices[i++] = rx + bw;
				vertices[i++] = ry + ts;

				vertices[i++] = rx;
				vertices[i++] = ry;
				vertices[i++] = rx + bw;
				vertices[i++] = ry + ts;
				vertices[i++] = rx;
				vertices[i++] = ry + ts;

				// bottom border
				var bx = x;
				var by = y + bw + ts;
				vertices[i++] = bx;
				vertices[i++] = by;
				vertices[i++] = bx + fullSide;
				vertices[i++] = by;
				vertices[i++] = bx + fullSide;
				vertices[i++] = by + bw;

				vertices[i++] = bx;
				vertices[i++] = by;
				vertices[i++] = bx + fullSide;
				vertices[i++] = by + bw;
				vertices[i++] = bx;
				vertices[i++] = by + bw;

				// left border
				var lx = x;
				var ly = y + bw;
				vertices[i++] = lx;
				vertices[i++] = ly;
				vertices[i++] = lx + bw;
				vertices[i++] = ly;
				vertices[i++] = lx + bw;
				vertices[i++] = ly + ts;

				vertices[i++] = lx;
				vertices[i++] = ly;
				vertices[i++] = lx + bw;
				vertices[i++] = ly + ts;
				vertices[i++] = lx;
				vertices[i++] = ly + ts;
			}

			var ts = this.tileSize;
			var bw = this.borderWidth;
			for (var y = 0; y < this.height; ++y) {
				for (var x = 0; x < this.width; ++x) {
					var tx = x * (ts + bw) + bw;
					var ty = y * (ts + bw) + bw;
					pushTileVertices(tx, ty, ts);

					if (this.borderWidth > 0) {
						pushBorderVertices(tx - bw, ty - bw, ts, bw);
					}
				}
			}

			gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
			this.squareVertexPositionBuffer.numItems = vertices.length / this.squareVertexPositionBuffer.itemSize;

			this.colorBuffer = gl.createBuffer();
			this.colorBuffer.itemSize = 4;
			var colorData = new Float32Array(this.squareVertexPositionBuffer.numItems * 4);
			gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
			gl.bufferData(gl.ARRAY_BUFFER, colorData, gl.DYNAMIC_DRAW);
		},

		_glSetTiles: function(gl, anchorXpx, anchorYpx) {
			var bw = this.borderWidth,
			ts = this.tileSize,
			seedy = (anchorYpx / (ts + bw)) | 0,
			y,
			yl = Math.min(this.height, Math.ceil((anchorYpx + this.viewport.height) / (ts + bw))),
			seedx = (anchorXpx / (ts + bw)) | 0,
			x,
			xl = Math.min(this.width, Math.ceil((anchorXpx + this.viewport.width) / (ts + bw))),
			tile,
			color,
			row,
			standardBorderColor = this.borderFill ? L7.Color.toArray(this.borderFill) : _blankColor,
			cdi;

			var span = xl - Math.max(seedx, 0);
			this.colorData = this.colorData || new Float32Array(span * this.verticesPerTile * 4);

			gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);

			for (y = seedy; y < yl; ++y) {
				if (y >= 0) {
					row = this._rows[y];
					cdi = 0;
					for (x = seedx; x < xl; ++x) {
						if (x >= 0) {
							tile = row[x];
							color = tile.getColor() || _blankColor;

							// each tile is made up of six vertices
							for (var t = 0; t < 6; ++t) {
								this.colorData[cdi++] = color[0] / 255;
								this.colorData[cdi++] = color[1] / 255;
								this.colorData[cdi++] = color[2] / 255;
								this.colorData[cdi++] = color[3];
							}

							if (this.borderWidth > 0) {
								// now the border colors, there are 24 border vertices following a tile
								var borderColor = color[3] ? standardBorderColor: _blankColor;
								for (var b = 0; b < 24; ++b) {
									this.colorData[cdi++] = borderColor[0] / 255;
									this.colorData[cdi++] = borderColor[1] / 255;
									this.colorData[cdi++] = borderColor[2] / 255;
									this.colorData[cdi++] = borderColor[3];
								}
							}
						}
					}
					// bufferSubData here
					var tileOffset = (y * this.width) + Math.max(0, seedx);
					var vertexOffset = tileOffset * this.verticesPerTile;
					var colorOffset = vertexOffset * 4;
					var byteOffset = colorOffset * 4;
					gl.bufferSubData(gl.ARRAY_BUFFER, byteOffset, this.colorData);
				}
			}
			gl.vertexAttribPointer(gl.vertexColorAttribute, this.colorBuffer.itemSize, gl.FLOAT, false, 0, 0);
		}
	};
})();

