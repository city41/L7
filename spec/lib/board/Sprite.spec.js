describe("Sprite", function() {
	describe("construction", function() {
		it("should accept a color", function() {
			var color = 'red';
			var sprite = new L7.Sprite(color);

			expect(sprite.color).toEqual(color);
		});
		it("should be mutable in color", function() {
			var sprite = new L7.Sprite('red');
			expect(sprite.color).toBe('red');
			sprite.color = 'orange';
			expect(sprite.color).toBe('orange');
		});
	});

	describe("render", function() {
		it("should draw a rect with its color", function() {
			var color = 'red';
			var sprite = new L7.Sprite(color);
			L7.TileSize = 4;

			var canvas = document.createElement('canvas');
			canvas.width = L7.TileSize;
			canvas.height = L7.TileSize;

			var context = canvas.getContext('2d');

			sprite.render(context);

			var imageData = context.getImageData(0, 0, canvas.width, canvas.height);

			for(var i = 0; i < canvas.width * canvas.height; ++i) {
				var pixelData = getPixelData(imageData.data, i);
				expect(eq(pixelData, [255, 0, 0, 255])).toBe(true);
			}
		});

		it("should render the overlay if present", function() {
			var color = 'red';
			var sprite = new L7.Sprite(color);
			sprite.overlay = 'blue';
			L7.TileSize = 4;

			var canvas = document.createElement('canvas');
			canvas.width = L7.TileSize;
			canvas.height = L7.TileSize;

			var context = canvas.getContext('2d');

			sprite.render(context);

			var imageData = context.getImageData(0, 0, canvas.width, canvas.height);

			for(var i = 0; i < canvas.width * canvas.height; ++i) {
				var pixelData = getPixelData(imageData.data, i);
				expect(eq(pixelData, [0, 0, 255, 255])).toBe(true);
			}
		});
	});
});
