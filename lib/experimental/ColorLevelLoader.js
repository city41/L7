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


