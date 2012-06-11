(function() {
	SAM.SpriteFactory = function(image) {
		this.image = image;
	};

	SAM.SpriteFactory.prototype = {
		mantaGoingRight: function(position) {
			return new L7.Actor({
				framesConfig: {
					src: this.image,
					width: 22,
					height: 21,
					direction: 'horizontal',
					sets: [[0], [0, 1, 2]],
					initialSet: 0,
					initialFrame: 0,
					anchor: L7.p(0, 0),
					offset: L7.p(205, 93)
				},
				position: position || L7.p(0, 0)
			});
		},

		mantaGoingLeft: function(position) {
			return new L7.Actor({
				framesConfig: {
					src: this.image,
					width: 22,
					height: 21,
					direction: 'horizontal',
					sets: [[0], [0, 1, 2]],
					initialSet: 0,
					initialFrame: 0,
					anchor: L7.p(0, 0),
					offset: L7.p(205, 70)
				},
				position: position || L7.p(0, 0)
			});
		},

		mmmm: function(position) {
			return new L7.Actor({
				framesConfig: {
					src: this.image,
					width: 36,
					height: 14,
					direction: 'horizontal',
					sets: [[0]],
					initialSet: 0,
					initialFrame: 0,
					anchor: L7.p(0, 0),
					offset: L7.p(123, 136)
				},
				position: position || L7.p(0, 0)
			});
		},

		casaTrumpeter: function(position) {
			return new L7.Actor({
				framesConfig: {
					src: this.image,
					width: 15,
					height: 13,
					direction: 'horizontal',
					sets: [[0], [0, 1, 2]],
					initialSet: 0,
					initialFrame: 0,
					anchor: L7.p(0, 0),
					offset: L7.p(110, 93)
				},
				position: position || L7.p(0, 0)
			});
		},

		casaGuitarist: function(position) {
			return new L7.Actor({
				framesConfig: {
					src: this.image,
					width: 19,
					height: 13,
					direction: 'horizontal',
					sets: [[0], [0, 1]],
					initialSet: 0,
					initialFrame: 0,
					anchor: L7.p(0, 0),
					offset: L7.p(156, 93)
				},
				position: position || L7.p(0, 0)
			});
		},

		raceClock: function(position) {
			return new L7.Actor({
				framesConfig: {
					src: this.image,
					width: 8,
					height: 4,
					direction: 'horizontal',
					sets: [[0], [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]],
					initialSet: 0,
					initialFrame: 0,
					anchor: L7.p(0, 0),
					offset: L7.p(40, 43)
				},
				position: position || L7.p(0, 0)
			});
		},

		matt: function(position) {
			return new L7.Actor({
				framesConfig: {
					src: this.image,
					width: 9,
					height: 14,
					direction: 'horizontal',
					sets: [[0], [1, 2, 3]],
					initialSet: 0,
					initialFrame: 0,
					anchor: L7.p(0, 0),
					offset: L7.p(0, 0)
				},
				position: position || L7.p(0, 0)
			});
		},

		mattWetsuit: function(position) {
			return new L7.Actor({
				framesConfig: {
					src: this.image,
					width: 9,
					height: 11,
					direction: 'horizontal',
					sets: [[0], [1, 2, 3]],
					initialSet: 0,
					initialFrame: 0,
					anchor: L7.p(0, 0),
					offset: L7.p(173, 0)
				},
				position: position || L7.p(0, 0)
			});
		},

		mattRace: function(position) {
			return new L7.Actor({
				framesConfig: {
					src: this.image,
					width: 9,
					height: 14,
					direction: 'horizontal',
					sets: [[0], [1, 2, 3]],
					initialSet: 0,
					initialFrame: 0,
					anchor: L7.p(0, 0),
					offset: L7.p(94, 0)
				},
				position: position || L7.p(0, 0)
			});
		},

		mattYellowLantern: function(position) {
			return new L7.Actor({
				framesConfig: {
					src: this.image,
					width: 9,
					height: 14,
					direction: 'horizontal',
					sets: [[0], [1, 2, 3]],
					initialSet: 0,
					initialFrame: 0,
					anchor: L7.p(0, 0),
					offset: L7.p(72, 93)
				},
				position: position || L7.p(0, 0)
			});
		},

		mattWedding: function(position) {
			return new L7.Actor({
				framesConfig: {
					src: this.image,
					width: 9,
					height: 14,
					direction: 'horizontal',
					sets: [[0], [1, 2, 3]],
					initialSet: 0,
					initialFrame: 0,
					anchor: L7.p(0, 0),
					offset: L7.p(58, 0)
				},
				position: position || L7.p(0, 0)
			});
		},

		sarah: function(position) {
			return new L7.Actor({
				framesConfig: {
					src: this.image,
					width: 9,
					height: 13,
					direction: 'horizontal',
					sets: [[0], [2, 1, 2, 4, 5, 4]],
					initialSet: 0,
					initialFrame: 0,
					anchor: L7.p(0, 0),
					offset: L7.p(0, 15)
				},
				position: position || L7.p(0, 0)
			});
		},

		sarahWetsuit: function(position) {
			return new L7.Actor({
				framesConfig: {
					src: this.image,
					width: 9,
					height: 10,
					direction: 'horizontal',
					sets: [[0], [2, 1, 2, 4, 5, 4]],
					initialSet: 0,
					initialFrame: 0,
					anchor: L7.p(0, 0),
					offset: L7.p(173, 15)
				},
				position: position || L7.p(0, 0)
			});
		},

		sarahRace: function(position) {
			return new L7.Actor({
				framesConfig: {
					src: this.image,
					width: 9,
					height: 13,
					direction: 'horizontal',
					sets: [[0], [2, 1, 2, 4, 5, 4]],
					initialSet: 0,
					initialFrame: 0,
					anchor: L7.p(0, 0),
					offset: L7.p(58, 29)
				},
				position: position || L7.p(0, 0)
			});
		},

		sarahClownPants: function(position) {
			return new L7.Actor({
				framesConfig: {
					src: this.image,
					width: 9,
					height: 13,
					direction: 'horizontal',
					sets: [[0], [2, 1, 2, 4, 5, 4]],
					initialSet: 0,
					initialFrame: 0,
					anchor: L7.p(0, 0),
					offset: L7.p(67, 137)
				},
				position: position || L7.p(0, 0)
			});
		},

		sarahWedding: function(position) {
			return new L7.Actor({
				framesConfig: {
					src: this.image,
					width: 9,
					height: 13,
					direction: 'horizontal',
					sets: [[0], [2, 1, 2, 4, 5, 4]],
					initialSet: 0,
					initialFrame: 0,
					anchor: L7.p(0, 0),
					offset: L7.p(58, 15)
				},
				position: position || L7.p(0, 0)
			});
		},

		lucy: function(position) {
			return new L7.Actor({
				framesConfig: {
					src: this.image,
					width: 9,
					height: 8,
					direction: 'horizontal',
					sets: [[], [0, 1, 2]],
					initialSet: 0,
					initialFrame: 0,
					anchor: L7.p(0, 0),
					offset: L7.p(0, 31)
				},
				position: position || L7.p(0, 0)
			});
		},

		schoeffLump: function(position) {
			return new L7.Actor({
				framesConfig: {
					src: this.image,
					width: 16,
					height: 4,
					direction: 'horizontal',
					sets: [[0]],
					initialSet: 0,
					initialFrame: 0,
					anchor: L7.p(0, 0),
					offset: L7.p(38, 0)
				},
				position: position || L7.p(0, 0)
			});
		},

		please: function(position) {
			return new L7.Actor({
				framesConfig: {
					src: this.image,
					width: 31,
					height: 14,
					direction: 'horizontal',
					sets: [[0]],
					initialSet: 0,
					initialFrame: 0,
					anchor: L7.p(0, 0),
					offset: L7.p(41, 82)
				},
				position: position || L7.p(0, 0)
			});
		},

		ellipsis: function(position) {
			return new L7.Actor({
				framesConfig: {
					src: this.image,
					width: 16,
					height: 14,
					direction: 'horizontal',
					sets: [[0]],
					initialSet: 0,
					initialFrame: 0,
					anchor: L7.p(0, 0),
					offset: L7.p(41, 96)
				},
				position: position || L7.p(0, 0)
			});
		},

		schoeffLaying: function(position) {
			return new L7.Actor({
				framesConfig: {
					src: this.image,
					width: 8,
					height: 5,
					direction: 'horizontal',
					sets: [[0]],
					initialSet: 0,
					initialFrame: 0,
					anchor: L7.p(0, 0),
					offset: L7.p(38, 7)
				},
				position: position || L7.p(0, 0)
			});
		},

		schoeffDance: function(position) {
			return new L7.Actor({
				framesConfig: {
					src: this.image,
					width: 10,
					height: 11,
					direction: 'horizontal',
					sets: [[], [0, 1, 2]],
					initialSet: 0,
					initialFrame: 0,
					anchor: L7.p(0, 0),
					offset: L7.p(27, 30)
				},
				position: position || L7.p(0, 0)
			});
		},

		schoeffPoke: function(position) {
			return new L7.Actor({
				framesConfig: {
					src: this.image,
					width: 3,
					height: 8,
					direction: 'horizontal',
					sets: [[0]],
					initialSet: 0,
					initialFrame: 0,
					anchor: L7.p(0, 0),
					offset: L7.p(160, 138)
				},
				position: position || L7.p(0, 0)
			});
		},

		goBears: function(position) {
			return new L7.Actor({
				framesConfig: {
					src: this.image,
					width: 39,
					height: 14,
					direction: 'horizontal',
					sets: [[0]],
					initialSet: 0,
					initialFrame: 0,
					anchor: L7.p(0, 0),
					offset: L7.p(165, 135)
				},
				position: position || L7.p(0, 0)
			});
		},

		lily: function(position) {
			return new L7.Actor({
				framesConfig: {
					src: this.image,
					width: 9,
					height: 9,
					direction: 'horizontal',
					sets: [[], [0, 1, 2]],
					initialSet: 0,
					initialFrame: 0,
					anchor: L7.p(0, 0),
					offset: L7.p(30, 61)
				},
				position: position || L7.p(0, 0)
			});
		},

		boo: function(position) {
			return new L7.Actor({
				framesConfig: {
					src: this.image,
					width: 9,
					height: 8,
					direction: 'horizontal',
					sets: [[0], [0, 1, 2]],
					initialSet: 0,
					initialFrame: 0,
					anchor: L7.p(0, 0),
					offset: L7.p(0, 72)
				},
				position: position || L7.p(0, 0)
			});

		},

		bobo: function(position) {
			return new L7.Actor({
				framesConfig: {
					src: this.image,
					width: 9,
					height: 9,
					direction: 'horizontal',
					sets: [[0], [0, 1, 2]],
					initialSet: 0,
					initialFrame: 0,
					anchor: L7.p(0, 0),
					offset: L7.p(30, 71)
				},
				position: position || L7.p(0, 0)
			});
		},

		ted: function(position) {
			return new L7.Actor({
				framesConfig: {
					src: this.image,
					width: 10,
					height: 13,
					direction: 'horizontal',
					sets: [[0], [1, 2, 3]],
					initialSet: 0,
					initialFrame: 0,
					anchor: L7.p(0, 0),
					offset: L7.p(0, 42)
				},
				position: position || L7.p(0, 0)
			});
		},

		chris: function(position) {
			return new L7.Actor({
				framesConfig: {
					src: this.image,
					width: 10,
					height: 13,
					direction: 'horizontal',
					sets: [[0], [1, 2, 3]],
					initialSet: 0,
					initialFrame: 0,
					anchor: L7.p(0, 0),
					offset: L7.p(0, 95)
				},
				position: position || L7.p(0, 0)
			});
		},

		ben: function(position) {
			return new L7.Actor({
				framesConfig: {
					src: this.image,
					width: 24,
					height: 30,
					direction: 'horizontal',
					sets: [[0], [0, 1, 2]],
					initialSet: 0,
					initialFrame: 0,
					anchor: L7.p(0, 0),
					offset: L7.p(57, 50)
				},
				position: position || L7.p(0, 0)
			});
		},

		dad: function(position) {
			return new L7.Actor({
				framesConfig: {
					src: this.image,
					width: 10,
					height: 13,
					direction: 'horizontal',
					sets: [[0], [1, 2]],
					initialSet: 0,
					initialFrame: 0,
					anchor: L7.p(0, 0),
					offset: L7.p(0, 57)
				},
				position: position || L7.p(0, 0)
			});
		},

		mom: function(position) {
			return new L7.Actor({
				framesConfig: {
					src: this.image,
					width: 10,
					height: 13,
					direction: 'horizontal',
					sets: [[0], [1, 2, 3]],
					initialSet: 0,
					initialFrame: 0,
					anchor: L7.p(0, 0),
					offset: L7.p(0, 82)
				},
				position: position || L7.p(0, 0)
			});
		},

		livi: function(position) {
			return new L7.Actor({
				framesConfig: {
					src: this.image,
					width: 9,
					height: 8,
					direction: 'horizontal',
					sets: [[], [0, 1, 2]],
					initialSet: 0,
					initialFrame: 0,
					anchor: L7.p(0, 0),
					offset: L7.p(40, 136)
				},
				position: position || L7.p(0, 0)
			});
		},

		buddy: function(position) {
			return new L7.Actor({
				framesConfig: {
					src: this.image,
					width: 9,
					height: 9,
					direction: 'horizontal',
					sets: [[], [0, 1, 2]],
					initialSet: 0,
					initialFrame: 0,
					anchor: L7.p(0, 0),
					offset: L7.p(40, 124)
				},
				position: position || L7.p(0, 0)
			});
		},

		chad: function(position) {
			return new L7.Actor({
				framesConfig: {
					src: this.image,
					width: 10,
					height: 14,
					direction: 'horizontal',
					sets: [[0], [1, 2, 3]],
					initialSet: 0,
					initialFrame: 0,
					anchor: L7.p(0, 0),
					offset: L7.p(0, 136)
				},
				position: position || L7.p(0, 0)
			});
		},

		phil: function(position) {
			return new L7.Actor({
				framesConfig: {
					src: this.image,
					width: 10,
					height: 14,
					direction: 'horizontal',
					sets: [[0], [1, 2, 3]],
					initialSet: 0,
					initialFrame: 0,
					anchor: L7.p(0, 0),
					offset: L7.p(0, 108)
				},
				position: position || L7.p(0, 0)
			});
		},

		goPackers: function(position) {
			return new L7.Actor({
				framesConfig: {
					src: this.image,
					width: 44,
					height: 14,
					direction: 'horizontal',
					sets: [[0]],
					initialSet: 0,
					initialFrame: 0,
					anchor: L7.p(0, 0),
					offset: L7.p(114, 29)
				},
				position: position || L7.p(0, 0)
			});
		},

		goTigers: function(position) {
			return new L7.Actor({
				framesConfig: {
					src: this.image,
					width: 41,
					height: 14,
					direction: 'horizontal',
					sets: [[0]],
					initialSet: 0,
					initialFrame: 0,
					anchor: L7.p(0, 0),
					offset: L7.p(132, 77)
				},
				position: position || L7.p(0, 0)
			});
		},

		goRedWings: function(position) {
			return new L7.Actor({
				framesConfig: {
					src: this.image,
					width: 53,
					height: 14,
					direction: 'horizontal',
					sets: [[0]],
					initialSet: 0,
					initialFrame: 0,
					anchor: L7.p(0, 0),
					offset: L7.p(159, 29)
				},
				position: position || L7.p(0, 0)
			});
		},

		emily: function(position) {
			return new L7.Actor({
				framesConfig: {
					src: this.image,
					width: 10,
					height: 13,
					direction: 'horizontal',
					sets: [[0], [1, 2, 3]],
					initialSet: 0,
					initialFrame: 0,
					anchor: L7.p(0, 0),
					offset: L7.p(0, 123)
				},
				position: position || L7.p(0, 0)
			});
		},

		tammy: function(position) {
			return new L7.Actor({
				framesConfig: {
					src: this.image,
					width: 10,
					height: 13,
					direction: 'horizontal',
					sets: [[0], [1, 2, 3]],
					initialSet: 0,
					initialFrame: 0,
					anchor: L7.p(0, 0),
					offset: L7.p(66, 123)
				},
				position: position || L7.p(0, 0)
			});
		},

		troll: function(position) {
			return new L7.Actor({
				framesConfig: {
					src: this.image,
					width: 10,
					height: 13,
					direction: 'horizontal',
					sets: [[0], [1, 2, 3]],
					initialSet: 0,
					initialFrame: 0,
					anchor: L7.p(0, 0),
					offset: L7.p(65, 111)
				},
				position: position || L7.p(0, 0)
			});
		},

		avPlayer: function(position) {
			return new L7.Actor({
				framesConfig: {
					src: this.image,
					width: 10,
					height: 26,
					direction: 'horizontal',
					sets: [[0], [1, 2, 3]],
					initialSet: 0,
					initialFrame: 0,
					anchor: L7.p(0, 0),
					offset: L7.p(104, 111)
				},
				position: position || L7.p(0, 0)
			});
		},

		avPlayerNoShadow: function(position) {
			return new L7.Actor({
				framesConfig: {
					src: this.image,
					width: 10,
					height: 12,
					direction: 'horizontal',
					sets: [[0], [1, 2, 3]],
					initialSet: 0,
					initialFrame: 0,
					anchor: L7.p(0, 0),
					offset: L7.p(104, 111)
				},
				position: position || L7.p(0, 0)
			});
		},

		redwingPlayer: function(position) {
			return new L7.Actor({
				framesConfig: {
					src: this.image,
					width: 10,
					height: 26,
					direction: 'horizontal',
					sets: [[0], [1, 2, 3]],
					initialSet: 0,
					initialFrame: 0,
					anchor: L7.p(0, 0),
					offset: L7.p(132, 2)
				},
				position: position || L7.p(0, 0)
			});
		},

		redwingPlayerNoShadow: function(position) {
			return new L7.Actor({
				framesConfig: {
					src: this.image,
					width: 10,
					height: 12,
					direction: 'horizontal',
					sets: [[0], [1, 2, 3]],
					initialSet: 0,
					initialFrame: 0,
					anchor: L7.p(0, 0),
					offset: L7.p(132, 2)
				},
				position: position || L7.p(0, 0)
			});
		},

		hockeyRef: function(position) {
			return new L7.Actor({
				framesConfig: {
					src: this.image,
					width: 9,
					height: 26,
					direction: 'horizontal',
					sets: [[0], [0]],
					initialSet: 0,
					initialFrame: 0,
					anchor: L7.p(0, 0),
					offset: L7.p(144, 111)
				},
				position: position || L7.p(0, 0)
			});
		},

		chipotleBlimp: function(position) {
			return new L7.Actor({
				framesConfig: {
					src: this.image,
					width: 19,
					height: 9,
					direction: 'horizontal',
					sets: [[0], [0]],
					initialSet: 0,
					initialFrame: 0,
					anchor: L7.p(0, 0),
					offset: L7.p(153, 113)
				},
				position: position || L7.p(0, 0)
			});
		},

		woohooBubble: function(position) {
			return new L7.Actor({
				framesConfig: {
					src: this.image,
					width: 55,
					height: 14,
					direction: 'horizontal',
					sets: [[0]],
					initialSet: 0,
					initialFrame: 0,
					anchor: L7.p(0, 0),
					offset: L7.p(130, 51)
				},
				position: position || L7.p(0, 0)
			});
		},

		ooo: function(position) {
			return new L7.Actor({
				framesConfig: {
					src: this.image,
					width: 3,
					height: 4,
					direction: 'horizontal',
					sets: [[0]],
					initialSet: 0,
					initialFrame: 0,
					anchor: L7.p(0, 0),
					offset: L7.p(133, 70)
				},
				position: position || L7.p(0, 0)
			});
		},

		woo: function(position) {
			return new L7.Actor({
				framesConfig: {
					src: this.image,
					width: 13,
					height: 4,
					direction: 'horizontal',
					sets: [[0]],
					initialSet: 0,
					initialFrame: 0,
					anchor: L7.p(0, 0),
					offset: L7.p(140, 70)
				},
				position: position || L7.p(0, 0)
			});
		},

		hoo: function(position) {
			return new L7.Actor({
				framesConfig: {
					src: this.image,
					width: 11,
					height: 6,
					direction: 'horizontal',
					sets: [[0]],
					initialSet: 0,
					initialFrame: 0,
					anchor: L7.p(0, 0),
					offset: L7.p(157, 68)
				},
				position: position || L7.p(0, 0)
			});
		},

		john: function(position) {
			return new L7.Actor({
				framesConfig: {
					src: this.image,
					width: 12,
					height: 14,
					direction: 'horizontal',
					sets: [[0, 1]],
					initialSet: 0,
					initialFrame: 0,
					anchor: L7.p(0, 0),
					offset: L7.p(188, 51)
				},
				position: position || L7.p(0, 0)
			});
		},

		byron: function(position) {
			return new L7.Actor({
				framesConfig: {
					src: this.image,
					width: 11,
					height: 18,
					direction: 'horizontal',
					sets: [[0, 1]],
					initialSet: 0,
					initialFrame: 0,
					anchor: L7.p(0, 0),
					offset: L7.p(178, 70)
				},
				position: position || L7.p(0, 0)
			});
		},

		nicky: function(position) {
			return new L7.Actor({
				framesConfig: {
					src: this.image,
					width: 15,
					height: 14,
					direction: 'horizontal',
					sets: [[0, 1]],
					initialSet: 0,
					initialFrame: 0,
					anchor: L7.p(0, 0),
					offset: L7.p(175, 109)
				},
				position: position || L7.p(0, 0)
			});
		}
	};

})();

