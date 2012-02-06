SplashBoard = function(image) {
   this.image = image;
   var levelLoader = new L7.LevelLoader(image);
   var board = levelLoader.load().board;

   _.extend(this, board);
   this._init();
};

SplashBoard.prototype = {
   _init: function() {
      // make all water based tiles shimmer
      this.ani.withTiles('water').shimmer({
         // make sure it shimmers at tile.color level, not tile.overlay, maybe???
         rate:
         ....
      });

      var me = this;
      this.tilesTagged('rock').forEach(function(tile) {
         board.addActor(new L7.Actor({
            team: 'rock',
            position: tile.position,
            color: rockColor,
            scale: 0,
            hitDetection: {
               enabled: false,
               wave: function() {
                  me._frothFrom(this.position);
               }
            }
         }));
      },
      this);

      this.ani.withActors('wave').sequence(function(ani) {
         ani.move({
            direction: 'right',
            step: 1,
            distance: this.width,
            rate: this.waveMoveRate,
            easing: 'easeOutQuad'
         });
         ani.wait(this.waveFrequency);
         ani.invoke(this._startRockEmerge, this);
         ani.sequence(function(ani) {
            ani.invoke(this._resetWaveActors, this);
            ani.move({
               direction: 'right',
               step: 1,
               distance: this.width,
               rate: this.waveMoveRate,
               easing: 'easeOutQuad'
            });
            ani.wait(this.waveFrequency);
         }).repeat(Infinity);
      });
   }

   _frothFrom: function(position) {
      var frothLevel = 1;
      var frothPositions = [position.left(), position.up(), position.down()];
      var newFrothActors = [];

      for(var i = 0; i < 4; ++i) {
         var nextFrothPositions = [];
         frothPositions.forEach(function(frothPosition) {
            if (frothPosition && !board.tileAt(frothPosition).has('rock')) {
               var frothActor = new L7.Actor({
                  position: frothPosition,
                  color: [255, 255, 255, frothLevel],
                  team: 'froth'
               });
               newFrothActors.push(frothActor);
               this.addActor(frothActor);
               nextFrothPositions = nextFrothPositions.concat([frothPosition.up(), frothPosition.left(), frothPosition.down()]);
            }
         });
         frothLevel /= 2;
         frothPositions = nextFrothPositions;
      }
      
      this.ani.withActors(newFrothActors).tween({
         property: 'color',
         to: [255, 255, 255, 0],
         duration: 500
      });
   },

   _startRockEmerge: function() {
      this.ani.withActors('rock').sequence(function(ani) {
         ani.together(function(ani) {
            ani.tween({
               property: 'scale',
               from: 0,
               to: 0.6,
               easing: 'easeOutCubic',
               duration: 800
            });
            ani.jitter({
               property: 'scale',
               range: 0.15,
               duration: 800,
               chooseWith: 'random'
            });
         });
         ani.invokeEach(function(actor) {
            actor.hitDetection.enabled = true;
         });
         ani.wait(200);
         ani.together(function(ani) {
            ani.tween({
               property: 'scale',
               from: 0.6,
               to: 0.95,
               easing: 'easeOutCubic',
               duration: 400
            });
            ani.jitter({
               property: 'scale',
               range: 0.2,
               duration: 400,
               chooseWith: 'random'
            });
         });
         ani.wait(500);
         ani.together(function(ani) {
            ani.tween({
               property: 'scale',
               from: 0.95,
               to: 1.25,
               easing: 'easeOutCubic',
               duration: 250
            });
            ani.jitter({
               property: 'scale',
               range: 0.15,
               duration: 250,
               chooseWith: 'random'
            });
         });
      });
   },

   _getWaveActors: function() {
      var waveActors = this.actorsOnTeam('wave');
      if (!waveActors.length) {
         for (var i = 0; i < this.height; ++i) {
            this.addActor(new L7.Actor({
               team: 'wave'
            }));
         }
      }

      waveActors.forEach(function(actor, y) {
         var x = -1;
         var rand = Math.random();
         if (rand < 0.2) {
            x = -2;
         } else if (rand < 0.4) {
            x = 0
         }
         actor.position = L7.p(x, y);
      });
   },
}

