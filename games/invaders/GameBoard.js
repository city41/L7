(function() {


	SI.GameBoard = function(spriteFactory, tileSize) {
		function getPlayer() {
			return SI.Player(spriteFactory.player(), spriteFactory.playerExplosion(), spriteFactory.playerBulletExplosion());
		}

		var player = getPlayer();

		var board = new L7.Board({
			width: 224,
			height: 260,
			tileSize: tileSize,
			defaultTileColor: [0,0,0,1],
			disableHitDetection: true
		});

		var _numPlayers = 3;

		board.addActor(player);

		for(var i = 0; i < 4; ++i) {
			board.addActor(new SI.Barrier(spriteFactory.barrier(), spriteFactory.barrierDamage(), L7.p(40 + 40 * i, 200)));
		}

		var explosion = spriteFactory.alienExplosion();
		var alienBullet = spriteFactory.alienSquiggleBullet();
		var movementConfig = {
			horizontalSpan: 10,
			verticalDrop: 10,
			barrierArea: 190,
			floorY: 226
		};

		for(var i = 0; i < 11; ++i) {
			var alien1 = new SI.Alien(spriteFactory.octopus(), explosion, alienBullet, movementConfig, L7.p(20 + i*15,40));
			var alien2 = new SI.Alien(spriteFactory.stingray(), explosion, alienBullet, movementConfig, L7.p(20 + i * 15,55));
			var alien3 = new SI.Alien(spriteFactory.stingray(), explosion, alienBullet, movementConfig, L7.p(20 + i * 15,70));
			var alien4 = new SI.Alien(spriteFactory.skull(), explosion, alienBullet, movementConfig, L7.p(20 + i*15,85));
			var alien5 = new SI.Alien(spriteFactory.skull(), explosion, alienBullet, movementConfig, L7.p(20 + i * 15,100));
			board.addActors(alien1, alien2, alien3, alien4, alien5);
		}

		board.addActor(new SI.Floor(L7.p(0, 226), 224));

		var allAliens = board.actorsOnTeam('alien');
		var _alienCount = allAliens.length;

		allAliens.forEach(function(alien) {
			alien.on('hitFloor', function() {
				board.fireEvent('gameover');
			});
			alien.on('dead', function() {
				--_alienCount;
				if(_alienCount === 0) {
					board.fireEvent('levelComplete');
				}
			});
		});

		function onPlayerDead() {
			--_numPlayers;

			if(_numPlayers === 0) {
				board.fireEvent('gameover');
			} else {
				board.freezeFor(1000, function() {
					console.log('whats this?');
					var newPlayer = getPlayer();
					newPlayer.on('dead', onPlayerDead);
					board.addActor(newPlayer);
				});
			}
		}

		player.on('dead', onPlayerDead);

		return board;
	};

})();

