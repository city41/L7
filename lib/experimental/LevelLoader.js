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
				height: this.height,
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

