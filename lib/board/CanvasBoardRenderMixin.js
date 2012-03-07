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

