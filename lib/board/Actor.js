(function() {
	var _defaults = {
			position: L7.p(0, 0),
			shape: [[5]],
			color: 'orange',
			keyInputs: {}
	};

	L7.Actor = function(config) {
		_.extend(this, _defaults, config || {});

		this.pieces = this._createPieces();
	};

	L7.Actor.prototype = {
		update: function(delta) {

		},

		_getAnchorOffset: function() {
			var x, y;

			for (y = 0; y < this.shape.length; ++y) {
				for (x = 0; x < this.shape[y].length; ++x) {
					if (this.shape[y][x] === L7.Actor.ANCHOR) {
						return L7.p(x, y);
					}
				}
			}

			throw new Error("shape specified but lacks an anchor");
		},

		_getColor: function(x, y) {
			var color;
			if (_.isString(this.color)) {
				color = this.color;
			} else if (_.isArray(this.color)) {
				color = this.color[y][x];
			}
			return color;
		},

		_createPieces: function() {
			var pieces = [];

			var anchorOffset = this._getAnchorOffset();
			var anchorPosition = this.position;

			for (var y = 0; y < this.shape.length; ++y) {
				var srow = this.shape[y];
				for (var x = 0; x < srow.length; ++x) {
					if (this.shape[y][x]) {
						var anchorDelta = L7.p(x, y).delta(anchorOffset);
						var piecePosition = anchorPosition.add(anchorDelta); 
						var color = this._getColor(x, y);
						var piece = new L7.Piece({
							position: piecePosition,
							color: color,
							isAnchor: this.shape[y][x] === L7.Actor.ANCHOR,
							owner: this
						});
						if (piece.isAnchor) {
							this.anchorPiece = piece;
						}
						pieces.push(piece);
					}
				}
			}

			return pieces;
		},

		goTo: function(pos) {
			//if(this.onGoTo) {
				//if(!this.onGoTo(this._getPiecePositionsAnchoredAt(this.position), this._getPiecePositionsAnchoredAt(pos), this._board)) {
					//return;
				//}
			//}

			this._lastPosition = this.position.clone();

			this.position = pos;

			this._board.moveActor({
				actor: this,
				from: this._lastPosition,
				to: this.position
			});

			//if (this.whenOutOfBounds && this._board.isOutOfBounds(this)) {
				//this.whenOutOfBounds.call(this);
			//}
		},

	};

	Object.defineProperty(L7.Actor, 'ANCHOR', {
		get: function() {
			return 5
		},
		enumerable: false
	});

})();

