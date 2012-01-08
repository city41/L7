describe("Color", function() {
	describe('detection', function() {
		it("should detect a hex string", function() {
			expect(L7.Color.isHexString('#FF0000')).toBe(true);
			expect(L7.Color.isHexString('#112233')).toBe(true);
			expect(L7.Color.isHexString('#A4F8C4')).toBe(true);
			expect(L7.Color.isHexString('#000000')).toBe(true);
			expect(L7.Color.isHexString('#ff8978')).toBe(true);
			expect(L7.Color.isHexString('#FFKKLL')).toBe(false);
			expect(L7.Color.isHexString('#FF0')).toBe(false);
			expect(L7.Color.isHexString('#FF002233')).toBe(false);
			expect(L7.Color.isHexString('red')).toBe(false);
			expect(L7.Color.isHexString(null)).toBe(false);
			expect(L7.Color.isHexString()).toBe(false);
			expect(L7.Color.isHexString(23)).toBe(false);
		});

		it('should detect a css rgb string', function() {
			expect(L7.Color.isRgbString('rgb(255, 122, 0)')).toBe(true);
			expect(L7.Color.isRgbString('rgba(255, 122, 0. 0.5)')).toBe(true);

			expect(L7.Color.isRgbString()).toBe(false);
			expect(L7.Color.isRgbString(null)).toBe(false);
			expect(L7.Color.isRgbString('red')).toBe(false);
			expect(L7.Color.isRgbString('#FF0099')).toBe(false);
			expect(L7.Color.isRgbString(24)).toBe(false);
		});

		it("should detect built in colors", function() {
			expect(L7.Color.isBuiltInString('red')).toBe(true);
			expect(L7.Color.isBuiltInString('silver')).toBe(true);
			expect(L7.Color.isBuiltInString('darkred')).toBe(true);

			expect(L7.Color.isBuiltInString('foo')).toBe(false);
			expect(L7.Color.isBuiltInString('')).toBe(false);
			expect(L7.Color.isBuiltInString(3)).toBe(false);
			expect(L7.Color.isBuiltInString()).toBe(false);
			expect(L7.Color.isBuiltInString(null)).toBe(false);
		});

		it("should detect opaqueness", function() {
			expect(L7.Color.isOpaque('#FF0000')).toBe(true);
			expect(L7.Color.isOpaque('red')).toBe(true);
			expect(L7.Color.isOpaque('rgb(124,55,33)')).toBe(true);

			expect(L7.Color.isOpaque()).toBe(undefined);
			expect(L7.Color.isOpaque(33)).toBe(undefined);
			expect(L7.Color.isOpaque('foo')).toBe(undefined);

			expect(L7.Color.isOpaque('rgba(200, 45, 11, .5)')).toBe(false);
		});

	});

	describe('conversion', function() {
		it('should return an array if it is already one', function() {
			var array = [200, 100, 34, 123];

			var asArray = L7.Color.toArray(array);
			expect(asArray).toEqual(array);
		});
		
		it("should convert a hex string to array", function() {
			var hex = '#FFDDCC';

			var asArray = L7.Color.toArray(hex);

			expect(asArray.length).toBe(4);
			expect(asArray[0]).toBe(255);
			expect(asArray[1]).toBe(parseInt('DD', 16));
			expect(asArray[2]).toBe(parseInt('CC', 16));
			expect(asArray[3]).toBe(255);
		});

		it('should convert a built in into array', function() {
			var color = 'red';

			var asArray = L7.Color.toArray(color);

			expect(asArray.length).toBe(4);
			expect(asArray[0]).toBe(255);
			expect(asArray[1]).toBe(0);
			expect(asArray[2]).toBe(0);
			expect(asArray[3]).toBe(255);
		});

		it('should convert an rgb string into an array', function() {
			var r = 123, g = 45, b = 12;
			var color = 'rgb(' + r + ',' + g + ',' + b + ')';

			var asArray = L7.Color.toArray(color);

			expect(asArray.length).toBe(4);
			expect(asArray[0]).toBe(r);
			expect(asArray[1]).toBe(g);
			expect(asArray[2]).toBe(b);
			expect(asArray[3]).toBe(255);
		});

		it('should convert an rgba string into an array', function() {
			var r = 123, g = 45, b = 55, a = .75;
			var color = 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';

			var asArray = L7.Color.toArray(color);
			
			expect(asArray.length).toBe(4);
			expect(asArray[0]).toBe(r);
			expect(asArray[1]).toBe(g);
			expect(asArray[2]).toBe(b);
			expect(asArray[3]).toBe(Math.round(255 * a));
		});
	});

	describe('compositing', function() {
		it('should composite two colors', function() {
			var c1 = 'rgba(255, 0, 0, 1)';
			var c2 = 'rgba(0, 0, 255, .5)';
			var expected = [127, 0, 128, 255];

			var composited = L7.Color.composite([c1, c2]);

			expect(expected[0]).toEqual(composited[0]);
			expect(expected[1]).toEqual(composited[1]);
			expect(expected[2]).toEqual(composited[2]);
			expect(expected[3]).toEqual(composited[3]);
		});
	});

});

