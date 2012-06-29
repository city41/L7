(function() {
	SAM.Hawaii = function(bgImage, fgImage, tileSize, spriteFactory) {
		var levelLoader = new L7.ColorLevelLoader(bgImage, tileSize, 0);
		var bgBoard = levelLoader.load();

		levelLoader = new L7.ColorLevelLoader(fgImage, tileSize, 0);
		var fgBoard = levelLoader.load();

		var matt = spriteFactory.mattWetsuit(L7.p(29, 7));
		var sarah = spriteFactory.sarahWetsuit(L7.p(38, 8));

		fgBoard.addActors(matt, sarah);

		var mantaLeftBoard = this._getMantaBoard({
			from: 'right',
			actors: [{ n: 'mantaGoingLeft', y: 30 }],
			duration: 8000,
			delay: 1800,
			offsetTo: fgBoard.pixelWidth
		}, spriteFactory, tileSize);

		var mantaRightBoard = this._getMantaBoard({
			from: 'left',
			actors: [{ n: 'mantaGoingRight', y: 40 }],
			duration: 7000,
			delay: 2000,
			offsetTo: -fgBoard.pixelWidth
		}, spriteFactory, tileSize);

		var fishLeftBoard1 = this._getMantaBoard({
			from: 'right',
			actors: [{ n: 'fishGoingLeft', y: 40 }],
			duration: 11000,
			delay: 3000,
			offsetTo: fgBoard.pixelWidth
		},spriteFactory, tileSize);

		var fishLeftBoard2 = this._getMantaBoard({
			from: 'right',
			actors: [{ n: 'fishGoingLeft', y: 48 }],
			duration: 9000,
			delay: 7000,
			offsetTo: fgBoard.pixelWidth
		},spriteFactory, tileSize);

		var fishRightBoard1 = this._getMantaBoard({
			from: 'left',
			actors: [{ n: 'fishGoingRight', y: 28 }],
			duration: 9000,
			delay: 3000,
			offsetTo: -fgBoard.pixelWidth
		},spriteFactory, tileSize);

		var parallax = new L7.ParallaxBoard({
			boards: [bgBoard, fgBoard, fishRightBoard1, mantaLeftBoard, fishLeftBoard1, mantaRightBoard, fishLeftBoard2],
			width: 60,
			height: 60
		});

		fgBoard.ani.together(Infinity, function(ani) {
			ani.frame({
				targets: [matt, sarah],
				pieceSetIndex: 1,
				rate: 150,
				looping: 'backforth',
				loops: Infinity
			});
			ani.repeat(Infinity, function(ani) {
				ani.sequence(function(ani) {
					ani.tween({
						targets: [fgBoard],
						property: 'offsetY',
						from: 0,
						to: 12,
						easing: 'easeInOutQuad',
						duration: 3000
					});
					ani.waitBetween(400, 1000);
					ani.tween({
						targets: [fgBoard],
						property: 'offsetY',
						from: 12,
						to: 0,
						easing: 'easeInOutQuad',
						duration: 2000
					});
				});
			});
		});

		return parallax;
	};

	SAM.Hawaii.prototype._getMantaBoard = function(config, spriteFactory, tileSize) {
		_.extend(config, {
			tileSizeRatio: 1,
			positionTweak: 0
		});

		var context = {
			spriteFactory: spriteFactory,
			tileSize: tileSize,
			baseWidth: 60,
			baseHeight: 60
		};


		return SAM.Wedding.prototype._getRow.call(context, config);
	};
})();

