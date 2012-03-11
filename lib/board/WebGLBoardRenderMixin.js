(function() {
	var _blankColor = [0, 0, 0, 0];
	var _defaultOffsets = { x: 0, y: 0 };

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

			gl.bindBuffer(gl.ARRAY_BUFFER, this.squareVertexPositionBuffer);

			this.verticesPerTile = this.borderWidth > 0 ? 30: 6;
			var vertices = new Float32Array(this.width * this.height * this.verticesPerTile * this.squareVertexPositionBuffer.itemSize);
			var i = 0;
			var centerVertices = new Float32Array(this.width * this.height * 2 * this.verticesPerTile);
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
			for (var y = 0; y < this.height; ++y) {
				for (var x = 0; x < this.width; ++x) {
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

			this.centerVertexPositionBuffer = gl.createBuffer();
			this.centerVertexPositionBuffer.itemSize = 2;
			gl.bindBuffer(gl.ARRAY_BUFFER, this.centerVertexPositionBuffer);
			gl.bufferData(gl.ARRAY_BUFFER, centerVertices, gl.STATIC_DRAW);

			this.colorOffsetsBuffer = gl.createBuffer();
			this.colorOffsetsBuffer.itemSize = 6;
			var colorOffsetsData = new Float32Array(this.squareVertexPositionBuffer.numItems * this.colorOffsetsBuffer.itemSize);
			gl.bindBuffer(gl.ARRAY_BUFFER, this.colorOffsetsBuffer);
			gl.bufferData(gl.ARRAY_BUFFER, colorOffsetsData, gl.DYNAMIC_DRAW);
		},

		_getTileShaderOffsetX: function(index, offsets, scale) {
			scale -= 1;
			scale /= 2;
			var negator = 1;
			if(index === 0 || index === 3 || index === 5) {
				negator = -1;
			}
			scale *= negator;

			return negator * 2 * (offsets.x + scale) + 1;
		},

		_getTileShaderOffsetY: function(index, offsets, scale) {
			scale -= 1;
			scale /= 2;
			var negator = 1;
			if(index === 0 || index === 3 || index === 1) {
				negator = -1;
			}
			scale *= negator;

			return negator * 2 * (offsets.y + scale) + 1;
		},

		_getBorderShaderOffsetX: function(index, offsets, scale) {
			scale -= 1;
			scale /= 2;
			// inner right
			if(index === 6 || index === 9 || index === 11) {
				return 2 * (offsets.x + scale) + 1;
			}

			// inner left
			if(index === 18 || index == 21 || index === 23) {
				return -2 * (offsets.x - scale) + 1;
			}

			return 1;
		},

		_getBorderShaderOffsetY: function(index, offsets, scale) {
			scale -= 1;
			scale /= 2;
			// inner top
			if(index === 5 || index === 2 || index === 4) {
				return -2 * (offsets.y - scale) + 1;
			}

			// inner bottom
			if(index === 12 || index === 15 || index === 13) {
				return 2 * (offsets.y + scale) + 1;
			}

			return 1;
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
			scale,
			offsets,
			row,
			standardBorderColor = this.borderFill ? L7.Color.toArray(this.borderFill) : _blankColor,
			cdi;

			var span = xl - Math.max(seedx, 0);
			this.colorOffsetsData = this.colorOffsetsData || new Float32Array(span * this.verticesPerTile * this.colorOffsetsBuffer.itemSize);

			gl.bindBuffer(gl.ARRAY_BUFFER, this.colorOffsetsBuffer);

			for (y = seedy; y < yl; ++y) {
				if (y >= 0) {
					row = this._rows[y];
					cdi = 0;
					for (x = seedx; x < xl; ++x) {
						if (x >= 0) {
							tile = row[x];
							color = tile.getColor() || _blankColor;
							offsets = tile.getOffset() || _defaultOffsets;
							scale = tile.getScale();

							if (this.borderWidth > 0) {
								// border colors, there are 24 border vertices preceding a tile
								var borderColor;
								if(offsets.x || offsets.y) {
									borderColor = tile.color || _blankColor;
								} else {
									borderColor = color[3] ? standardBorderColor: _blankColor;
								}

								for (var b = 0; b < 24; ++b) {
									this.colorOffsetsData[cdi++] = borderColor[0] / 255;
									this.colorOffsetsData[cdi++] = borderColor[1] / 255;
									this.colorOffsetsData[cdi++] = borderColor[2] / 255;
									this.colorOffsetsData[cdi++] = borderColor[3];
									// offsets
									this.colorOffsetsData[cdi++] = this._getBorderShaderOffsetX(b, offsets, scale);
									this.colorOffsetsData[cdi++] = this._getBorderShaderOffsetY(b, offsets, scale);
								}
							}

							// each tile is made up of six vertices
							for (var t = 0; t < 6; ++t) {
								this.colorOffsetsData[cdi++] = color[0] / 255;
								this.colorOffsetsData[cdi++] = color[1] / 255;
								this.colorOffsetsData[cdi++] = color[2] / 255;
								this.colorOffsetsData[cdi++] = color[3];
								// offsets
								this.colorOffsetsData[cdi++] = this._getTileShaderOffsetX(t, offsets, scale);
								this.colorOffsetsData[cdi++] = this._getTileShaderOffsetY(t, offsets, scale);
							}
						}
					}
					// bufferSubData here
					var tileOffset = (y * this.width) + Math.max(0, seedx);
					var vertexOffset = tileOffset * this.verticesPerTile;
					var colorOffsetsOffset = vertexOffset * this.colorOffsetsBuffer.itemSize;
					var bytesPerFloat = 4;
					var byteOffset = colorOffsetsOffset * bytesPerFloat;
					gl.bufferSubData(gl.ARRAY_BUFFER, byteOffset, this.colorOffsetsData);
				}
			}
			//gl.vertexAttribPointer(gl.vertexColorAttribute, 4, gl.FLOAT, false, 6, 0);
			//gl.vertexAttribPointer(gl.offsetsAttribute, 2, gl.FLOAT, false, 6, 4);
			gl.vertexAttribPointer(gl.vertexColorAttribute, 4, gl.FLOAT, false, this.colorOffsetsBuffer.itemSize * 4, 0);
			gl.vertexAttribPointer(gl.offsetsAttribute, 2, gl.FLOAT, false, this.colorOffsetsBuffer.itemSize * bytesPerFloat, 4 * 4);
		}
	};
})();

