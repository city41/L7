describe("Actor", function() {
	describe("construction", function() {
		
		it("should apply everything to itself", function() {
			var foo = '123';
			var bar = function() {};
			var baz = {
				a: 1
			};

			var a = new L7.Actor({
				foo: foo,
				bar: bar,
				baz: baz
			});

			expect(a.foo).toEqual(foo);
			expect(a.bar).toEqual(bar);
			expect(a.baz).toEqual(baz);
		});

		it("should have reasonable defaults", function() {
			var a = new L7.Actor();

			expect(a.position.x).toEqual(0);
			expect(a.position.y).toEqual(0);
			expect(a.shape[0][0]).toEqual(L7.Actor.ANCHOR);
		});

		it("should create pieces based on the provided shape", function() {
			var color = [255, 0, 0, 1];
			var scale = 2.5;
			var a = new L7.Actor({
				shape: [
					[1, 1],
					[1, 5]
				],
				position: L7.p(2, 2),
				color: color,
				scale: scale
			});

			expect(a.pieces.length).toEqual(4);

			expect(a.pieces[0].anchorDelta.x).toEqual(-1);
			expect(a.pieces[0].anchorDelta.y).toEqual(-1);

			expect(a.pieces[1].anchorDelta.x).toEqual(0);
			expect(a.pieces[1].anchorDelta.y).toEqual(-1);

			expect(a.pieces[2].anchorDelta.x).toEqual(-1);
			expect(a.pieces[2].anchorDelta.y).toEqual(0);

			expect(a.pieces[3].anchorDelta.x).toEqual(0);
			expect(a.pieces[3].anchorDelta.y).toEqual(0);
			expect(a.pieces[3].isAnchor).toBeUndefined();

			a.pieces.forEach(function(piece) {
				expect(piece.color).toEqual(color);
				expect(piece.scale).toEqual(scale);
			});
		});
	});

	describe("movement", function() {
		it("should goTo the specified place", function() {
			var initialPosition = L7.p(1,1);

			var a = new L7.Actor({
				position: initialPosition
			});

			var board = new L7.Board({
				width: 4,
				height: 4
			});

			a.board = board;

			var newPosition = L7.p(3,3);
			a.goTo(newPosition);

			expect(a.position.equals(newPosition)).toBe(true);
			expect(a._lastPosition.equals(initialPosition)).toBe(true);
		});

		it("should invoke onGoTo and proceed if true is returned", function() {
			var passedCurPiecePos, passedProposedPiecePos;
			var initialPosition = L7.p(1,1);

			var a = new L7.Actor({
				position: initialPosition,
				onGoTo: function(curPiecePos, proposedPiecePos) {
					passedCurPiecePos = curPiecePos;
					passedProposedPiecePos = proposedPiecePos;
					return true;
				}
			});

			var board = new L7.Board({
				width: 5,
				height: 5
			});
			board.addActor(a);

			var newPosition = L7.p(3,3);
			a.goTo(newPosition);

			expect(passedCurPiecePos[0].x).toEqual(initialPosition.x);
			expect(passedCurPiecePos[0].y).toEqual(initialPosition.y);

			expect(passedProposedPiecePos[0].x).toEqual(newPosition.x);
			expect(passedProposedPiecePos[0].y).toEqual(newPosition.y);

			expect(a.position.equals(newPosition)).toBe(true);
		});

		it("should not move if onGoTo returns false", function() {
			var initialPosition = L7.p(1,1);

			var a = new L7.Actor({
				position: initialPosition,
				onGoTo: function() {
					return false;
				}
			});

			var newPosition = L7.p(3,3);
			a.goTo(newPosition);

			expect(a.position).toEqual(initialPosition);
		});

		it("should go left", function() {
			var initialPosition = L7.p(12,2);
			var a = new L7.Actor({
				position: initialPosition
			});

			var board = new L7.Board({
				width: 30,
				height: 40
			});
			board.addActor(a);

			a.left(3);

			expect(a.position.x).toEqual(initialPosition.x - 3);
			expect(a.position.y).toEqual(initialPosition.y);
		});
	
		it("should go right", function() {
			var initialPosition = L7.p(12,2);
			var a = new L7.Actor({
				position: initialPosition
			});

			var board = new L7.Board({
				width: 30,
				height: 40
			});
			board.addActor(a);


			a.right(3);

			expect(a.position.x).toEqual(initialPosition.x + 3);
			expect(a.position.y).toEqual(initialPosition.y);
		});

		it("should go up", function() {
			var initialPosition = L7.p(12,20);
			var a = new L7.Actor({
				position: initialPosition
			});

			var board = new L7.Board({
				width: 30,
				height: 40
			});
			board.addActor(a);

			a.up(3);

			expect(a.position.x).toEqual(initialPosition.x);
			expect(a.position.y).toEqual(initialPosition.y - 3);
		});

		it("should go down", function() {
			var initialPosition = L7.p(12,2);
			var a = new L7.Actor({
				position: initialPosition
			});

			var board = new L7.Board({
				width: 30,
				height: 40
			});
			board.addActor(a);

			a.down(3);

			expect(a.position.x).toEqual(initialPosition.x);
			expect(a.position.y).toEqual(initialPosition.y + 3);
		});

		it("should go back", function() {
			var initialPosition = L7.p(12,2);
			var a = new L7.Actor({
				position: initialPosition
			});

			var board = new L7.Board({
				width: 30,
				height: 40
			});
			board.addActor(a);

			a.down(3);

			expect(a.position.x).toEqual(initialPosition.x);
			expect(a.position.y).toEqual(initialPosition.y + 3);

			a.goBack();

			expect(a.position.y).toEqual(initialPosition.y);
		});

	});

	describe('timers', function() {
		it('should not invoke a timer if it is not enabled', function() {
			var actor = new L7.Actor({
				timers: {
					mytimer: {
						enabled: false,
						interval: 50,
						handler: function() {
						}
					}
				}
			});

			spyOn(actor.timers.mytimer, 'handler');

			actor.update(100);

			expect(actor.timers.mytimer.handler).not.toHaveBeenCalled();

			actor.timers.mytimer.enabled = function() { return false; }

			actor.update(100);

			expect(actor.timers.mytimer.handler).not.toHaveBeenCalled();
		});

		it('should invoke a timers handler if it has no enabled property', function() {
			var actor = new L7.Actor({
				timers: {
					mytimer: {
						interval: 50,
						handler: function() {
						}
					}
				}
			});

			spyOn(actor.timers.mytimer, 'handler');

			actor.update(100);

			expect(actor.timers.mytimer.handler).toHaveBeenCalled();
		});

		it('should invoke a timer if its enabled is (or returns) true', function() {
			var actor = new L7.Actor({
				timers: {
					mytimer: {
						enabled: true,
						interval: 50,
						handler: function() {
						}
					}
				}
			});

			spyOn(actor.timers.mytimer, 'handler');

			actor.update(100);

			expect(actor.timers.mytimer.handler).toHaveBeenCalled();

			actor.timers.mytimer.enabled = function() { return true; }

			actor.update(100);

			expect(actor.timers.mytimer.handler).toHaveBeenCalled();

		});
	});
	describe('queries', function() {
		it('should give the pieceAt', function() {
			var actor = new L7.Actor({
				shape: [[1,5,1]],
				position: L7.p(2,2)
			});

			var noPiece = actor.pieceAt(10, 20);

			expect(noPiece).toBeFalsy();

			var piece0 = actor.pieceAt(1,2);
			expect(piece0.position.x).toBe(1);
			expect(piece0.position.y).toBe(2);

			var piece1 = actor.pieceAt(2,2);
			expect(piece1.position.x).toBe(2);
			expect(piece1.position.y).toBe(2);
			expect(piece1.isAnchor).toBeUndefined();

			var piece2 = actor.pieceAt(3,2);
			expect(piece2.position.x).toBe(3);
			expect(piece2.position.y).toBe(2);
		});
	});
});
