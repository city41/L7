(function() {
	function _composite(under, over) {
		var alphaO = over[3];
		var alphaU = under[3];
		var invAlphaO = 1 - alphaO;

		for(var i = 0; i < under.length - 1; ++i) {
			under[i] = Math.round((over[i] * alphaO) + ((under[i] * alphaU) * invAlphaO));
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

