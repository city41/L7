(function() {
	var _resources = {
		classicBoard: {
			src: 'resources/classicBoard.png'
		}
	};

	function _loadResources(callback) {
		var toLoad = 0;

		for (var rsc in _resources) {
			if (_resources.hasOwnProperty(rsc)) {++toLoad;
			}
		}

		for (var rsc in _resources) {
			if (_resources.hasOwnProperty(rsc)) {
				var def = _resources[rsc];
				var img = new Image();
				img.onload = (function(d) {
					return function() {
						d.image = this;
						--toLoad;
						if(toLoad === 0) {
							callback();
						}
					}
				})(def);
				img.src = def.src;
			}
		}
	}

	var _game;

	function _onSplashComplete(game) {
		var nextBoard;
		if (sg.Storage.present('hasPlayedBefore')) {
			nextBoard = new sg.MainMenu
		} else {
			nextBoard = new sg.ClassicIntroBoard(_resources.classicBoard.image, game.width, game.height);
		}

		_game.replaceBoard(new L7.FadeOutIn({
			duration: 3000,
			game: _game,
			fromBoard: game.board,
			toBoard: nextBoard,
			color: 'black'
		}));
	}

	sg.go = function() {
		_loadResources(function() {
			var splash = new sg.SplashBoard();

			_game = new L7.Game({
				board: splash,
				width: 480,
				height: 320
			});

			_game.after(20, _onSplashComplete);

			_game.go();
		});
	};
})();

