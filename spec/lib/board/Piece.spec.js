describe("Piece", function() {
	describe("construction", function() {
		it("should apply everything in its config", function() {
			var config = {
				a: 'a',
				b: 1, 
				c: function() {}
			};

			var piece = new L7.Piece(config);

			expect(piece.a).toEqual(config.a);
			expect(piece.b).toEqual(config.b);
			expect(piece.c).toEqual(config.c);
		});
	});

	describe("rendering", function() {
		it("should render with the sprite if present", function() {
			var sprite = {
				render: function() {}
			};

			spyOn(sprite, "render");

			var piece = new L7.Piece({
				sprite: sprite
			});

			piece.render();

			expect(sprite.render).toHaveBeenCalled();
		});

		it("should pass the arguments to render onto sprite", function() {
			var passedArgs;
			var sprite = {
				render: function() {
					passedArgs = _.toArray(arguments);
				}
			};

			var piece = new L7.Piece({
				sprite: sprite
			});

			var args = [1, 2, 3];
			piece.render.apply(piece, args);

			expect(_.isEqual(args, passedArgs)).toBe(true);
		});

		it("should set the overlay on the sprite", function() {
				var sprite = {
					render: function() {}
				};

				var overlay = 'dummyOverlay';

				var piece = new L7.Piece({
					sprite: sprite
				});
				piece.overlay = overlay;

				piece.render();
				expect(sprite.overlay).toEqual(overlay);
		});
	});

});
