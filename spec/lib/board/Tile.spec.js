describe("Tile", function() {
	describe("construction", function() {
		it("should require x and y", function() {
			var noX = function() {
				new L7.Tile({
					y: 5
				});
			};

			var noY = function() {
				new L7.Tile({
					x: 8
				});
			};

			var neither = function() {
				new L7.Tile();
			};

			expect(noX).toThrow();
			expect(noY).toThrow();
			expect(neither).toThrow();
		});

		it("should set x and y", function() {
			var x = 4;
			var y = 6;
			var tile = new L7.Tile({
				x: x,
				y: y
			});

			expect(tile.x).toEqual(x);
			expect(tile.y).toEqual(y);
			expect(tile.position.equals({
				x: x,
				y: y
			})).toBe(true);
		});

		it("should have no inhabitants", function() {
			var tile = new L7.Tile({
				x: 3,
				y: 4
			});

			expect(tile.count).toBe(0);
			expect(tile.at(1)).toBeUndefined();
		});

		it("should set the initial inhabitants", function() {
			var inhabitants = [1, 2, 3];
			var tile = new L7.Tile({
				x: 0,
				y: 0,
				inhabitants: inhabitants
			});

			expect(tile.count).toEqual(inhabitants.length);

			for (var i = 0; i < inhabitants.length; ++i) {
				expect(tile.at(i)).toEqual(inhabitants[i]);
			}
		});
	});

	describe("inhabitants", function() {
		it("should allow iterating over its inhabitants", function() {
			var inhabitants = [1, 2, 3];
			var tile = new L7.Tile({
				x: 0,
				y: 0,
				inhabitants: inhabitants
			});

			var i = 0;
			tile.each(function(inhabitant) {
				expect(inhabitant).toEqual(inhabitants[i]);
				i += 1;
			});
		});

		it("should add an inhabitant", function() {
			var tile = new L7.Tile({
				x: 0,
				y: 0
			});

			var i = 'foo';
			tile.add(i);

			expect(tile.count).toBe(1);
			expect(tile.at(0)).toEqual(i);
		});

		it("should remove an inhabitant", function() {
			var inhabitants = [4, 5, 6];
			var tile = new L7.Tile({
				x: 0,
				y: 0,
				inhabitants: inhabitants
			});

			tile.remove(5);
			expect(tile.count).toEqual(inhabitants.length - 1);
		});

		it("should quietly ignore removing inhabitants it doesnt have", function() {
			var inhabitants = [4, 5, 6];
			var tile = new L7.Tile({
				x: 0,
				y: 0,
				inhabitants: inhabitants
			});

			tile.remove(88);
			expect(tile.count).toEqual(inhabitants.length);
		});

		it("should report it has a team member", function() {
			var team = 'foo';
			var inhabitant = {
				owner: {
					team: team
				}
			};

			var tile = new L7.Tile({
				x: 0,
				y: 0,
				inhabitants: [inhabitant]
			});

			expect(tile.has(team)).toBe(true);
			expect(tile.has('someOtherTeam')).toBe(false);
		});

		it("should not report it has a team member for hasOther", function() {
			var team = 'foo';
			var inhabitant = {
				owner: {
					team: team
				}
			};

			var tile = new L7.Tile({
				x: 0,
				y: 0,
				inhabitants: [inhabitant]
			});

			expect(tile.hasOther(team, inhabitant.owner)).toBe(false);
		});
	});

	describe("traversal", function() {
		it("should return nothing if it has no board", function() {
			var tile = new L7.Tile({
				x: 0,
				y: 0
			});

			expect(tile.up()).toBeUndefined();
			expect(tile.down()).toBeUndefined();
			expect(tile.left()).toBeUndefined();
			expect(tile.right()).toBeUndefined();
		});

		it("should return the tile above it", function() {
			var passedPosition;
			var expectedResult = 'result';
			var board = {
				tileAt: function(position) {
					passedPosition = position;
					return expectedResult;
				}
			};

			var tile = new L7.Tile({
				x: 1,
				y: 2
			});
			tile.board = board;

			var result = tile.up();

			expect(result).toEqual(expectedResult);
			expect(passedPosition.equals({
				x: 1,
				y: 1
			})).toBe(true);
		});

		it("should return the tile to the left of it", function() {
			var passedPosition;
			var expectedResult = 'result';
			var board = {
				tileAt: function(position) {
					passedPosition = position;
					return expectedResult;
				}
			};

			var tile = new L7.Tile({
				x: 1,
				y: 2
			});
			tile.board = board;

			var result = tile.left();
			
			expect(result).toEqual(expectedResult);
			expect(passedPosition.equals({
				x: 0,
				y: 2
			})).toBe(true);
		});

		it("should return the tile to the right of it", function() {
			var passedPosition;
			var expectedResult = 'result';
			var board = {
				tileAt: function(position) {
					passedPosition = position;
					return expectedResult;
				}
			};

			var tile = new L7.Tile({
				x: 1,
				y: 2
			});
			tile.board = board;

			var result = tile.right();
			
			expect(result).toEqual(expectedResult);
			expect(passedPosition.equals({
				x: 2,
				y: 2
			})).toBe(true);
		});

		it("should return the tile below it", function() {
			var passedPosition;
			var expectedResult = 'result';
			var board = {
				tileAt: function(position) {
					passedPosition = position;
					return expectedResult;
				}
			};

			var tile = new L7.Tile({
				x: 1,
				y: 2
			});
			tile.board = board;

			var result = tile.down();
			
			expect(result).toEqual(expectedResult);
			expect(passedPosition.equals({
				x: 1,
				y: 3
			})).toBe(true);
		});

	});

	describe('rendering parameters', function() {
		it('should return no scale if one is not set', function() {
			var tile = new L7.Tile({
				x: 1,
				y: 2
			});

			var scale = tile.getScale();

			expect(scale).not.toBeDefined();
		});

		it('should set its scale from the config', function() {
			var scale = 2.3;
			var tile = new L7.Tile({
				x: 1,
				y: 2,
				scale: 2.3
			});

			var returnedScale = tile.getScale();

			expect(returnedScale).toEqual(scale);
		});

		it('should set its scale arbitrarily', function() {
			var scale = 2.3;
			var tile = new L7.Tile({
				x: 1,
				y: 2
			});

			tile.scale = scale;

			var returnedScale = tile.getScale();

			expect(returnedScale).toEqual(scale);
		});

		it('should return the inhabitants scale', function() {
			var inhabitantScale = 45;
			var tile = new L7.Tile({
				x: 1,
				y: 2,
				scale: 3
			});

			tile.add({
				scale: inhabitantScale
			});

			var returnedScale = tile.getScale();
			expect(returnedScale).toEqual(inhabitantScale);
		});

		it('should return falsy if it has no color', function() {
			var tile = new L7.Tile({
				x: 1,
				y: 2
			});

			var color = tile.getColor();
			expect(color).toBeFalsy();
		});

		it('should return its color', function() {
			var tile = new L7.Tile({
				x: 1,
				y: 2,
				color: [255, 0, 0, 1]
			});

			var color = tile.getColor();
			expect(color).toBe('rgba(255,0,0,1)');
		});


		it('should return its inhabitants opaque color', function() {
			var tile = new L7.Tile({
				x: 1,
				y: 2,
				color: [255, 0, 0, 1]
			});

			tile.add({
				color: [255, 255, 0, 1]
			});

			var color = tile.getColor();

			expect(color).toBe('rgba(255,255,0,1)');
		});

		it('should return a composite if inhabitants color is not opaque', function() {
			var tileColor = [255, 0, 0, 1];
			var inhabColor = [255, 255, 0, .6];
			var expected = L7.Color.composite(tileColor.slice(0), inhabColor);

			var tile = new L7.Tile({
				x: 1,
				y: 1,
				color: tileColor
			});

			tile.add({
				color: inhabColor
			});

			var color = tile.getColor();

			expect(color).toEqual(L7.Color.toCssString(expected));
		});

		it('should return its own color if inhabitant has no color', function() {
			var tile = new L7.Tile({
				x: 1,
				y: 1,
				color: [255, 0, 0, 1]
			});

			tile.add({});

			var color = tile.getColor();

			expect(color).toEqual('rgba(255,0,0,1)');
		});

		it('should return a composite of its color and its overlay color', function() {

		});

		it('should return its overlay color if the overlay color is opaque', function() {
		});
		
		it('should return a composite of its color, its overlay color and its inhabitant color', function() {

		});
	});
});

