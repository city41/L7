(function(){this.L7=this.L7||{};this.L7.global=this;Object.defineProperty(this.L7,"useWebGL",{get:function(){return this._useWebGL},set:function(a){if(this.hasOwnProperty("_useWebGL"))throw Error("You can only set useWebGL once");this._useWebGL=a}});this.L7.isFirefox=-1<window.navigator.userAgent.toLowerCase().indexOf("firefox");this.L7.isChrome=-1<window.navigator.userAgent.toLowerCase().indexOf("chrome");this.L7.isSupportedBrowser=this.L7.isFirefox||this.L7.isChrome;this.L7.isWebGLAvailable=function(){var a=
document.createElement("canvas");if(!a)return!1;try{return!!a.getContext("experimental-webgl")}catch(b){return!1}}()})();
(function(){L7.AnimationFactory=function(a,b){this._owner=a;this._board=b;this._buildStack=[];this._targetStack=[];this._addedAnis=[]};L7.AnimationFactory.prototype={_getBoard:function(){return this._board||this._owner.board},_determineTargets:function(a){return a.targets?a.targets:this._owner.getAnimationTargets(a.filter)},_addAnimationToBoard:function(a){this._addedAnis.push(a);this._getBoard().addDaemon(a)},_addParentAnimation:function(a,b,c,d){c=new c(d);b&&this._targetStack.push(this._determineTargets(b));
this._buildStack.push(c);a(this);this._buildStack.pop();b&&this._targetStack.pop();0===this._buildStack.length?this._addAnimationToBoard(c):this._buildStack.last.children.add(c);return c},_addAnimation:function(a,b){a.targets||(a.targets="undefined"!==typeof a.filter?this._owner.getAnimationTargets(a.filter):0<this._targetStack.length?this._targetStack.last:this._owner.getAnimationTargets());var c=new b(a);0===this._buildStack.length?this._addAnimationToBoard(c):this._buildStack.last.children.add(c);
return c},disco:function(a){return this._addAnimation(a,L7.Disco)},shimmer:function(a){return this._addAnimation(a,L7.Shimmer)},plasma:function(a){return this._addAnimation(a,L7.Plasma)},setProperty:function(a){a.duration=0;a.from=a.to=a.value;return this.tween(a)},copyProperty:function(a){return this._addAnimation(a,L7.CopyProperty)},tween:function(a){return this._addAnimation(a,L7.Tween)},frame:function(a){return this._addAnimation(a,L7.Frame)},fadeIn:function(a){return this._addAnimation(a,L7.FadeIn)},
sequence:function(a,b){return this.repeat(1,a,b)},together:function(a,b){var c,d;_.isFunction(a)?d=a:(c=a,d=b);return this._addParentAnimation(d,c,L7.Together)},repeat:function(a,b,c){var d;_.isFunction(b)||(d=b,b=c);return this._addParentAnimation(b,d,L7.Repeat,a)},wait:function(a){return this.waitBetween(a,a)},waitBetween:function(a,b){return this._addAnimation({min:a,max:b},L7.Wait)},invoke:function(a){return this._addAnimation({func:a},L7.Invoke)},end:function(){var a=this._buildStack.first;if(a){var b=
this;return this.invoke(function(){b._getBoard().removeDaemon(a)})}},die:function(){var a=this._getBoard();this._addedAnis.forEach(function(b){a.removeDaemon(b)})}}})();(function(){L7.CopyProperty=function(a){_.extend(this,a)};L7.CopyProperty.prototype={reset:function(){},update:function(){if(!this.done&&!this.disabled){for(var a,b=0;b<this.targets.length;++b)a=this.targets[b],a[this.destProperty]=a[this.srcProperty];this.done=!0}}}})();
(function(){var a=[255,255,255,0.9],b=[255,255,255,0.6];L7.Disco=function(a){_.extend(this,a);this.reset()};L7.Disco.prototype={reset:function(){this.done=!1;this.even=!0;this._discoCount=this._elapsed=0},update:function(a){this.done||(this._elapsed+=a,this._elapsed>=this.rate&&(this.even=!this.even,this._doDisco(this.even,this.targets,this.width),this._elapsed-=this.rate,++this._discoCount),this.done=2<=this._discoCount)},_doDisco:function(c,d,e){for(var f=0;f<d.length;++f){var g=f%e;0===g&&(c=!c);
d[f].overlayColor=c?0===(g&1)?a:b:1===(g&1)?a:b}}}})();Math.linearTween=function(a,b,c,d){return c*a/d+b};Math.easeInQuad=function(a,b,c,d){return c*(a/=d)*a+b};Math.easeOutQuad=function(a,b,c,d){return-c*(a/=d)*(a-2)+b};Math.easeInOutQuad=function(a,b,c,d){return 1>(a/=d/2)?c/2*a*a+b:-c/2*(--a*(a-2)-1)+b};Math.easeInCubic=function(a,b,c,d){return c*(a/=d)*a*a+b};Math.easeOutCubic=function(a,b,c,d){return c*((a=a/d-1)*a*a+1)+b};
Math.easeInOutCubic=function(a,b,c,d){return 1>(a/=d/2)?c/2*a*a*a+b:c/2*((a-=2)*a*a+2)+b};Math.easeInQuart=function(a,b,c,d){return c*(a/=d)*a*a*a+b};Math.easeOutQuart=function(a,b,c,d){return-c*((a=a/d-1)*a*a*a-1)+b};Math.easeInOutQuart=function(a,b,c,d){return 1>(a/=d/2)?c/2*a*a*a*a+b:-c/2*((a-=2)*a*a*a-2)+b};Math.easeInQuint=function(a,b,c,d){return c*(a/=d)*a*a*a*a+b};Math.easeOutQuint=function(a,b,c,d){return c*((a=a/d-1)*a*a*a*a+1)+b};
Math.easeInOutQuint=function(a,b,c,d){return 1>(a/=d/2)?c/2*a*a*a*a*a+b:c/2*((a-=2)*a*a*a*a+2)+b};Math.easeInSine=function(a,b,c,d){return-c*Math.cos(a/d*(Math.PI/2))+c+b};Math.easeOutSine=function(a,b,c,d){return c*Math.sin(a/d*(Math.PI/2))+b};Math.easeInOutSine=function(a,b,c,d){return-c/2*(Math.cos(Math.PI*a/d)-1)+b};Math.easeInExpo=function(a,b,c,d){return 0==a?b:c*Math.pow(2,10*(a/d-1))+b};Math.easeOutExpo=function(a,b,c,d){return a==d?b+c:c*(-Math.pow(2,-10*a/d)+1)+b};
Math.easeInOutExpo=function(a,b,c,d){return 0==a?b:a==d?b+c:1>(a/=d/2)?c/2*Math.pow(2,10*(a-1))+b:c/2*(-Math.pow(2,-10*--a)+2)+b};Math.easeInCirc=function(a,b,c,d){return-c*(Math.sqrt(1-(a/=d)*a)-1)+b};Math.easeOutCirc=function(a,b,c,d){return c*Math.sqrt(1-(a=a/d-1)*a)+b};Math.easeInOutCirc=function(a,b,c,d){return 1>(a/=d/2)?-c/2*(Math.sqrt(1-a*a)-1)+b:c/2*(Math.sqrt(1-(a-=2)*a)+1)+b};
Math.easeInElastic=function(a,b,c,d,e,f){if(0==a)return b;if(1==(a/=d))return b+c;f||(f=0.3*d);e<Math.abs(c)?(e=c,c=f/4):c=f/(2*Math.PI)*Math.asin(c/e);return-(e*Math.pow(2,10*(a-=1))*Math.sin((a*d-c)*2*Math.PI/f))+b};Math.easeOutElastic=function(a,b,c,d,e,f){if(0==a)return b;if(1==(a/=d))return b+c;f||(f=0.3*d);if(e<Math.abs(c))var e=c,g=f/4;else g=f/(2*Math.PI)*Math.asin(c/e);return e*Math.pow(2,-10*a)*Math.sin((a*d-g)*2*Math.PI/f)+c+b};
Math.easeInOutElastic=function(a,b,c,d,e,f){if(0==a)return b;if(2==(a/=d/2))return b+c;f||(f=d*0.3*1.5);if(e<Math.abs(c))var e=c,g=f/4;else g=f/(2*Math.PI)*Math.asin(c/e);return 1>a?-0.5*e*Math.pow(2,10*(a-=1))*Math.sin((a*d-g)*2*Math.PI/f)+b:0.5*e*Math.pow(2,-10*(a-=1))*Math.sin((a*d-g)*2*Math.PI/f)+c+b};Math.easeInBack=function(a,b,c,d,e){void 0==e&&(e=1.70158);return c*(a/=d)*a*((e+1)*a-e)+b};Math.easeOutBack=function(a,b,c,d,e){void 0==e&&(e=1.70158);return c*((a=a/d-1)*a*((e+1)*a+e)+1)+b};
Math.easeInOutBack=function(a,b,c,d,e){void 0==e&&(e=1.70158);return 1>(a/=d/2)?c/2*a*a*(((e*=1.525)+1)*a-e)+b:c/2*((a-=2)*a*(((e*=1.525)+1)*a+e)+2)+b};Math.easeInBounce=function(a,b,c,d){return c-Math.easeOutBounce(d-a,0,c,d)+b};Math.easeOutBounce=function(a,b,c,d){return(a/=d)<1/2.75?c*7.5625*a*a+b:a<2/2.75?c*(7.5625*(a-=1.5/2.75)*a+0.75)+b:a<2.5/2.75?c*(7.5625*(a-=2.25/2.75)*a+0.9375)+b:c*(7.5625*(a-=2.625/2.75)*a+0.984375)+b};
Math.easeInOutBounce=function(a,b,c,d){return a<d/2?0.5*Math.easeInBounce(2*a,0,c,d)+b:0.5*Math.easeOutBounce(2*a-d,0,c,d)+0.5*c+b};
(function(){L7.FadeIn=function(a){_.extend(this,a);this.reset();this._easeFunc=(this._easeFunc=Math[this.easing||"linearTween"])||Math.linearTween};L7.FadeIn.prototype={reset:function(){this._elapsed=0;this.done=this._elapsed>=this.duration;this._initted=!1},_initTargets:function(){this.targets.forEach(function(a){a.color[3]=0})},update:function(a){this._initted||(this._initTargets(),this._initted=!0);if(!this.done&&!this.disabled){this._elapsed+=a;this._elapsed>this.duration&&(this._elapsed=this.duration,
this.done=!0);for(var a=this.targets.length,b=this._easeFunc(this._elapsed,0,1,this.duration);a--;)this.targets[a].color[3]=b}}}})();
(function(){L7.Frame=function(a){_.extend(this,a);this.pieceSetIndex=this.pieceSetIndex||0;this.reset()};L7.Frame.prototype={reset:function(){this._curFrame=this._elapsed=0;this._initted=this.done=!1},_initTargets:function(){this.targets.forEach(function(a){a.setFrame(this.pieceSetIndex,0);a._frameDir=1;a._curFrame=0},this)},update:function(a){this._initted||(this._initTargets(),this._initted=!0);!this.done&&!this.disabled&&(this._elapsed+=a,this._elapsed>=this.rate&&(this._elapsed-=this.rate,this._nextFrame()))},
_nextFrame:function(){var a=this.looping,b=this.pieceSetIndex;this.targets.forEach(function(c){var d=c.pieceSets[b].length-1;c._curFrame+=c._frameDir;0>c._curFrame&&(c._curFrame=1,c._frameDir=1);c._curFrame>d&&("backforth"===a?(c._curFrame=d-1,c._frameDir=-1):c._curFrame=0);c.setFrame(b,c._curFrame)})}}})();(function(){L7.Invoke=function(a){_.extend(this,a);this.reset()};L7.Invoke.prototype={reset:function(){this.done=!1},update:function(){this.done||(this.func(),this.done=!0)}}})();
(function(){L7.Plasma=function(a){_.extend(this,a);this._width=this._determineDim(this.targets,"x");this._height=this._determineDim(this.targets,"y");this._paletteOffset=0;this._palette=this._createPalette();this.reset()};L7.Plasma.prototype={reset:function(){this.done=!1;this._elapsed=0;this._doPlasma(this._width,this._height,this.targets,this._paletteOffset)},update:function(a){this._elapsed+=a;this._elapsed>=this.rate&&(this._paletteOffset+=1,this.done=!0)},_createPalette:function(){for(var a=
[],b=this.weights&&_.isNumber(this.weights[0])?this.weights[0]:1,c=this.weights&&_.isNumber(this.weights[1])?this.weights[1]:1,d=this.weights&&_.isNumber(this.weights[2])?this.weights[2]:1,e=this.alpha||1,f=this.noise||1,g=0,i,k,j;256>g;g++)i=~~(128+128*Math.sin(Math.PI*g/(32/f))),k=~~(128+128*Math.sin(Math.PI*g/(64/f))),j=~~(128+128*Math.sin(Math.PI*g/(128/f))),i=Math.min(255,i*b),k=Math.min(255,k*c),j=Math.min(255,j*d),a[g]=[i,k,j,e];return a},_determineDim:function(a,b){var c=Math.min.apply(null,
a.map(function(a){return a.position[b]}));return Math.max.apply(null,a.map(function(a){return a.position[b]}))-c+1},_doPlasma:function(a,b,c,d){for(var e=0,f;e<b;++e)for(f=0;f<a;++f){var g=c[a*e+f];g&&(g.overlayColor=this._palette[~~(0.25*(128*Math.sin(0.0625*f)+256+128*Math.sin(0.03125*e)+128+128*Math.sin(0.125*Math.sqrt((f+d-a)*(f+d-a)+(e-d-b)*(e-d-b)))+128+128*Math.sin(0.125*Math.sqrt(f*f+e*e)))+d)%256])}}}})();
(function(){L7.Repeat=function(a){this.children=[];this._curCount=this._currentChild=0;this.count=a};L7.Repeat.prototype={reset:function(){this.done=!1;this._curCount=this._currentChild=0;this.children.forEach(function(a){a.reset()})},update:function(){this.done=this._curCount>=this.count;if(!this.done){var a=this.children[this._currentChild];a.update.apply(a,arguments);a.done&&(++this._currentChild,this._currentChild>=this.children.length&&(this._currentChild=0,++this._curCount,this.children.forEach(function(a){a.reset()})));
this.done=this._curCount>=this.count}}}})();
(function(){L7.Shimmer=function(a){_.extend(this,a);this.reset()};L7.Shimmer.prototype={reset:function(){this.done=!1},_initTargets:function(){var a=this.maxAlpha-this.minAlpha,b=this.color||[255,255,255,1];this.targets.forEach(function(c){c.opaque=!0;c.overlayColor=b.slice(0);c.overlayColor[3]=L7.rand(this.minAlpha,this.maxAlpha);c.shimmerRate=Math.floor(L7.rand(this.baseRate-this.baseRate*this.rateVariance,this.baseRate+this.baseRate*this.rateVariance));c.shimmerAlphaPerMilli=a/c.shimmerRate;c.shimmerDirection=
1},this)},update:function(a){this._initted||(this._initTargets(),this._initted=!0);this.done||(this.targets.forEach(function(b){b.overlayColor[3]+=a*b.shimmerAlphaPerMilli*b.shimmerDirection;var c=b.overlayColor[3];c>this.maxAlpha&&(b.shimmerDirection=-1,b.overlayColor[3]=this.maxAlpha);c<this.minAlpha&&(b.shimmerDirection=1,b.overlayColor[3]=this.minAlpha)},this),this.done=!0)}}})();
(function(){L7.Together=function(){this.children=[]};L7.Together.prototype={reset:function(){this.done=!1;this.children.forEach(function(a){a.reset()})},update:function(){if(!this.done){var a=_.toArray(arguments),b=!1;this.children.forEach(function(c){c.update.apply(c,a);c.done||(b=!0)});this.done=!b}}}})();
(function(){var a=0;L7.Tween=function(b){_.extend(this,b);this.reset();this._saveProperty=this.property+"_save_"+a++;this._nonJitteredProperty=this.property+"_nonJittered_"+a++;this._easeFunc=(this._easeFunc=Math[this.easing||"linearTween"])||Math.linearTween};L7.Tween.prototype={reset:function(){this._elapsed=0;this.done=this._elapsed>=this.duration;this._initted=!1},_initTargets:function(){this.targets.forEach(function(a){a[this._saveProperty]=a[this.property];_.isArray(a[this._saveProperty])&&
(a[this._saveProperty]=a[this._saveProperty].slice(0));var c=this.hasOwnProperty("from")?this.from:a[this.property];_.isUndefined(c)||(_.isArray(c)&&(c=c.slice(0)),a[this.property]=c)},this)},update:function(a){this._initted||(this._initTargets(),this._initted=!0);!this.done&&!this.disabled&&(this._elapsed+=a,this._elapsed>this.duration&&(this._elapsed=this.duration,this.done=!0),this.targets.forEach(function(a){this._tween(a)},this),this.done&&this.targets.forEach(function(a){this.restoreAfter&&
(a[this.property]=a[this._saveProperty]);delete a[this._saveProperty];delete a[this._nonJitteredProperty]},this))},_tween:function(a){if(_.isArray(a[this.property]))for(var c=a[this.property],d=0;d<c.length;++d)c[d]=this._tweenValue(this._elapsed,(this.from||a[this._saveProperty])[d],this.to[d],this.duration);else _.isNumber(a[this.property])&&(a[this.property]=this._tweenValue(this._elapsed,this.from,this.to,this.duration))},_tweenValue:function(a,c,d,e){a=this._easeFunc(a,c,d-c,e);_.isNumber(this.jitterMin)&&
(a+=L7.rand(this.jitterMin,this.jitterMax||0));return a}}})();(function(){L7.Wait=function(a){_.extend(this,a);this._specifiedDuration=this.duration;this.reset()};L7.Wait.prototype={reset:function(){this.duration=this._specifiedDuration||L7.rand(this.min,this.max);this._elapsed=0;this.done=this._elapsed>=this.duration},update:function(a){this.done||(this._elapsed+=a,this.done=this._elapsed>=this.duration)}}})();
(function(){var a={x:0,y:0};L7.Actor=function(a){_.extend(this,L7.Observable);_.extend(this,a);this.ani=new L7.AnimationFactory(this);this.position=this.position||L7.p(0,0);this.keyInputs=this.keyInputs||{};this.framesConfig?this.pieces=this._initFrames():(this.shape=this.shape||[[5]],this.pieces=this._createPieces());this._listeners={};this._offsetElapsed=0};L7.Actor.prototype={setFrame:function(a,c){var d=this.board;this.pieceSets&&(d?(d.removeActor(this),this.pieces=this.pieceSets[a][c],d.addActor(this)):
this.pieces=this.pieceSets[a][c])},_getMaxFrame:function(a){var c=0,a=a||[];a.forEach(function(a){a.forEach(function(a){a>c&&(c=a)})});return c+1},_createPiecesFromImagehorizontal:function(){var a=this.framesConfig.offset||L7.p(0,0),c=[],d=this.framesConfig.src.width,e=this._getMaxFrame(this.framesConfig.sets),f=document.createElement("canvas").getContext("2d");if("horizontal"===this.framesConfig.flip)f.translate(d,0),f.scale(-1,1),a=L7.p(d-a.x-this.framesConfig.width*e,a.y);else if(this.framesConfig.flip)throw Error("can only flip horizontally so far");
f.drawImage(this.framesConfig.src,0,0);f.restore();for(var d=this.framesConfig.anchor,e=e*this.framesConfig.width,g=0;g<e;g+=this.framesConfig.width){for(var i=f.getImageData(g+a.x,0+a.y,this.framesConfig.width,this.framesConfig.height),k=[],j=0;j<i.data.length;j+=4){var h=i.data[j+3]/255;if(h){var l=j,l=l/4,l=L7.p(l%this.framesConfig.width,Math.floor(l/this.framesConfig.width)).delta(d),h=new L7.Piece({anchorDelta:l,color:[i.data[j],i.data[j+1],i.data[j+2],h],owner:this,scale:_.isNumber(this.scale)?
this.scale:1});k.push(h)}}c.push(k)}return c},_initFrames:function(){var a=this["_createPiecesFromImage"+this.framesConfig.direction]();this.pieceSets=[];this.framesConfig.sets.forEach(function(c){for(var d=[],e=0;e<c.length;++e)d.push(a[c[e]]);this.pieceSets.push(d)},this);return this.pieceSets[this.framesConfig.initialSet][this.framesConfig.initialFrame]},getAnimationTargets:function(a){return a?this.pieces.filter(a):this.pieces},clicked:function(){this.fireEvent("click",this)},_getAnchorOffset:function(){var a,
c;for(c=0;c<this.shape.length;++c)for(a=0;a<this.shape[c].length;++a)if(this.shape[c][a]===L7.Actor.ANCHOR)return L7.p(a,c);throw Error("shape specified but lacks an anchor");},_getColor:function(a,c){return!this.color?void 0:_.isNumber(this.color[0])?this.color.slice(0):this.color[c][a].slice(0)},_createPieces:function(){for(var a=[],c=this._getAnchorOffset(),d=0;d<this.shape.length;++d)for(var e=this.shape[d],f=0;f<e.length;++f)if(this.shape[d][f]){var g=L7.p(f,d).delta(c),i=this._getColor(f,d),
g=new L7.Piece({anchorDelta:g,color:i,owner:this,scale:_.isNumber(this.scale)?this.scale:1});a.push(g)}return a},_getPiecePositionsAnchoredAt:function(a){var c=a.delta(this.position),d=[];_.each(this.pieces,function(a){d.push(this.position.add(c).add(a.anchorDelta))},this);return d},left:function(a){this.goTo(this.position.add(-a,0))},right:function(a){this.goTo(this.position.add(a,0))},up:function(a){this.goTo(this.position.add(0,-a))},down:function(a){this.goTo(this.position.add(0,a))},goBack:function(){this.goTo(this._lastPosition.clone())},
goTo:function(a){if(!this.onGoTo||this.onGoTo(this._getPiecePositionsAnchoredAt(this.position),this._getPiecePositionsAnchoredAt(a),this.board))!this.smoothMovement&&this.board?this.board.moveActor({actor:this,from:this.position,to:a}):this._nextPosition=a},die:function(a){this.board&&(this.ani.die(),this.board.removeActor(this));this.dead=!0;a||this.fireEvent("dead",this)},update:function(b,c){this._updateKeyInputs(b,c);this._updateTimers(b);this._lastTimestamp=c;if(this.smoothMovement&&this._nextPosition){this._offsetElapsed+=
b;this._offsetElapsed>=this.rate&&(this._offsetElapsed-=this.rate,this.board.moveActor({actor:this,from:this.position,to:this._nextPosition}),this.onSmoothMovement&&this.onSmoothMovement());var d=a,e=this._offsetElapsed/this.rate,f=this._nextPosition.delta(this.position),d={x:e*f.x,y:e*f.y};this.pieces.forEach(function(a){a.offset=d})}},_updateKeyInputs:function(a){var c=!1;_(this.keyInputs).each(function(d,e){if(d.repeat&&L7.Keys.down(e)||L7.Keys.downSince(e,this._lastTimestamp||0)){if(c=!0,d._elapsed=
d._elapsed||0,d._elapsed+=a,"undefined"===typeof d.enabled||d.enabled.call(this))if(!d.rate||d._elapsed>d.rate)d.handler.call(this,a),d._elapsed-=d.rate||0}else d._elapsed=0},this);if(!c&&this.onNoKeyDown)this.onNoKeyDown(a)},_updateTimers:function(a){this.timers&&_.each(this.timers,function(c){if("undefined"===typeof c.enabled||!0===c.enabled||"function"===typeof c.enabled&&c.enabled.call(this))c.elapsed=c.elapsed||0,c.elapsed+=a,c.elapsed>=c.interval&&(c.elapsed-=c.interval,c.handler.call(this))},
this)},pieceAt:function(a,c){var d,e;_.isNumber(a)?(d=a,e=c):(d=a.x,e=a.y);for(var f=this.pieces.length,g;f--;){g=this.pieces[f];var i=this.position.add(g.anchorDelta);if(i.x===d&&i.y===e)return g}}};Object.defineProperty(L7.Actor,"ANCHOR",{get:function(){return 5},enumerable:!1});Object.defineProperty(L7.Actor.prototype,"board",{get:function(){return this._board},set:function(a){var c=this._board;if((this._board=a)&&a!=c&&this.onBoardSet)this.onBoardSet()},enumerable:!0})})();
(function(){L7.Board=function(a){_.extend(this,a||{});_.extend(this,L7.Observable);L7.useWebGL?_.extend(L7.Board.prototype,L7.WebGLBoardRenderMixin):_.extend(L7.Board.prototype,L7.CanvasBoardRenderMixin);this.ani=new L7.AnimationFactory(this,this);this.size=new L7.Pair(this.width||0,this.height||0);this.borderWidth=this.borderWidth||0;this.tileSize=this.tileSize||0;this.freezeDuration=0;this._rows=[];this.tiles=[];for(a=0;a<this.height;++a){for(var b=[],c=0;c<this.width;++c){var d=new L7.Tile({x:c,
y:a,board:this});d.color=_.clone(this.defaultTileColor);b.push(d);this.tiles.push(d)}this._rows.push(b)}this.actors=[];this.freeActors=[];this.daemons=[];this.viewportWidth=Math.min(this.viewportWidth||this.width,this.width);this.viewportHeight=Math.min(this.viewportHeight||this.height,this.height);this.viewportAnchorX=this.viewportAnchor&&this.viewportAnchor.x||0;this.viewportAnchorY=this.viewportAnchor&&this.viewportAnchor.y||0;delete this.viewportAnchor;this._hitManager=new L7.HitManager};L7.Board.prototype=
{clicked:function(a){return(a=this.tileAtPixels(a))&&0<a.inhabitants.length?(a.inhabitants.last.owner.clicked(),!0):!1},dump:function(){console.log("");console.log("");this._rows.forEach(function(a){var b="";a.forEach(function(a){b=a.getColor()?a.inhabitants.length?b+"a":b+"t":b+"."});console.log(b)})},actorsOnTeam:function(a){return this.actors.filter(function(b){return b.team===a})},tilesTagged:function(a){return this.tiles.filter(function(b){return b.tag===a})},getAnimationTargets:function(a){return"tiles"===
a?this.tiles:"actors"===a?this.actors:"board"===a?[this]:_.isArray(a)?a:this.tiles},destroy:function(){},_clamp:function(a,b,c){return a<b?b:a>=c?c:a},_tileToPixels:function(a){return(this.tileSize+this.borderWidth)*a},scrollCenterOn:function(a){var b=this._tileToPixels(a.x)+this.tileSize/2,a=this._tileToPixels(a.y)+this.tileSize/2;this.viewport.centerOn(b,a)},scrollY:function(a){this.viewport&&this.viewport.scrollY(this._tileToPixels(a))},scrollX:function(a){this.viewport&&this.viewport.scrollX(this._tileToPixels(a))},
scrollXY:function(a,b){this.scrollX(a);this.scrollY(b)},column:function(a){0>a&&(a=this.width+a);for(var b=[],c=0;c<this.height;++c)b.push(this.tileAt(L7.p(a,c)));return b},row:function(a){var b=[];_.each(arguments,function(a){0>a&&(a=this.height+a);for(var d=0;d<this.width;++d)b.push(this.tileAt(L7.p(d,a)))},this);return b},rect:function(a,b,c,d){for(var e=[],f=b;f<b+d;++f)for(var g=a;g<a+c;++g)e.push(this.tileAt(g,f));return e},query:function(a){var b=[];this.tiles.forEach(function(c){a(c)&&b.push(c)});
return b},tileAt:function(a,b){var c=_.isObject(a)?a.x:a,d=_.isNumber(b)?b:a.y;return 0>d||d>=this.height||0>c||c>=this.width?null:this.tiles[d*this.width+c]},tileAtPixels:function(a,b){var c=_.isObject(a)?a.x:a,d=_.isNumber(b)?b:a.y;return this.tileAt(Math.floor((c+(this.offsetX||0))/(this.tileSize+this.borderWidth)),Math.floor((d+(this.offsetY||0))/(this.tileSize+this.borderWidth)))},pixelsForTile:function(a){return L7.p(this._tileToPixels(a.x),this._tileToPixels(a.y))},tileTopInPixels:function(a){return this._tileToPixels(a.y)},
tileBottomInPixels:function(a){return this.tileTopInPixels(a)+this.tileSize},each:function(a,b){this.tiles.forEach(a,b)},_addPieces:function(a){a.forEach(function(a){var c=this.tileAt(a.position);c&&c.add(a)},this)},removePieces:function(a){a.forEach(function(a){var c=this.tileAt(a.position);c&&c.remove(a)},this)},promote:function(a){a.pieces&&(this.removePieces(a.pieces),this._addPieces(a.pieces))},addActors:function(a){_.toArray(arguments).forEach(function(a){this.addActor(a)},this)},addActor:function(a){a.pieces&&
this._addPieces(a.pieces);this.actors.push(a);a.board=this},hasActor:function(a){return-1<this.actors.indexOf(a)},addFreeActor:function(a){this.freeActors.push(a);a.board=this},removeFreeActor:function(a){this.freeActors.remove(a);delete a.board},removeActor:function(a){a.pieces&&this.removePieces(a.pieces);this.actors.remove(a)},addDaemon:function(a){this.daemons.push(a)},removeDaemon:function(a){if(-1<this.daemons.indexOf(a)&&a.onRemove)a.onRemove(this);this.daemons.remove(a)},isOutOfBounds:function(a){for(var b=
0,c=a.pieces.length;b<c;++b){var d=a.pieces[b].position;if(0>d.x||0>d.y||d.x>=this.width||d.y>=this.height)return!0}return!1},_movePiece:function(a,b){var c=a.position,d=a.position.add(b);(c=this.tileAt(c))&&c.remove(a);(d=this.tileAt(d))&&d.add(a)},movePiece:function(a){this._movePiece(a.piece,a.delta||a.to.delta(a.from))},moveActor:function(a){var b=a.delta||a.to.delta(a.from);a.actor.pieces.forEach(function(a){this._movePiece(a,b)},this);a.actor._lastPosition=a.actor.position;a.actor.position=
a.actor.position.add(b);a.actor.onOutOfBounds&&this.isOutOfBounds(a.actor)&&a.actor.onOutOfBounds.call(a.actor)},freezeFor:function(a,b){this.freezeDuration=a;this.freezeCallback=b},_handleFreeze:function(a){if(0<this.freezeDuration)if(this.freezeDuration-=a,0>=this.freezeDuration)this.freezeDuration=0,this.freezeCallback&&this.freezeCallback();else return!1;return!0},update:function(a,b){if(!this.freezeDuration||this._handleFreeze(a))this.actors.forEach(function(c){c.update(a,b)}),this.freeActors.forEach(function(c){c.update(a,
b)}),this.daemons.forEach(function(c){c.update(a,b,this)},this),this.detectHits&&this._hitManager.detectHits(this.tiles)}};Object.defineProperty(L7.Board.prototype,"pixelHeight",{get:function(){return this.height*(this.tileSize+this.borderWidth)+this.borderWidth},enumerable:!0});Object.defineProperty(L7.Board.prototype,"pixelWidth",{get:function(){return this.width*(this.tileSize+this.borderWidth)+this.borderWidth},enumerable:!0})})();
L7.CanvasBoardRenderMixin={render:function(a,b,c,d){this.angle&&(b.save(),b.rotate(this.angle));var c=c+(this.offsetX||0),d=d+(this.offsetY||0),e=this.borderWidth,a=this.tileSize,f=d/(a+e)|0,g=-d%(a+e),i,k=Math.min(this._rows.length,Math.ceil((d+b.canvas.height)/(a+e))),j=c/(a+e)|0,h=-c%(a+e),l,o=Math.min(this._rows[0].length,Math.ceil((c+b.canvas.width)/(a+e))),n,m,p,r=[];for(i=f;i<k;++i)if(0<=i){p=this._rows[i];for(l=j;l<o;++l)if(0<=l&&(n=p[l],m=n.getColor())){var s=n.getScale();_.isNumber(s)||
(s=1);var q=n.getOffset();if(1!==s||q&&(q.x||q.y))r.push(n),m=n.getColor(!0),s=1;m&&(this.borderFill&&(b.fillStyle=this.borderFill,b.fillRect((l-j)*(a+e)+h,(i-f)*(a+e)+g,a+2*e,e),b.fillRect((l-j)*(a+e)+h,(i-f)*(a+e)+g+a+e,a+2*e,e),b.fillRect((l-j)*(a+e)+h,(i-f)*(a+e)+g,e,a+2*e),b.fillRect((l-j)*(a+e)+h+a+e,(i-f)*(a+e)+g,e,a+2*e)),b.fillStyle=L7.Color.toCssString(m),m=Math.round(a*s),q=a/2-m/2,b.fillRect((l-j)*(a+e)+e+q+h,(i-f)*(a+e)+e+q+g,m,m))}}r.sort(function(a,b){return a.scale-b.scale});for(i=
0;i<r.length;++i)if(n=r[i],s=n.getScale(),_.isNumber(s)||(s=1),m=n.getColor())b.fillStyle=L7.Color.toCssString(m),m=a*s|0,q=n.getOffset(),l=k=0,q&&(k=a*q.x|0,l=a*q.y|0),q=a/2-m/2,b.fillRect((n.x-j)*(a+e)+e+q+h+k,(n.y-f)*(a+e)+e+q+g+l,m,m);for(i=0;i<this.freeActors.length;++i)if(e=this.freeActors[i],m=L7.Color.toCssString(e.color))b.fillStyle=m,b.fillRect(e.position.x-c,e.position.y-d,a,a);this.angle&&b.restore()}};
(function(){L7.HitManager=function(){};L7.HitManager.prototype={detectHitsForActor:function(a){for(var b=a.pieces.length;b--;){var c=a.board.tileAt(a.pieces[b].position);c&&this._detectTileHits(c)}},detectHits:function(a){a.forEach(function(a){this._detectTileHits(a)},this)},_detectTileHits:function(a){a.each(function(b){_.isObject(b.owner)&&_.isObject(b.owner.hitDetection)&&("undefined"===typeof b.owner.hitDetection.enabled||b.owner.hitDetection.enabled.call(b.owner))&&_.each(b.owner.hitDetection,
function(c,d){a.tag===d&&c.call(b.owner,a,a);a.each(function(e){e!==b&&e.owner&&e.owner.team===d&&c.call(b.owner,a,e.owner)},this)},this)},this)}}})();
(function(){L7.ParallaxBoard=function(a){_.extend(this,a);this.boards=this.boards||[];this.boards.forEach(function(a,c){a.parallaxRatio=a.parallaxRatio||0;_.isNumber(a.depth)||(a.depth=c)},this)};L7.ParallaxBoard.prototype={update:function(){var a=_.toArray(arguments);this.boards.forEach(function(b){b.update.apply(b,a)})},render:function(a,b,c,d,e){this.boards.forEach(function(f){!1!==f.visible&&f.render(a,b,c*f.parallaxRatio,d*f.parallaxRatio,e)})},clicked:function(a){for(var b=this.boards.length;b--&&
!this.boards[b].clicked(a););}};Object.defineProperty(L7.ParallaxBoard.prototype,"viewport",{get:function(){return this.viewport},set:function(a){this.boards.forEach(function(b){b.viewport=a})},enumerable:!0});Object.defineProperty(L7.ParallaxBoard.prototype,"game",{get:function(){return this.game},set:function(a){this.boards.forEach(function(b){b.game=a})},enumerable:!0})})();
(function(){L7.Piece=function(a){_.extend(this,a||{})};Object.defineProperty(L7.Piece.prototype,"position",{get:function(){if(this.owner)return this.owner.position.add(this.anchorDelta)},enumerable:!0})})();
(function(){L7.SingleInhabitantTile=function(a){a=a||{};if(!_.isNumber(a.x))throw Error("Tile: x is required");if(!_.isNumber(a.y))throw Error("Tile: y is required");this.x=a.x;this.y=a.y;this.color=a.color;this.scale=a.scale;_.isNumber(this.scale)||(this.scale=1);this.board=a.board;this.inhabitant=_.isArray(a.inhabitants)?a.inhabitants[0]:null;this.position=L7.p(this.x,this.y);this.colors=[];this.composite=[]};L7.SingleInhabitantTile.prototype={at:function(){return this.inhabitant},each:function(a,
b){this.inhabitant&&a.call(b,this.inhabitant)},add:function(a){this.inhabitant=a},remove:function(a){this.inhabitant===a&&(this.inhabitant=null)},has:function(a){return this.tag===a?!0:this.inhabitant&&this.inhabitant.team===a},hasOther:function(){throw Error("not implemented");},getColor:function(a){var b=0;this.color&&(this.colors[b++]=this.color);!1!==a&&this.inhabitant&&this.inhabitant.color&&(this.colors[b++]=this.inhabitant.color);this.overlayColor&&(this.colors[b++]=this.overlayColor);if(this.colors[b-
1]&&1===this.colors[b-1][3])return this.colors[b-1];if(0<b)return L7.Color.composite(this.colors,b,this.composite),this.opaque&&(this.composite[3]=1),this.composite},getScale:function(){return this.inhabitant&&this.inhabitant.color&&this.inhabitant.scale||this.scale},getOffset:function(){return this.inhabitant&&this.inhabitant.offset},up:function(){return this.board&&this.board.tileAt(this.position.up())},down:function(){return this.board&&this.board.tileAt(this.position.down())},left:function(){return this.board&&
this.board.tileAt(this.position.left())},right:function(){return this.board&&this.board.tileAt(this.position.right())}};Object.defineProperty(L7.SingleInhabitantTile.prototype,"count",{get:function(){return this.inhabitant?1:0},enumerable:!0})})();
(function(){L7.StoryBoard=function(a){this.boardConfigs=a;this._setCurrentBoard(0);if(L7.global.location&&L7.global.location.hostname&&-1<L7.global.location.hostname.indexOf("localhost")){var b=this;window.nb=function(){b._setNextBoard()};window.pb=function(){b._setPreviousBoard()}}};L7.StoryBoard.prototype={_setCurrentBoard:function(a){this._currentBoardConfig&&this._currentBoardConfig.board&&this._currentBoardConfig.board.destroy&&this._currentBoardConfig.board.destroy();this._currentBoardIndex=
a;if(a=this.boardConfigs[a]){this._currentBoardConfig=a;var b=this._currentBoardConfig.board;this.width=b.width;this.height=b.height;this.tileSize=b.tileSize;this.borderWidth=b.borderWidth;this._currentDuration=a.duration;b.viewport=this.viewport;b.game=this.game}},_setNextBoard:function(){this._setCurrentBoard(this._currentBoardIndex+1)},_setPreviousBoard:function(){this._setCurrentBoard(this._currentBoardIndex-1)},update:function(a,b){this._currentBoardConfig&&(this._currentBoardConfig.board.update(a,
b),this._currentDuration-=a,0>=this._currentDuration&&this._setNextBoard())},render:function(){this._currentBoardConfig&&this._currentBoardConfig.board.render.apply(this._currentBoardConfig.board,arguments)},clicked:function(){this._currentBoardConfig&&this._currentBoardConfig.board.clicked.apply(this._currentBoardConfig.board,arguments)}};Object.defineProperty(L7.StoryBoard.prototype,"pixelHeight",{get:function(){return this.height*(this.tileSize+this.borderWidth)+this.borderWidth},enumerable:!0});
Object.defineProperty(L7.StoryBoard.prototype,"pixelWidth",{get:function(){return this.width*(this.tileSize+this.borderWidth)+this.borderWidth},enumerable:!0});Object.defineProperty(L7.StoryBoard.prototype,"viewport",{get:function(){return this._viewport},set:function(a){this._viewport=a;this._currentBoardConfig&&(this._currentBoardConfig.board.viewport=a)}});Object.defineProperty(L7.StoryBoard.prototype,"game",{get:function(){return this._game},set:function(a){this._game=a;this._currentBoardConfig&&
(this._currentBoardConfig.board.game=a)}})})();
(function(){L7.Tile=function(a){a=a||{};if(!_.isNumber(a.x))throw Error("Tile: x is required");if(!_.isNumber(a.y))throw Error("Tile: y is required");this.x=a.x;this.y=a.y;this.color=a.color;this.scale=a.scale;_.isNumber(this.scale)||(this.scale=1);this.board=a.board;this.inhabitants=_.clone(a.inhabitants||[]);this.position=L7.p(this.x,this.y);this.colors=[];this.composite=[]};L7.Tile.prototype={at:function(a){return this.inhabitants[a]},each:function(a,b){this.inhabitants.forEach(a,b)},add:function(a){this.inhabitants.push(a)},
remove:function(a){this.inhabitants.remove(a)},has:function(a){return this.tag===a?!0:this.inhabitants.some(function(b){return b.team===a||b.owner&&b.owner.team===a})},hasOther:function(a,b){return this.tag===a?!0:this.inhabitants.some(function(c){return c.team===a||c.owner&&c.owner.team===a&&c.owner!==b})},getColor:function(a){var b=0;this.color&&(this.colors[b++]=this.color);if(!1!==a)for(var a=0,c=this.inhabitants.length;a<c;++a){var d=this.inhabitants[a].color;d&&(this.colors[b++]=d)}this.overlayColor&&
(this.colors[b++]=this.overlayColor);if(this.colors[b-1]&&1===this.colors[b-1][3])return this.colors[b-1];if(0<b)return L7.Color.composite(this.colors,b,this.composite),this.opaque&&(this.composite[3]=1),this.composite},getScale:function(){return 0===this.inhabitants.length||!this.inhabitants.last.color?this.scale:this.inhabitants.last.scale},getOffset:function(){return 0!==this.inhabitants.length&&this.inhabitants.last.offset},up:function(){return this.board&&this.board.tileAt(this.position.up())},
down:function(){return this.board&&this.board.tileAt(this.position.down())},left:function(){return this.board&&this.board.tileAt(this.position.left())},right:function(){return this.board&&this.board.tileAt(this.position.right())}};Object.defineProperty(L7.Tile.prototype,"count",{get:function(){return this.inhabitants.length},enumerable:!0})})();
(function(){var a=[0,0,0,0],b={x:0,y:0};L7.WebGLBoardRenderMixin={render:function(a,b,e,f){this.squareVertexPositionBuffer||this._glInit(b);var a=e%(this.tileSize+this.borderWidth)+(this.offsetX||0),g=f%(this.tileSize+this.borderWidth)+(this.offsetY||0);mat4.identity(this.mvMatrix);mat4.translate(this.mvMatrix,[-a,-g,0]);b.uniformMatrix4fv(b.mvMatrixUniform,!1,this.mvMatrix);b.bindBuffer(b.ARRAY_BUFFER,this.squareVertexPositionBuffer);b.vertexAttribPointer(b.vertexPositionAttribute,this.squareVertexPositionBuffer.itemSize,
b.FLOAT,!1,0,0);b.bindBuffer(b.ARRAY_BUFFER,this.centerVertexPositionBuffer);b.vertexAttribPointer(b.centerPositionAttribute,this.centerVertexPositionBuffer.itemSize,b.FLOAT,!1,0,0);this._glSetTiles(b,e,f);b.drawArrays(b.TRIANGLES,0,this.squareVertexPositionBuffer.numItems)},_glInit:function(a){this.mvMatrix=mat4.create();this._glInitBuffer(a)},_glInitBuffer:function(a){function b(a,c,d){h[f++]=a;h[f++]=c;h[f++]=i;h[f++]=a+d;h[f++]=c;h[f++]=i;h[f++]=a+d;h[f++]=c+d;h[f++]=i;h[f++]=a;h[f++]=c;h[f++]=
i;h[f++]=a+d;h[f++]=c+d;h[f++]=i;h[f++]=a;h[f++]=c+d;h[f++]=i}function e(a,b,c,d){var e=c+2*d;h[f++]=a;h[f++]=b;h[f++]=i;h[f++]=a+e;h[f++]=b;h[f++]=i;h[f++]=a+e;h[f++]=b+d;h[f++]=i;h[f++]=a;h[f++]=b;h[f++]=i;h[f++]=a+e;h[f++]=b+d;h[f++]=i;h[f++]=a;h[f++]=b+d;h[f++]=i;var g=a+d+c;h[f++]=g;h[f++]=b;h[f++]=i;h[f++]=g+d;h[f++]=b;h[f++]=i;h[f++]=g+d;h[f++]=b+e;h[f++]=i;h[f++]=g;h[f++]=b;h[f++]=i;h[f++]=g+d;h[f++]=b+e;h[f++]=i;h[f++]=g;h[f++]=b+e;h[f++]=i;c=b+d+c;h[f++]=a;h[f++]=c;h[f++]=i;h[f++]=a+e;h[f++]=
c;h[f++]=i;h[f++]=a+e;h[f++]=c+d;h[f++]=i;h[f++]=a;h[f++]=c;h[f++]=i;h[f++]=a+e;h[f++]=c+d;h[f++]=i;h[f++]=a;h[f++]=c+d;h[f++]=i;h[f++]=a;h[f++]=b;h[f++]=i;h[f++]=a+d;h[f++]=b;h[f++]=i;h[f++]=a+d;h[f++]=b+e;h[f++]=i;h[f++]=a;h[f++]=b;h[f++]=i;h[f++]=a+d;h[f++]=b+e;h[f++]=i;h[f++]=a;h[f++]=b+e;h[f++]=i}this.squareVertexPositionBuffer=a.createBuffer();this.squareVertexPositionBuffer.itemSize=3;this.centerVertexPositionBuffer=a.createBuffer();this.centerVertexPositionBuffer.itemSize=2;a.bindBuffer(a.ARRAY_BUFFER,
this.squareVertexPositionBuffer);this.verticesPerTile=0<this.borderWidth?30:6;var f=0,g=0,i=this.depth||0,k=this.tileSize,j=this.borderWidth;this.vboWidth=Math.ceil(Math.min(this.width,this.viewport.width/(k+j)+1));this.vboHeight=Math.ceil(Math.min(this.height,this.viewport.height/(k+j)+1));for(var h=new Float32Array(this.vboWidth*this.vboHeight*this.squareVertexPositionBuffer.itemSize*this.verticesPerTile),l=new Float32Array(this.vboWidth*this.vboHeight*this.centerVertexPositionBuffer.itemSize*this.verticesPerTile),
o=0;o<this.vboHeight;++o)for(var n=0;n<this.vboWidth;++n){var m=n*(k+j)+j,p=o*(k+j)+j;0<this.borderWidth&&e(m-j,p-j,k,j);b(m,p,k);for(var r=0;r<this.verticesPerTile;++r)l[g++]=m+k/2,l[g++]=p+k/2}a.bufferData(a.ARRAY_BUFFER,h,a.STATIC_DRAW);this.squareVertexPositionBuffer.numItems=h.length/this.squareVertexPositionBuffer.itemSize;a.bindBuffer(a.ARRAY_BUFFER,this.centerVertexPositionBuffer);a.bufferData(a.ARRAY_BUFFER,l,a.STATIC_DRAW);this.colorOffsetsBuffer=a.createBuffer();this.colorOffsetsBuffer.itemSize=
6;this.colorOffsetsData=new Float32Array(this.vboWidth*this.vboHeight*this.verticesPerTile*this.colorOffsetsBuffer.itemSize);a.bindBuffer(a.ARRAY_BUFFER,this.colorOffsetsBuffer);a.bufferData(a.ARRAY_BUFFER,this.colorOffsetsData,a.DYNAMIC_DRAW)},_getTileShaderOffsetX:function(a,b,e){return 0===a||3===a||5===a?-2*(b-e)+1:2*(b+e)+1},_getTileShaderOffsetY:function(a,b,e){return 0===a||3===a||1===a?-2*(b-e)+1:2*(b+e)+1},_getBorderShaderOffsetX:function(a,b,e){return 6===a||9===a||11===a?2*(b+e)+1:18===
a||21==a||23===a?-2*(b-e)+1:1},_getBorderShaderOffsetY:function(a,b,e){return 5===a||2===a||4===a?-2*(b-e)+1:12===a||15===a||13===a?2*(b+e)+1:1},_glSetTiles:function(c,d,e){var f=this.borderWidth,g=this.tileSize,e=e/(g+f)|0,f=d/(g+f)|0,i,k,j,h,l,o,n,m,p,g=0;this.standardBorderColor=this.standardBorderColor||(this.borderFill?L7.Color.toArray(this.borderFill):a);this.colorOffsetsData=this.colorOffsetsData||new Float32Array(this.vboWidth*this.vboHeight*this.verticesPerTile*this.colorOffsetsBuffer.itemSize);
c.bindBuffer(c.ARRAY_BUFFER,this.colorOffsetsBuffer);for(d=e,e+=this.vboHeight;d<e;++d)if(0<=d&&d<this.height){p=this._rows[d];for(i=f,k=f+this.vboWidth;i<k;++i)if(0<=i&&i<this.width){j=p[i];h=j.getColor()||a;o=j.getOffset()||b;n=o.x;m=o.y;l=j.getScale();o=(l-1)/2;if(0<this.borderWidth){j=n||m||1!=l?j.color||a:h[3]?this.standardBorderColor:a;for(l=0;24>l;++l)this.colorOffsetsData[g++]=j[0]/255,this.colorOffsetsData[g++]=j[1]/255,this.colorOffsetsData[g++]=j[2]/255,this.colorOffsetsData[g++]=j[3],
this.colorOffsetsData[g++]=this._getBorderShaderOffsetX(l,n,o),this.colorOffsetsData[g++]=this._getBorderShaderOffsetY(l,m,o)}for(j=0;6>j;++j)this.colorOffsetsData[g++]=h[0]/255,this.colorOffsetsData[g++]=h[1]/255,this.colorOffsetsData[g++]=h[2]/255,this.colorOffsetsData[g++]=h[3],this.colorOffsetsData[g++]=this._getTileShaderOffsetX(j,n,o),this.colorOffsetsData[g++]=this._getTileShaderOffsetY(j,m,o)}else for(h=0;h<6*this.verticesPerTile;++h)this.colorOffsetsData[g++]=0}else for(h=0;h<6*this.verticesPerTile*
this.vboWidth;++h)this.colorOffsetsData[g++]=0;c.bufferSubData(c.ARRAY_BUFFER,0,this.colorOffsetsData);c.vertexAttribPointer(c.vertexColorAttribute,4,c.FLOAT,!1,4*this.colorOffsetsBuffer.itemSize,0);c.vertexAttribPointer(c.offsetsAttribute,2,c.FLOAT,!1,4*this.colorOffsetsBuffer.itemSize,16)}}})();
(function(){function a(a){var a=a.substring(1),b=a.substring(0,2),e=a.substring(2,4),a=a.substring(4,6);return result=[parseInt(b,16),parseInt(e,16),parseInt(a,16),1]}L7.Color={toCssString:function(a){return 3===a.length?"rgb("+Math.round(a[0])+","+Math.round(a[1])+","+Math.round(a[2])+")":"rgba("+Math.round(a[0])+","+Math.round(a[1])+","+Math.round(a[2])+","+a[3]+")"},isBuiltInString:function(a){return"string"!==typeof a?!1:b.hasOwnProperty(a.toLowerCase())},isHexString:function(a){if("string"!==
typeof a||"#"!==a[0]||7!==a.length)return!1;for(var a=a.toUpperCase(),b=1,e=a.length;b<e;++b){var f=a[b];if("0">f||"F"<f)return!1}return!0},isOpaque:function(a){return this.isHexString(a)||this.isBuiltInString(a)?!0:(a=this.toArray(a))&&1===a[3]},isRgbString:function(a){return"string"!==typeof a||10>a.length||0!==a.indexOf("rgb")||")"!==a[a.length-1]||"("!==a[3]&&"("!==a[4]?!1:!0},toArray:function(c){if(_.isArray(c)&&4===c.length)return c;if(this.isHexString(c))return a(c);if(this.isBuiltInString(c))return a(b[c]);
if(this.isRgbString(c)){for(var d=c.indexOf("("),e=[],c=c.substring(d+1).split(","),d=0,f=c.length;d<f;++d)e.push(parseFloat(c[d]));3===e.length&&e.push(1);return e}},fromArrayToHex:function(a,b){for(var e="#",f=b&&b.includeAlpha&&4===a.length?4:3,g=0;g<f;++g){var i=a[g].toString(16);2>i.length&&(i="0"+i);e+=i}return e.toUpperCase()},composite:function(a,b,e){e[0]=e[1]=e[2]=e[3]=1;for(var f=0;f<b;++f){var g=e,i=a[f],k=i[3],j=g[3],h=1-k,l=void 0,o=void 0;for(l=0,o=g.length-1;l<o;++l)g[l]=Math.round(i[l]*
k+g[l]*j*h);g[3]=(g[3]+i[3])/2}},fromFloats:function(a,b,e,f){return[Math.round(255*a),Math.round(255*b),Math.round(255*e),f]}};var b={aliceblue:"#F0F8FF",antiquewhite:"#FAEBD7",aqua:"#00FFFF",aquamarine:"#7FFFD4",azure:"#F0FFFF",beige:"#F5F5DC",bisque:"#FFE4C4",black:"#000000",blanchedalmond:"#FFEBCD",blue:"#0000FF",blueviolet:"#8A2BE2",brown:"#A52A2A",burlywood:"#DEB887",cadetblue:"#5F9EA0",chartreuse:"#7FFF00",chocolate:"#D2691E",coral:"#FF7F50",cornflowerblue:"#6495ED",cornsilk:"#FFF8DC",crimson:"#DC143C",
cyan:"#00FFFF",darkblue:"#00008B",darkcyan:"#008B8B",darkgoldenrod:"#B8860B",darkgray:"#A9A9A9",darkgrey:"#A9A9A9",darkgreen:"#006400",darkkhaki:"#BDB76B",darkmagenta:"#8B008B",darkolivegreen:"#556B2F",darkorange:"#FF8C00",darkorchid:"#9932CC",darkred:"#8B0000",darksalmon:"#E9967A",darkseagreen:"#8FBC8F",darkslateblue:"#483D8B",darkslategray:"#2F4F4F",darkslategrey:"#2F4F4F",darkturquoise:"#00CED1",darkviolet:"#9400D3",deeppink:"#FF1493",deepskyblue:"#00BFFF",dimgray:"#696969",dimgrey:"#696969",dodgerblue:"#1E90FF",
firebrick:"#B22222",floralwhite:"#FFFAF0",forestgreen:"#228B22",fuchsia:"#FF00FF",gainsboro:"#DCDCDC",ghostwhite:"#F8F8FF",gold:"#FFD700",goldenrod:"#DAA520",gray:"#808080",grey:"#808080",green:"#008000",greenyellow:"#ADFF2F",honeydew:"#F0FFF0",hotpink:"#FF69B4",indianred:"#CD5C5C",indigo:"#4B0082",ivory:"#FFFFF0",khaki:"#F0E68C",lavender:"#E6E6FA",lavenderblush:"#FFF0F5",lawngreen:"#7CFC00",lemonchiffon:"#FFFACD",lightblue:"#ADD8E6",lightcoral:"#F08080",lightcyan:"#E0FFFF",lightgoldenrodyellow:"#FAFAD2",
lightgray:"#D3D3D3",lightgrey:"#D3D3D3",lightgreen:"#90EE90",lightpink:"#FFB6C1",lightsalmon:"#FFA07A",lightseagreen:"#20B2AA",lightskyblue:"#87CEFA",lightslategray:"#778899",lightslategrey:"#778899",lightsteelblue:"#B0C4DE",lightyellow:"#FFFFE0",lime:"#00FF00",limegreen:"#32CD32",linen:"#FAF0E6",magenta:"#FF00FF",maroon:"#800000",mediumaquamarine:"#66CDAA",mediumblue:"#0000CD",mediumorchid:"#BA55D3",mediumpurple:"#9370D8",mediumseagreen:"#3CB371",mediumslateblue:"#7B68EE",mediumspringgreen:"#00FA9A",
mediumturquoise:"#48D1CC",mediumvioletred:"#C71585",midnightblue:"#191970",mintcream:"#F5FFFA",mistyrose:"#FFE4E1",moccasin:"#FFE4B5",navajowhite:"#FFDEAD",navy:"#000080",oldlace:"#FDF5E6",olive:"#808000",olivedrab:"#6B8E23",orange:"#FFA500",orangered:"#FF4500",orchid:"#DA70D6",palegoldenrod:"#EEE8AA",palegreen:"#98FB98",paleturquoise:"#AFEEEE",palevioletred:"#D87093",papayawhip:"#FFEFD5",peachpuff:"#FFDAB9",peru:"#CD853F",pink:"#FFC0CB",plum:"#DDA0DD",powderblue:"#B0E0E6",purple:"#800080",red:"#FF0000",
rosybrown:"#BC8F8F",royalblue:"#4169E1",saddlebrown:"#8B4513",salmon:"#FA8072",sandybrown:"#F4A460",seagreen:"#2E8B57",seashell:"#FFF5EE",sienna:"#A0522D",silver:"#C0C0C0",skyblue:"#87CEEB",slateblue:"#6A5ACD",slategray:"#708090",slategrey:"#708090",snow:"#FFFAFA",springgreen:"#00FF7F",steelblue:"#4682B4",tan:"#D2B48C",teal:"#008080",thistle:"#D8BFD8",tomato:"#FF6347",turquoise:"#40E0D0",violet:"#EE82EE",wheat:"#F5DEB3",white:"#FFFFFF",whitesmoke:"#F5F5F5",yellow:"#FFFF00",yellowgreen:"#9ACD32"}})();
(function(){L7.ColorLevelLoader=function(a,b,c,d){this.image=a;this.width=a.width;this.height=a.height;this.tileSize=b;this.borderWidth=c;this.borderFill=d||"black"};L7.ColorLevelLoader.prototype={load:function(){for(var a=new L7.Board(this),b=this._getData(),c=0;c<b.length;c+=4){var d=this._extractColor(b,c);if(0<d[3]){var e=this._getPosition(c);a.tileAt(e).color=d}}return a},_getData:function(){var a=document.createElement("canvas");a.width=this.width;a.height=this.height;a=a.getContext("2d");a.drawImage(this.image,
0,0);return a.getImageData(0,0,this.width,this.height).data},_extractColor:function(a,b){for(var c=[],d=b;d<b+4;++d)c.push(a[d]);c[3]/=255;return c},_getPosition:function(a){a=Math.floor(a/4);return L7.p(a%this.width,Math.floor(a/this.width))}}})();
(function(){L7.ImageLoader=function(a){_.extend(this,a);this.loadNow&&this.load()};L7.ImageLoader.prototype={load:function(){this._pendingCount=this.srcs.length;this._images={};var a=this;this.srcs.forEach(function(b){var c=new Image;c.onload=function(){var d=a._images,e;e=b;var f=e.lastIndexOf("."),g=e.lastIndexOf("/");-1<f&&(e=e.substring(0,f));-1<g&&(e=e.substring(g+1));e=e.replace(/[^a-zA-Z0-9]/g,"");d[e]=c;--a._pendingCount;0===a._pendingCount&&a.handler(a._images)};c.src=b})}}})();
(function(){L7.LevelLoader=function(a){_.extend(this,a);this.width=a.image.width;this.height=a.image.height};L7.LevelLoader.prototype={load:function(){for(var a=_.extend(this.boardConfig,{width:this.width,height:this.height}),b=new L7.Board(a),c={},a=this._getData(),d=0;d<a.length;d+=4){var e=this._extractColor(a,d),f=this.legend[e];if(f){var g=this._getPosition(d);if(f.hasOwnProperty("constructor")){var i=_.extend({},f.config||{},{position:g});_.isArray(f.constructor)||(f.constructor=[f.constructor]);
f.constructor.forEach(function(a){a=new a(i);c[e]=c[e]||[];c[e].push(a);b.addActor(a)})}f.tag&&(b.tileAt(g).tag=f.tag);f.color&&(b.tileAt(g).color=f.color)}}return{board:b,actors:c}},_getData:function(){var a=document.createElement("canvas");a.width=this.width;a.height=this.height;a=a.getContext("2d");a.drawImage(this.image,0,0);return a.getImageData(0,0,this.width,this.height).data},_extractColor:function(a,b){for(var c=[],d=b;d<b+3;++d)c.push(a[d]);return L7.Color.fromArrayToHex(c)},_getPosition:function(a){a=
Math.floor(a/4);return L7.p(a%this.width,Math.floor(a/this.width))}}})();(function(){L7.CanvasGameRenderer=function(a){this.viewport=a};L7.CanvasGameRenderer.prototype={init:function(a){a.style.imageRendering="-webkit-optimize-contrast"},renderFrame:function(a,b,c,d,e,f){var g=a.getContext("2d");g.clearRect(0,0,a.width,a.height);b.render(c,g,d,e,f)}}})();
(function(){var a=1E3*(1/60);window.requestAnimationFrame=window.requestAnimationFrame||window.mozRequestAnimationFrame||window.webkitRequestAnimationFrame||window.msRequestAnimationFrame||window.oRequestAnimationFrame||function(b){window.setTimeout(b,a)};L7.Game=function(a){_.extend(this,L7.Observable);a="function"!==typeof a.render&&"function"!==typeof a.update?a:{width:a.width*(a.tileSize+a.borderWidth)+a.borderWidth,height:a.height*(a.tileSize+a.borderWidth)+a.borderWidth,board:a};_.extend(this,
a);_.bindAll(this,"_doFrame");this.viewport=new L7.Viewport(this);this.board&&(this.board.viewport=this.viewport);this.container=this.container||document.body;this.clearOutContainer&&this._clearContainer(this.container);this.renderer=L7.useWebGL?new L7.WebGLGameRenderer(this.viewport):new L7.CanvasGameRenderer(this.viewport);this._createCanvas();this.renderer.init(this.canvas);L7.Keys.init(this.canvas);L7.Mouse.init(this.canvas);this.delays=[];var c=this;L7.global.addEventListener("blur",function(){delete c._lastTimestamp});
this.board&&(this.board.game=this)};L7.Game.prototype={_clearContainer:function(a){a.innerHTML=""},_createCanvas:function(){this.canvas=document.createElement("canvas");this.canvas.width=this.viewport.width;this.canvas.height=this.viewport.height;this.container.appendChild(this.canvas);var a=this;this.canvas.addEventListener("click",function(c){a._onCanvasClick(c)},!1)},go:function(){delete this._lastTimestamp;this._doFrame(Date.now())},after:function(a,c){this.delays.add({remaining:a,handler:c})},
replaceBoard:function(a){this.board&&this.board.destroy&&this.board.destroy();this.board=a;this.board.viewport=this.viewport;this.board.game=this;this.viewport.reset()},_updateDelays:function(a){var c=[];this.delays.forEach(function(d){d.remaining-=a;0>=d.remaining&&(d.handler.call(d.scope,this),c.push(d))},this);c.forEach(function(a){this.delays.remove(a)},this)},_displayFps:function(a){a=this._frameCount/((a-this._frameCountStart)/1E3);this.fpsContainer&&(this.fpsContainer.innerHTML=(a|0)+" fps")},
_updateFps:function(a){this._frameCountStart?(++this._frameCount,4E3<a-this._frameCountStart&&(this._displayFps(a),delete this._frameCountStart)):(this._frameCountStart=a,this._frameCount=1)},_doFrame:function(b){this._hasDoneFrame=!0;this._updateFps(b);var c=b-(this._lastTimestamp||b);this._lastTimestamp=b;for(var d=c;0<d;){var e=Math.min(a,d);this._updateDelays(e);this.board.update(e,b);d-=e}this.renderer.renderFrame(this.canvas,this.board,c,this.viewport.anchorX,this.viewport.anchorY,b);this.paused||
requestAnimationFrame(this._doFrame)},_onCanvasClick:function(a){this.board.clicked(L7.p((a.x||a.clientX)-a.target.offsetLeft,(a.y||a.clientY)-a.target.offsetTop))}};Object.defineProperty(L7.Game.prototype,"paused",{get:function(){return this._paused},set:function(a){var c=this._paused;(this._paused=a)?this._hasDoneFrame||this._doFrame(Date.now()):this.go();c!==a&&this.fireEvent("pausechanged",a)}})})();
(function(){L7.Keys={arrows:{37:"left",38:"up",39:"right",40:"down"},init:function(){this._hook=window;this._keyDownListener=_.bind(this._onKeyDown,this);this._hook.addEventListener("keydown",this._keyDownListener,!1);this._keyUpListener=_.bind(this._onKeyUp,this);this._hook.addEventListener("keyup",this._keyUpListener,!1);this._downKeys={}},_getCharacter:function(a){return this.arrows[a.toString()]||String.fromCharCode(a).toLowerCase()},_onKeyDown:function(a){a=this._getCharacter(a.keyCode);this._downKeys[a]||
(this._downKeys[a]=Date.now())},_onKeyUp:function(a){delete this._downKeys[this._getCharacter(a.keyCode)]},down:function(a){return void 0!==this._downKeys[a]},downSince:function(a,b){return this.down(a)&&this._downKeys[a]>b}}})();
(function(){L7.Mouse={init:function(a){this._hook=a;this._mouseMoveListener=_.bind(this._onMouseMove,this);this._hook.addEventListener("mousemove",this._mouseMoveListener,!1);this._pos=L7.p()},_onMouseMove:function(a){this._pos=L7.p(a.offsetX,a.offsetY)}};Object.defineProperty(L7.Mouse,"position",{get:function(){return this._pos},enumerable:!0})})();
(function(){L7.Viewport=function(a){a=a||{};_.extend(this,a);_.isUndefined(this.preventOverscroll)&&(this.preventOverscroll=!1);this.anchorX=a.initialAnchor&&a.initialAnchor.x||0;this.anchorY=a.initialAnchor&&a.initialAnchor.y||0;this.width=this.width||100;this.height=this.height||100};L7.Viewport.prototype={scrollY:function(a){this.anchorY+=a},scrollX:function(a){this.anchorX+=a},centerOn:function(a,b){var c=a.y||b;this.anchorX=Math.floor((a.x||a)-this.width/2);this.anchorY=Math.floor(c-this.height/
2)},reset:function(){this.anchorY=this.anchorX=0}}})();
(function(){L7.WebGLGameRenderer=function(a){this.viewport=a};L7.WebGLGameRenderer.prototype={_getShader:function(a,b){var c=this.gl.createShader(b);this.gl.shaderSource(c,a);this.gl.compileShader(c);if(!this.gl.getShaderParameter(c,this.gl.COMPILE_STATUS))throw Error(this.gl.getShaderInfoLog(c));return c},_initShaders:function(){var a=this._getShader("precision lowp float;varying vec4 vColor;void main(void) {gl_FragColor = vColor;}",this.gl.FRAGMENT_SHADER),b=this._getShader("attribute vec3 aVertexPosition;attribute vec2 aOffsets;attribute vec2 aVertexCenter;attribute vec4 aVertexColor;uniform mat4 uMVMatrix;uniform mat4 uPMatrix;varying vec4 vColor;void main(void) {float diffX = aVertexPosition.x - aVertexCenter.x;float offsetX = (aOffsets.x * diffX) - diffX;float diffY = aVertexPosition.y - aVertexCenter.y;float offsetY = (aOffsets.y * diffY) - diffY;float offsetZ = 0.0;if(offsetX != 0.0 || offsetY != 0.0) {offsetZ = 0.1;}gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition + vec3(offsetX, offsetY, offsetZ), 1.0);vColor = aVertexColor;}",
this.gl.VERTEX_SHADER),c=this.gl.createProgram();this.gl.attachShader(c,b);this.gl.attachShader(c,a);this.gl.linkProgram(c);if(!this.gl.getProgramParameter(c,this.gl.LINK_STATUS))throw Error("Could not initialise shaders");this.gl.useProgram(c);this.gl.vertexPositionAttribute=this.gl.getAttribLocation(c,"aVertexPosition");this.gl.enableVertexAttribArray(this.gl.vertexPositionAttribute);this.gl.offsetsAttribute=this.gl.getAttribLocation(c,"aOffsets");this.gl.enableVertexAttribArray(this.gl.offsetsAttribute);
this.gl.centerPositionAttribute=this.gl.getAttribLocation(c,"aVertexCenter");this.gl.enableVertexAttribArray(this.gl.centerPositionAttribute);this.gl.vertexColorAttribute=this.gl.getAttribLocation(c,"aVertexColor");this.gl.enableVertexAttribArray(this.gl.vertexColorAttribute);this.pMatrixUniform=this.gl.getUniformLocation(c,"uPMatrix");this.gl.mvMatrixUniform=this.gl.getUniformLocation(c,"uMVMatrix")},init:function(a){this.gl=a.getContext("experimental-webgl");this.gl.clearColor(0,0,0,1);this.gl.blendFunc(this.gl.SRC_ALPHA,
this.gl.ONE_MINUS_SRC_ALPHA);this.gl.enable(this.gl.BLEND);this.gl.enable(this.gl.DEPTH_TEST);this.pMatrix=mat4.create();this._initShaders()},renderFrame:function(a,b,c,d,e,f){this.gl.viewport(0,0,this.viewport.width,this.viewport.height);this.gl.clear(this.gl.COLOR_BUFFER_BIT|this.gl.DEPTH_BUFFER_BIT);mat4.ortho(0,this.viewport.width,this.viewport.height,0,-100,100,this.pMatrix);this.gl.uniformMatrix4fv(this.pMatrixUniform,!1,this.pMatrix);b.render(c,this.gl,d,e,f)}}})();
(function(){var a=Math.PI,b=2*a,c=a/2;L7.Pair=function(a,b){this._a=a||0;this._b=b||0};L7.Pair.prototype={clone:function(){return L7.p(this.x,this.y)},equals:function(a){return a?a===this||a._a===this._a&&a._b==this._b||a.x===this._a&&a.y==this._b||a.width==this._a&&a.height==this._b:!1},up:function(){return L7.p(this.x,this.y-1)},left:function(){return L7.p(this.x-1,this.y)},right:function(){return L7.p(this.x+1,this.y)},down:function(){return L7.p(this.x,this.y+1)},add:function(a,b){return L7.p(this.x+
("number"===typeof a.x?a.x:a||0),this.y+("number"===typeof a.y?a.y:b||0))},subtract:function(a,b){x="number"===typeof a.x?a.x:a||0;y="number"===typeof a.y?a.y:b||0;return L7.p(this.x-x,this.y-y)},negate:function(){return L7.p(-this.x,-this.y)},multiply:function(a){return L7.p(this.x*a,this.y*a)},round:function(){return L7.pr(this.x,this.y)},dot:function(a){return this.x*a.x+this.y*a.y},length:function(){return Math.sqrt(this.dot(this))},normalize:function(){return this.multiply(1/this.length())},
distanceFrom:function(a){a=this.delta(a);return Math.sqrt(a.dot(a))},degreeAngleFrom:function(a){return L7.radiansToDegrees(this.radianAngleFrom(a))},radianAngleFrom:function(d){var e=this.x-d.x,d=this.y-d.y;if(0===e)return 0>d?3*c:c;if(0===d)return 0>e?a:0;var f=Math.atan(d/e);return 0<e&&0<d?f:0>e&&0<d?f+a:0>e&&0>d?f+a:f+b},toString:function(){return"["+this._a+","+this._b+"]"}};L7.Pair.prototype.delta=L7.Pair.prototype.subtract;Object.defineProperty(L7.Pair.prototype,"width",{get:function(){return this._a}});
Object.defineProperty(L7.Pair.prototype,"height",{get:function(){return this._b}});Object.defineProperty(L7.Pair.prototype,"x",{get:function(){return this._a}});Object.defineProperty(L7.Pair.prototype,"y",{get:function(){return this._b}});L7.s=function(a,b){return new L7.Pair(a,b)};L7.p=L7.s;L7.sr=function(a,b){return new L7.Pair(Math.round(a),Math.round(b))};L7.pr=L7.sr})();
(function(){L7.Observable={on:function(a,b,c){this._listeners=this._listeners||{};this._listeners[a]||(this._listeners[a]=[]);this._listeners[a].push({handler:b,scope:c})},fireEvent:function(a,b){this._listeners=this._listeners||{};var c=this._listeners[a];if(_.isArray(c)){var d=_.toArray(arguments);d.shift();_.each(c,function(a){a.handler.apply(a.scope,d)})}}}})();
(function(){function a(){return L7.rand(-1,1,!0)}var b=0;L7.ParticleSystem=function(a){_.extend(this,a);this._particles=[];this.id=b++;this._particleTeam=this.team||"particle-"+this.id;for(a=0;a<this.totalParticles;++a)this._particles.push(new L7.Actor({position:this.position.clone(),team:this._particleTeam}));this._particleCount=this._particleIndex=this._emitCounter=this._elapsed=0;this.active=this.active||!1};L7.ParticleSystem.prototype={onRemove:function(a){this.reset();this._particles.forEach(function(b){this._initParticle(b);
a.removeActor(b)},this);this._addedActors=!1},reset:function(){this._particleIndex=this._particleCount=0},_isFull:function(){return this._particleCount===this.totalParticles},_initParticle:function(b){b.rx=this.position.x+this.posVar.x*a();b.ry=this.position.y+this.posVar.y*a();var d=L7.degreesToRadians(this.angle+this.angleVar*a()),d=L7.p(Math.cos(d),Math.sin(d)),e=this.speed+this.speedVar*a(),d=d.multiply(e);b.dir={x:d.x,y:d.y};b.radialAccel=this.radialAccel+this.radialAccelVar*a();b.radialAccel&&
(b.radialAccel=0);b.tangentialAccel=this.tangentialAccel+this.tangentialAccelVar*a();b.tangentialAccel||(b.tangentialAccel=0);d=this.life+this.lifeVar*a();b.life=Math.max(0,d);d=[this.startColor[0]+this.startColorVar[0]*a(),this.startColor[1]+this.startColorVar[1]*a(),this.startColor[2]+this.startColorVar[2]*a(),this.startColor[3]+this.startColorVar[3]*a()];e=[this.endColor[0]+this.endColorVar[0]*a(),this.endColor[1]+this.endColorVar[1]*a(),this.endColor[2]+this.endColorVar[2]*a(),this.endColor[3]+
this.endColorVar[3]*a()];b.color=d;b.pieces[0].color=d;b.deltaColor=[(e[0]-d[0])/b.life,(e[1]-d[1])/b.life,(e[2]-d[2])/b.life,(e[3]-d[3])/b.life];_.isUndefined(this.startSize)?(b.size=1,b.deltaSize=0):(d=this.startSize+this.startSizeVar*a(),d=Math.max(0,d),b.size=d,_.isUndefined(this.endSize)?b.deltaSize=0:(e=this.endSize+this.endSizeVar*a(),b.deltaSize=(e-d)/b.life))},_addParticle:function(){if(this._isFull())return!1;this._initParticle(this._particles[this._particleCount]);++this._particleCount;
return!0},update:function(a,b,e){if(this.active){a/=1E3;if(this.emissionRate){b=1/this.emissionRate;for(this._emitCounter+=a;!this._isFull()&&this._emitCounter>b;)this._addParticle(),this._emitCounter-=b}this._elapsed+=a;this.active=this._elapsed<this.duration;for(this._particleIndex=0;this._particleIndex<this._particleCount;)this._updateParticle(this._particles[this._particleIndex],a,this._particleIndex);this._updateBoard(e)}},_updateParticle:function(a,b,e){if(0<a.life){a.tmp=a.tmp||{x:0,y:0};a.tmp.x=
0;a.tmp.y=0;a.radial=a.radial||{x:0,y:0};a.radial.x=0;a.radial.y=0;if(a.position.x!==this.position.x||a.position.y!==this.position.y)e=L7.p(a.rx,a.ry).normalize(),a.radial.x=e.x,a.radial.y=e.y;e=_.clone(a.radial);a.radial.x*=a.radialAccel;a.radial.y*=a.radialAccel;var f=e.x;e.x=-e.y;e.y=f;e.x*=a.tangentialAccel;e.y*=a.tangentialAccel;a.tmp.x=a.radial.x+e.x+this.gravity.x;a.tmp.y=a.radial.y+e.y+this.gravity.y;a.tmp.x*=b;a.tmp.y*=b;a.dir.x+=a.tmp.x;a.dir.y+=a.tmp.y;a.tmp.x=a.dir.x*b;a.tmp.y=a.dir.y*
b;a.rx+=a.tmp.x;a.ry+=a.tmp.y;a.goTo(L7.pr(a.rx,a.ry));a.color[0]+=a.deltaColor[0]*b;a.color[1]+=a.deltaColor[1]*b;a.color[2]+=a.deltaColor[2]*b;a.color[3]+=a.deltaColor[3]*b;a.size+=a.deltaSize*b;a.size=Math.max(0,a.size);a.pieces[0].scale=a.size;a.life-=b;++this._particleIndex}else a=this._particles[e],this._particles[e]=this._particles[this._particleCount-1],this._particles[this._particleCount-1]=a,--this._particleCount},_updateBoard:function(a){this._addedActors||(this._particles.forEach(function(b){a.addActor(b)}),
this._addedActors=!0);for(var b=L7.p(-1,-1),e=this._particleCount;e<this._particles.length;++e)this._particles[e].goTo(b)}}})();(function(a){a.glMatrixArrayType=a.MatrixArray=null;a.vec3={};a.mat3={};a.mat4={};a.quat4={};a.setMatrixArrayType=function(a){return glMatrixArrayType=MatrixArray=a};a.determineMatrixArrayType=function(){return setMatrixArrayType("undefined"!==typeof Float32Array?Float32Array:Array)};determineMatrixArrayType()})("undefined"!=typeof exports?global:this);
vec3.create=function(a){var b=new MatrixArray(3);a?(b[0]=a[0],b[1]=a[1],b[2]=a[2]):b[0]=b[1]=b[2]=0;return b};vec3.set=function(a,b){b[0]=a[0];b[1]=a[1];b[2]=a[2];return b};vec3.add=function(a,b,c){if(!c||a===c)return a[0]+=b[0],a[1]+=b[1],a[2]+=b[2],a;c[0]=a[0]+b[0];c[1]=a[1]+b[1];c[2]=a[2]+b[2];return c};vec3.subtract=function(a,b,c){if(!c||a===c)return a[0]-=b[0],a[1]-=b[1],a[2]-=b[2],a;c[0]=a[0]-b[0];c[1]=a[1]-b[1];c[2]=a[2]-b[2];return c};
vec3.multiply=function(a,b,c){if(!c||a===c)return a[0]*=b[0],a[1]*=b[1],a[2]*=b[2],a;c[0]=a[0]*b[0];c[1]=a[1]*b[1];c[2]=a[2]*b[2];return c};vec3.negate=function(a,b){b||(b=a);b[0]=-a[0];b[1]=-a[1];b[2]=-a[2];return b};vec3.scale=function(a,b,c){if(!c||a===c)return a[0]*=b,a[1]*=b,a[2]*=b,a;c[0]=a[0]*b;c[1]=a[1]*b;c[2]=a[2]*b;return c};
vec3.normalize=function(a,b){b||(b=a);var c=a[0],d=a[1],e=a[2],f=Math.sqrt(c*c+d*d+e*e);if(f){if(1===f)return b[0]=c,b[1]=d,b[2]=e,b}else return b[0]=0,b[1]=0,b[2]=0,b;f=1/f;b[0]=c*f;b[1]=d*f;b[2]=e*f;return b};vec3.cross=function(a,b,c){c||(c=a);var d=a[0],e=a[1],a=a[2],f=b[0],g=b[1],b=b[2];c[0]=e*b-a*g;c[1]=a*f-d*b;c[2]=d*g-e*f;return c};vec3.length=function(a){var b=a[0],c=a[1],a=a[2];return Math.sqrt(b*b+c*c+a*a)};vec3.dot=function(a,b){return a[0]*b[0]+a[1]*b[1]+a[2]*b[2]};
vec3.direction=function(a,b,c){c||(c=a);var d=a[0]-b[0],e=a[1]-b[1],a=a[2]-b[2],b=Math.sqrt(d*d+e*e+a*a);if(!b)return c[0]=0,c[1]=0,c[2]=0,c;b=1/b;c[0]=d*b;c[1]=e*b;c[2]=a*b;return c};vec3.lerp=function(a,b,c,d){d||(d=a);d[0]=a[0]+c*(b[0]-a[0]);d[1]=a[1]+c*(b[1]-a[1]);d[2]=a[2]+c*(b[2]-a[2]);return d};vec3.dist=function(a,b){var c=b[0]-a[0],d=b[1]-a[1],e=b[2]-a[2];return Math.sqrt(c*c+d*d+e*e)};
vec3.unproject=function(a,b,c,d,e){e||(e=a);var f=mat4.create(),g=new MatrixArray(4);g[0]=2*(a[0]-d[0])/d[2]-1;g[1]=2*(a[1]-d[1])/d[3]-1;g[2]=2*a[2]-1;g[3]=1;mat4.multiply(c,b,f);if(!mat4.inverse(f))return null;mat4.multiplyVec4(f,g);if(0===g[3])return null;e[0]=g[0]/g[3];e[1]=g[1]/g[3];e[2]=g[2]/g[3];return e};vec3.str=function(a){return"["+a[0]+", "+a[1]+", "+a[2]+"]"};
mat3.create=function(a){var b=new MatrixArray(9);a&&(b[0]=a[0],b[1]=a[1],b[2]=a[2],b[3]=a[3],b[4]=a[4],b[5]=a[5],b[6]=a[6],b[7]=a[7],b[8]=a[8]);return b};mat3.set=function(a,b){b[0]=a[0];b[1]=a[1];b[2]=a[2];b[3]=a[3];b[4]=a[4];b[5]=a[5];b[6]=a[6];b[7]=a[7];b[8]=a[8];return b};mat3.identity=function(a){a||(a=mat3.create());a[0]=1;a[1]=0;a[2]=0;a[3]=0;a[4]=1;a[5]=0;a[6]=0;a[7]=0;a[8]=1;return a};
mat3.transpose=function(a,b){if(!b||a===b){var c=a[1],d=a[2],e=a[5];a[1]=a[3];a[2]=a[6];a[3]=c;a[5]=a[7];a[6]=d;a[7]=e;return a}b[0]=a[0];b[1]=a[3];b[2]=a[6];b[3]=a[1];b[4]=a[4];b[5]=a[7];b[6]=a[2];b[7]=a[5];b[8]=a[8];return b};mat3.toMat4=function(a,b){b||(b=mat4.create());b[15]=1;b[14]=0;b[13]=0;b[12]=0;b[11]=0;b[10]=a[8];b[9]=a[7];b[8]=a[6];b[7]=0;b[6]=a[5];b[5]=a[4];b[4]=a[3];b[3]=0;b[2]=a[2];b[1]=a[1];b[0]=a[0];return b};
mat3.str=function(a){return"["+a[0]+", "+a[1]+", "+a[2]+", "+a[3]+", "+a[4]+", "+a[5]+", "+a[6]+", "+a[7]+", "+a[8]+"]"};mat4.create=function(a){var b=new MatrixArray(16);a&&(b[0]=a[0],b[1]=a[1],b[2]=a[2],b[3]=a[3],b[4]=a[4],b[5]=a[5],b[6]=a[6],b[7]=a[7],b[8]=a[8],b[9]=a[9],b[10]=a[10],b[11]=a[11],b[12]=a[12],b[13]=a[13],b[14]=a[14],b[15]=a[15]);return b};
mat4.set=function(a,b){b[0]=a[0];b[1]=a[1];b[2]=a[2];b[3]=a[3];b[4]=a[4];b[5]=a[5];b[6]=a[6];b[7]=a[7];b[8]=a[8];b[9]=a[9];b[10]=a[10];b[11]=a[11];b[12]=a[12];b[13]=a[13];b[14]=a[14];b[15]=a[15];return b};mat4.identity=function(a){a||(a=mat4.create());a[0]=1;a[1]=0;a[2]=0;a[3]=0;a[4]=0;a[5]=1;a[6]=0;a[7]=0;a[8]=0;a[9]=0;a[10]=1;a[11]=0;a[12]=0;a[13]=0;a[14]=0;a[15]=1;return a};
mat4.transpose=function(a,b){if(!b||a===b){var c=a[1],d=a[2],e=a[3],f=a[6],g=a[7],i=a[11];a[1]=a[4];a[2]=a[8];a[3]=a[12];a[4]=c;a[6]=a[9];a[7]=a[13];a[8]=d;a[9]=f;a[11]=a[14];a[12]=e;a[13]=g;a[14]=i;return a}b[0]=a[0];b[1]=a[4];b[2]=a[8];b[3]=a[12];b[4]=a[1];b[5]=a[5];b[6]=a[9];b[7]=a[13];b[8]=a[2];b[9]=a[6];b[10]=a[10];b[11]=a[14];b[12]=a[3];b[13]=a[7];b[14]=a[11];b[15]=a[15];return b};
mat4.determinant=function(a){var b=a[0],c=a[1],d=a[2],e=a[3],f=a[4],g=a[5],i=a[6],k=a[7],j=a[8],h=a[9],l=a[10],o=a[11],n=a[12],m=a[13],p=a[14],a=a[15];return n*h*i*e-j*m*i*e-n*g*l*e+f*m*l*e+j*g*p*e-f*h*p*e-n*h*d*k+j*m*d*k+n*c*l*k-b*m*l*k-j*c*p*k+b*h*p*k+n*g*d*o-f*m*d*o-n*c*i*o+b*m*i*o+f*c*p*o-b*g*p*o-j*g*d*a+f*h*d*a+j*c*i*a-b*h*i*a-f*c*l*a+b*g*l*a};
mat4.inverse=function(a,b){b||(b=a);var c=a[0],d=a[1],e=a[2],f=a[3],g=a[4],i=a[5],k=a[6],j=a[7],h=a[8],l=a[9],o=a[10],n=a[11],m=a[12],p=a[13],r=a[14],s=a[15],q=c*i-d*g,D=c*k-e*g,u=c*j-f*g,v=d*k-e*i,w=d*j-f*i,z=e*j-f*k,A=h*p-l*m,B=h*r-o*m,C=h*s-n*m,E=l*r-o*p,F=l*s-n*p,G=o*s-n*r,t=q*G-D*F+u*E+v*C-w*B+z*A;if(!t)return null;t=1/t;b[0]=(i*G-k*F+j*E)*t;b[1]=(-d*G+e*F-f*E)*t;b[2]=(p*z-r*w+s*v)*t;b[3]=(-l*z+o*w-n*v)*t;b[4]=(-g*G+k*C-j*B)*t;b[5]=(c*G-e*C+f*B)*t;b[6]=(-m*z+r*u-s*D)*t;b[7]=(h*z-o*u+n*D)*t;b[8]=
(g*F-i*C+j*A)*t;b[9]=(-c*F+d*C-f*A)*t;b[10]=(m*w-p*u+s*q)*t;b[11]=(-h*w+l*u-n*q)*t;b[12]=(-g*E+i*B-k*A)*t;b[13]=(c*E-d*B+e*A)*t;b[14]=(-m*v+p*D-r*q)*t;b[15]=(h*v-l*D+o*q)*t;return b};mat4.toRotationMat=function(a,b){b||(b=mat4.create());b[0]=a[0];b[1]=a[1];b[2]=a[2];b[3]=a[3];b[4]=a[4];b[5]=a[5];b[6]=a[6];b[7]=a[7];b[8]=a[8];b[9]=a[9];b[10]=a[10];b[11]=a[11];b[12]=0;b[13]=0;b[14]=0;b[15]=1;return b};
mat4.toMat3=function(a,b){b||(b=mat3.create());b[0]=a[0];b[1]=a[1];b[2]=a[2];b[3]=a[4];b[4]=a[5];b[5]=a[6];b[6]=a[8];b[7]=a[9];b[8]=a[10];return b};mat4.toInverseMat3=function(a,b){var c=a[0],d=a[1],e=a[2],f=a[4],g=a[5],i=a[6],k=a[8],j=a[9],h=a[10],l=h*g-i*j,o=-h*f+i*k,n=j*f-g*k,m=c*l+d*o+e*n;if(!m)return null;m=1/m;b||(b=mat3.create());b[0]=l*m;b[1]=(-h*d+e*j)*m;b[2]=(i*d-e*g)*m;b[3]=o*m;b[4]=(h*c-e*k)*m;b[5]=(-i*c+e*f)*m;b[6]=n*m;b[7]=(-j*c+d*k)*m;b[8]=(g*c-d*f)*m;return b};
mat4.multiply=function(a,b,c){c||(c=a);var d=a[0],e=a[1],f=a[2],g=a[3],i=a[4],k=a[5],j=a[6],h=a[7],l=a[8],o=a[9],n=a[10],m=a[11],p=a[12],r=a[13],s=a[14],a=a[15],q=b[0],D=b[1],u=b[2],v=b[3],w=b[4],z=b[5],A=b[6],B=b[7],C=b[8],E=b[9],F=b[10],G=b[11],t=b[12],H=b[13],I=b[14],b=b[15];c[0]=q*d+D*i+u*l+v*p;c[1]=q*e+D*k+u*o+v*r;c[2]=q*f+D*j+u*n+v*s;c[3]=q*g+D*h+u*m+v*a;c[4]=w*d+z*i+A*l+B*p;c[5]=w*e+z*k+A*o+B*r;c[6]=w*f+z*j+A*n+B*s;c[7]=w*g+z*h+A*m+B*a;c[8]=C*d+E*i+F*l+G*p;c[9]=C*e+E*k+F*o+G*r;c[10]=C*f+E*
j+F*n+G*s;c[11]=C*g+E*h+F*m+G*a;c[12]=t*d+H*i+I*l+b*p;c[13]=t*e+H*k+I*o+b*r;c[14]=t*f+H*j+I*n+b*s;c[15]=t*g+H*h+I*m+b*a;return c};mat4.multiplyVec3=function(a,b,c){c||(c=b);var d=b[0],e=b[1],b=b[2];c[0]=a[0]*d+a[4]*e+a[8]*b+a[12];c[1]=a[1]*d+a[5]*e+a[9]*b+a[13];c[2]=a[2]*d+a[6]*e+a[10]*b+a[14];return c};
mat4.multiplyVec4=function(a,b,c){c||(c=b);var d=b[0],e=b[1],f=b[2],b=b[3];c[0]=a[0]*d+a[4]*e+a[8]*f+a[12]*b;c[1]=a[1]*d+a[5]*e+a[9]*f+a[13]*b;c[2]=a[2]*d+a[6]*e+a[10]*f+a[14]*b;c[3]=a[3]*d+a[7]*e+a[11]*f+a[15]*b;return c};
mat4.translate=function(a,b,c){var d=b[0],e=b[1],b=b[2],f,g,i,k,j,h,l,o,n,m,p,r;if(!c||a===c)return a[12]=a[0]*d+a[4]*e+a[8]*b+a[12],a[13]=a[1]*d+a[5]*e+a[9]*b+a[13],a[14]=a[2]*d+a[6]*e+a[10]*b+a[14],a[15]=a[3]*d+a[7]*e+a[11]*b+a[15],a;f=a[0];g=a[1];i=a[2];k=a[3];j=a[4];h=a[5];l=a[6];o=a[7];n=a[8];m=a[9];p=a[10];r=a[11];c[0]=f;c[1]=g;c[2]=i;c[3]=k;c[4]=j;c[5]=h;c[6]=l;c[7]=o;c[8]=n;c[9]=m;c[10]=p;c[11]=r;c[12]=f*d+j*e+n*b+a[12];c[13]=g*d+h*e+m*b+a[13];c[14]=i*d+l*e+p*b+a[14];c[15]=k*d+o*e+r*b+a[15];
return c};mat4.scale=function(a,b,c){var d=b[0],e=b[1],b=b[2];if(!c||a===c)return a[0]*=d,a[1]*=d,a[2]*=d,a[3]*=d,a[4]*=e,a[5]*=e,a[6]*=e,a[7]*=e,a[8]*=b,a[9]*=b,a[10]*=b,a[11]*=b,a;c[0]=a[0]*d;c[1]=a[1]*d;c[2]=a[2]*d;c[3]=a[3]*d;c[4]=a[4]*e;c[5]=a[5]*e;c[6]=a[6]*e;c[7]=a[7]*e;c[8]=a[8]*b;c[9]=a[9]*b;c[10]=a[10]*b;c[11]=a[11]*b;c[12]=a[12];c[13]=a[13];c[14]=a[14];c[15]=a[15];return c};
mat4.rotate=function(a,b,c,d){var e=c[0],f=c[1],c=c[2],g=Math.sqrt(e*e+f*f+c*c),i,k,j,h,l,o,n,m,p,r,s,q,D,u,v,w,z,A,B,C;if(!g)return null;1!==g&&(g=1/g,e*=g,f*=g,c*=g);i=Math.sin(b);k=Math.cos(b);j=1-k;b=a[0];g=a[1];h=a[2];l=a[3];o=a[4];n=a[5];m=a[6];p=a[7];r=a[8];s=a[9];q=a[10];D=a[11];u=e*e*j+k;v=f*e*j+c*i;w=c*e*j-f*i;z=e*f*j-c*i;A=f*f*j+k;B=c*f*j+e*i;C=e*c*j+f*i;e=f*c*j-e*i;f=c*c*j+k;d?a!==d&&(d[12]=a[12],d[13]=a[13],d[14]=a[14],d[15]=a[15]):d=a;d[0]=b*u+o*v+r*w;d[1]=g*u+n*v+s*w;d[2]=h*u+m*v+q*
w;d[3]=l*u+p*v+D*w;d[4]=b*z+o*A+r*B;d[5]=g*z+n*A+s*B;d[6]=h*z+m*A+q*B;d[7]=l*z+p*A+D*B;d[8]=b*C+o*e+r*f;d[9]=g*C+n*e+s*f;d[10]=h*C+m*e+q*f;d[11]=l*C+p*e+D*f;return d};mat4.rotateX=function(a,b,c){var d=Math.sin(b),b=Math.cos(b),e=a[4],f=a[5],g=a[6],i=a[7],k=a[8],j=a[9],h=a[10],l=a[11];c?a!==c&&(c[0]=a[0],c[1]=a[1],c[2]=a[2],c[3]=a[3],c[12]=a[12],c[13]=a[13],c[14]=a[14],c[15]=a[15]):c=a;c[4]=e*b+k*d;c[5]=f*b+j*d;c[6]=g*b+h*d;c[7]=i*b+l*d;c[8]=e*-d+k*b;c[9]=f*-d+j*b;c[10]=g*-d+h*b;c[11]=i*-d+l*b;return c};
mat4.rotateY=function(a,b,c){var d=Math.sin(b),b=Math.cos(b),e=a[0],f=a[1],g=a[2],i=a[3],k=a[8],j=a[9],h=a[10],l=a[11];c?a!==c&&(c[4]=a[4],c[5]=a[5],c[6]=a[6],c[7]=a[7],c[12]=a[12],c[13]=a[13],c[14]=a[14],c[15]=a[15]):c=a;c[0]=e*b+k*-d;c[1]=f*b+j*-d;c[2]=g*b+h*-d;c[3]=i*b+l*-d;c[8]=e*d+k*b;c[9]=f*d+j*b;c[10]=g*d+h*b;c[11]=i*d+l*b;return c};
mat4.rotateZ=function(a,b,c){var d=Math.sin(b),b=Math.cos(b),e=a[0],f=a[1],g=a[2],i=a[3],k=a[4],j=a[5],h=a[6],l=a[7];c?a!==c&&(c[8]=a[8],c[9]=a[9],c[10]=a[10],c[11]=a[11],c[12]=a[12],c[13]=a[13],c[14]=a[14],c[15]=a[15]):c=a;c[0]=e*b+k*d;c[1]=f*b+j*d;c[2]=g*b+h*d;c[3]=i*b+l*d;c[4]=e*-d+k*b;c[5]=f*-d+j*b;c[6]=g*-d+h*b;c[7]=i*-d+l*b;return c};
mat4.frustum=function(a,b,c,d,e,f,g){g||(g=mat4.create());var i=b-a,k=d-c,j=f-e;g[0]=2*e/i;g[1]=0;g[2]=0;g[3]=0;g[4]=0;g[5]=2*e/k;g[6]=0;g[7]=0;g[8]=(b+a)/i;g[9]=(d+c)/k;g[10]=-(f+e)/j;g[11]=-1;g[12]=0;g[13]=0;g[14]=-(2*f*e)/j;g[15]=0;return g};mat4.perspective=function(a,b,c,d,e){a=c*Math.tan(a*Math.PI/360);b*=a;return mat4.frustum(-b,b,-a,a,c,d,e)};
mat4.ortho=function(a,b,c,d,e,f,g){g||(g=mat4.create());var i=b-a,k=d-c,j=f-e;g[0]=2/i;g[1]=0;g[2]=0;g[3]=0;g[4]=0;g[5]=2/k;g[6]=0;g[7]=0;g[8]=0;g[9]=0;g[10]=-2/j;g[11]=0;g[12]=-(a+b)/i;g[13]=-(d+c)/k;g[14]=-(f+e)/j;g[15]=1;return g};
mat4.lookAt=function(a,b,c,d){d||(d=mat4.create());var e,f,g,i,k,j,h,l,o=a[0],n=a[1],a=a[2];g=c[0];i=c[1];f=c[2];h=b[0];c=b[1];e=b[2];if(o===h&&n===c&&a===e)return mat4.identity(d);b=o-h;c=n-c;h=a-e;l=1/Math.sqrt(b*b+c*c+h*h);b*=l;c*=l;h*=l;e=i*h-f*c;f=f*b-g*h;g=g*c-i*b;(l=Math.sqrt(e*e+f*f+g*g))?(l=1/l,e*=l,f*=l,g*=l):g=f=e=0;i=c*g-h*f;k=h*e-b*g;j=b*f-c*e;(l=Math.sqrt(i*i+k*k+j*j))?(l=1/l,i*=l,k*=l,j*=l):j=k=i=0;d[0]=e;d[1]=i;d[2]=b;d[3]=0;d[4]=f;d[5]=k;d[6]=c;d[7]=0;d[8]=g;d[9]=j;d[10]=h;d[11]=
0;d[12]=-(e*o+f*n+g*a);d[13]=-(i*o+k*n+j*a);d[14]=-(b*o+c*n+h*a);d[15]=1;return d};mat4.fromRotationTranslation=function(a,b,c){c||(c=mat4.create());var d=a[0],e=a[1],f=a[2],g=a[3],i=d+d,k=e+e,j=f+f,a=d*i,h=d*k,d=d*j,l=e*k,e=e*j,f=f*j,i=g*i,k=g*k,g=g*j;c[0]=1-(l+f);c[1]=h+g;c[2]=d-k;c[3]=0;c[4]=h-g;c[5]=1-(a+f);c[6]=e+i;c[7]=0;c[8]=d+k;c[9]=e-i;c[10]=1-(a+l);c[11]=0;c[12]=b[0];c[13]=b[1];c[14]=b[2];c[15]=1;return c};
mat4.str=function(a){return"["+a[0]+", "+a[1]+", "+a[2]+", "+a[3]+", "+a[4]+", "+a[5]+", "+a[6]+", "+a[7]+", "+a[8]+", "+a[9]+", "+a[10]+", "+a[11]+", "+a[12]+", "+a[13]+", "+a[14]+", "+a[15]+"]"};quat4.create=function(a){var b=new MatrixArray(4);a&&(b[0]=a[0],b[1]=a[1],b[2]=a[2],b[3]=a[3]);return b};quat4.set=function(a,b){b[0]=a[0];b[1]=a[1];b[2]=a[2];b[3]=a[3];return b};
quat4.calculateW=function(a,b){var c=a[0],d=a[1],e=a[2];if(!b||a===b)return a[3]=-Math.sqrt(Math.abs(1-c*c-d*d-e*e)),a;b[0]=c;b[1]=d;b[2]=e;b[3]=-Math.sqrt(Math.abs(1-c*c-d*d-e*e));return b};quat4.dot=function(a,b){return a[0]*b[0]+a[1]*b[1]+a[2]*b[2]+a[3]*b[3]};quat4.inverse=function(a,b){var c=a[0],d=a[1],e=a[2],f=a[3],c=(c=c*c+d*d+e*e+f*f)?1/c:0;if(!b||a===b)return a[0]*=-c,a[1]*=-c,a[2]*=-c,a[3]*=c,a;b[0]=-a[0]*c;b[1]=-a[1]*c;b[2]=-a[2]*c;b[3]=a[3]*c;return b};
quat4.conjugate=function(a,b){if(!b||a===b)return a[0]*=-1,a[1]*=-1,a[2]*=-1,a;b[0]=-a[0];b[1]=-a[1];b[2]=-a[2];b[3]=a[3];return b};quat4.length=function(a){var b=a[0],c=a[1],d=a[2],a=a[3];return Math.sqrt(b*b+c*c+d*d+a*a)};quat4.normalize=function(a,b){b||(b=a);var c=a[0],d=a[1],e=a[2],f=a[3],g=Math.sqrt(c*c+d*d+e*e+f*f);if(0===g)return b[0]=0,b[1]=0,b[2]=0,b[3]=0,b;g=1/g;b[0]=c*g;b[1]=d*g;b[2]=e*g;b[3]=f*g;return b};
quat4.multiply=function(a,b,c){c||(c=a);var d=a[0],e=a[1],f=a[2],a=a[3],g=b[0],i=b[1],k=b[2],b=b[3];c[0]=d*b+a*g+e*k-f*i;c[1]=e*b+a*i+f*g-d*k;c[2]=f*b+a*k+d*i-e*g;c[3]=a*b-d*g-e*i-f*k;return c};quat4.multiplyVec3=function(a,b,c){c||(c=b);var d=b[0],e=b[1],f=b[2],b=a[0],g=a[1],i=a[2],a=a[3],k=a*d+g*f-i*e,j=a*e+i*d-b*f,h=a*f+b*e-g*d,d=-b*d-g*e-i*f;c[0]=k*a+d*-b+j*-i-h*-g;c[1]=j*a+d*-g+h*-b-k*-i;c[2]=h*a+d*-i+k*-g-j*-b;return c};
quat4.toMat3=function(a,b){b||(b=mat3.create());var c=a[0],d=a[1],e=a[2],f=a[3],g=c+c,i=d+d,k=e+e,j=c*g,h=c*i,c=c*k,l=d*i,d=d*k,e=e*k,g=f*g,i=f*i,f=f*k;b[0]=1-(l+e);b[1]=h+f;b[2]=c-i;b[3]=h-f;b[4]=1-(j+e);b[5]=d+g;b[6]=c+i;b[7]=d-g;b[8]=1-(j+l);return b};
quat4.toMat4=function(a,b){b||(b=mat4.create());var c=a[0],d=a[1],e=a[2],f=a[3],g=c+c,i=d+d,k=e+e,j=c*g,h=c*i,c=c*k,l=d*i,d=d*k,e=e*k,g=f*g,i=f*i,f=f*k;b[0]=1-(l+e);b[1]=h+f;b[2]=c-i;b[3]=0;b[4]=h-f;b[5]=1-(j+e);b[6]=d+g;b[7]=0;b[8]=c+i;b[9]=d-g;b[10]=1-(j+l);b[11]=0;b[12]=0;b[13]=0;b[14]=0;b[15]=1;return b};
quat4.slerp=function(a,b,c,d){d||(d=a);var e=a[0]*b[0]+a[1]*b[1]+a[2]*b[2]+a[3]*b[3],f,g;if(1<=Math.abs(e))return d!==a&&(d[0]=a[0],d[1]=a[1],d[2]=a[2],d[3]=a[3]),d;f=Math.acos(e);g=Math.sqrt(1-e*e);if(0.0010>Math.abs(g))return d[0]=0.5*a[0]+0.5*b[0],d[1]=0.5*a[1]+0.5*b[1],d[2]=0.5*a[2]+0.5*b[2],d[3]=0.5*a[3]+0.5*b[3],d;e=Math.sin((1-c)*f)/g;c=Math.sin(c*f)/g;d[0]=a[0]*e+b[0]*c;d[1]=a[1]*e+b[1]*c;d[2]=a[2]*e+b[2]*c;d[3]=a[3]*e+b[3]*c;return d};
quat4.str=function(a){return"["+a[0]+", "+a[1]+", "+a[2]+", "+a[3]+"]"};
(function(){L7.FadeBase=function(a){_.extend(this,a);this.elapsed=0;this.color&&(this.color=L7.Color.toArray(this.color))};L7.FadeBase.prototype={update:function(a,b){this.elapsed+=a;var c=this.elapsed/this.duration;this.updateColor(this.color,c);if(1<c&&this.onComplete)this.onComplete(this);this.board.update(a,b)},render:function(a,b,c,d,e){this.board.render(a,b,c,d,e);b.save();b.fillStyle=L7.Color.toCssString(this.color);b.fillRect(0,0,b.canvas.width,b.canvas.height);b.restore()}};Object.defineProperty(L7.FadeBase.prototype,
"viewport",{set:function(a){this._viewport=a;this.board&&(this.board.viewport=a)},get:function(){return this._viewport},enumerable:!0})})();(function(){L7.TransitionFadeIn=function(a){a.color=a.from;L7.FadeBase.call(this,a)};L7.TransitionFadeIn.prototype=new L7.FadeBase;L7.TransitionFadeIn.prototype.updateColor=function(a,b){a[3]=1-b}})();
(function(){L7.FadeOut=function(a){a.color=a.to;L7.FadeBase.call(this,a)};L7.FadeOut.prototype=new L7.FadeBase;L7.FadeOut.prototype.updateColor=function(a,b){a[3]=b}})();
(function(){L7.FadeOutIn=function(a){_.extend(this,a);_.bindAll(this,"_onFadeOutComplete","_onFadeInComplete");this.delegate=new L7.FadeOut({board:this.fromBoard,to:this.color,duration:this.duration/2,onComplete:this._onFadeOutComplete})};L7.FadeOutIn.prototype={_onFadeOutComplete:function(){this.delegate=new L7.FadeIn({board:this.toBoard,from:this.color,duration:this.duration/2,onComplete:this._onFadeInComplete});this.delegate.viewport=this.viewport},_onFadeInComplete:function(){if(this.onComplete)this.onComplete();
else this.game&&this.game.replaceBoard(this.toBoard)},update:function(){this.delegate.update.apply(this.delegate,arguments)},render:function(){this.delegate.render.apply(this.delegate,arguments)}};Object.defineProperty(L7.FadeOutIn.prototype,"viewport",{set:function(a){this._viewport=a;this.delegate&&(this.delegate.viewport=a)},get:function(){return this._viewport},enumerable:!0})})();
(function(){"undefined"===typeof Array.prototype.add&&(Array.prototype.add=function(a){this.push(a);return this});"undefined"===typeof Array.prototype.remove&&(Array.prototype.remove=function(a){a=this.indexOf(a);0<=a&&this.splice(a,1);return this});"undefined"===typeof Array.prototype.last&&Object.defineProperty(Array.prototype,"last",{get:function(){return this[this.length-1]},enumerable:!1});"undefined"===typeof Array.prototype.first&&Object.defineProperty(Array.prototype,"first",{get:function(){return this[0]},
enumerable:!1})})();(function(){L7.rand=function(a,b,c){_.isUndefined(c)&&(c=!1);var d=_.isNumber(b)?a:0,a=_.isNumber(b)?b:a,b=Math.random()*(a-d)+d;return d===(d|0)&&a===(a|0)&&!c?Math.floor(b):b};L7.coin=function(){return 0===L7.rand(0,2)};L7.degreesToRadians=function(a){return(a||0)*Math.PI/180};L7.radiansToDegrees=function(a){return 180*(a||0)/Math.PI}})();
(function() {
	SAM.Bacon = function(tileSize, spriteFactory) {
		var board = new L7.Board({
			tileSize: tileSize,
			width: 60,
			height: 60,
			borderWidth: 0,
			borderColor: [200, 180, 100, 1]
		});

		board.tiles.forEach(function(tile) {
			tile.color = board.borderColor;
		});

		var schoeff = spriteFactory.schoeffDance(L7.p(20, 30));

		for(var i = 0; i < 4; ++i) {
			this._addBacon(board, spriteFactory);
		}

		board.addActor(schoeff);

		board.ani.frame({
			targets: [schoeff],
			pieceSetIndex: 1,
			rate: 150,
			looping: 'backforth',
			loops: Infinity
		});

		return board;
	};

	SAM.Bacon.prototype._addBacon = function(board, spriteFactory) {
		var i = L7.rand(0,3);
		var bacon = spriteFactory['bacon' + i](L7.p(L7.rand(1, 50), 4));
		bacon.smoothMovement = true;
		bacon.rate = L7.rand(100, 300);
		board.addActor(bacon);

		bacon.ani.repeat(Infinity, function(ani) {
			ani.invoke(function() {
				bacon.down(1);
			});
			ani.wait(bacon.rate);
		});
	};
})();

(function() {
	SAM.CasaBonita = function(bgImage, tileSize, spriteFactory) {
		var levelLoader = new L7.ColorLevelLoader(bgImage, tileSize, 0);
		var board = levelLoader.load();

		var matt = spriteFactory.matt(L7.p(37, 46));
		var sarah = spriteFactory.sarah(L7.p(48, 47));
		var trumpeter = spriteFactory.casaTrumpeter(L7.p(35, 19));
		var guitarist = spriteFactory.casaGuitarist(L7.p(46, 19));
		var mmmm = spriteFactory.mmmm(L7.p(10, 33));
		var ugh = spriteFactory.ugh(L7.p(36, 33));

		board.addActors(matt, sarah, trumpeter, guitarist);

		board.ani.together(function(ani) {
			ani.frame({
				targets: [matt, sarah, trumpeter, guitarist],
				pieceSetIndex: 1,
				rate: 150,
				looping: 'backforth',
				loops: Infinity
			});
			ani.sequence(function(ani) {
				ani.wait(2000);
				ani.invoke(function() {
					board.addActor(mmmm);
				});
				ani.wait(3500);
				ani.invoke(function() {
					board.removeActor(mmmm);
				});
				ani.wait(500);
				ani.invoke(function() {
					board.addActor(ugh);
				});
				ani.wait(3500);
				ani.invoke(function() {
					board.removeActor(ugh);
				});
			});
		});

		return board;
	};

})();

(function() {
	SAM.CatLine = function(tileSize, spriteFactory) {
		var caty = 25;
		var cats = [
		spriteFactory.boo(L7.p(5, caty)), spriteFactory.lily(L7.p(15, caty)), spriteFactory.lucy(L7.p(25, caty)), spriteFactory.schoeffDance(L7.p(35, caty)), spriteFactory.bobo(L7.p(45, caty))];

		var catBoard = new L7.Board({
			tileSize: tileSize,
			width: 60,
			height: 60,
			borderWidth: 0,
			parallaxRatio: 0
		});

		catBoard.addActors.apply(catBoard, cats);

		catBoard.ani.sequence(function(ani) {
			ani.frame({
				targets: cats,
				pieceSetIndex: 1,
				rate: 150,
				looping: 'backforth',
				loops: Infinity
			});
		});

		var bgBoard = new L7.Board({
			tileSize: tileSize,
			width: 60,
			height: 60,
			borderWidth: 0,
			defaultTileColor: [50, 220, 70, 1],
			parallaxRatio: 0
		});

		bgBoard.ani.repeat(Infinity, function(ani) {
			ani.shimmer({
				filter: 'tiles',
				minAlpha: 0.2,
				maxAlpha: 0.5,
				baseRate: 2000,
				rateVariance: 0.4
			});
		});

		return new L7.ParallaxBoard({
			boards: [
			bgBoard, catBoard]
		});
	};

})();

(function() {
	SAM.CatLineSchoeffSits = function(tileSize, spriteFactory) {
		var caty = 25;
		var cats = [
			spriteFactory.boo(L7.p(5, caty)),
			spriteFactory.lily(L7.p(15, caty)), 
			spriteFactory.lucy(L7.p(25, caty)),
			spriteFactory.bobo(L7.p(45, caty))
		];

		var schoeff = spriteFactory.schoeffLaying(L7.p(35, caty+4));

		var catBoard = new L7.Board({
			tileSize: tileSize,
			width: 60,
			height: 60,
			borderWidth: 0,
			parallaxRatio: 0
		});

		catBoard.addActors.apply(catBoard, cats);
		catBoard.addActor(schoeff);

		catBoard.ani.sequence(function(ani) {
			ani.frame({
				targets: cats,
				pieceSetIndex: 1,
				rate: 150,
				looping: 'backforth',
				loops: Infinity
			});
		});

		var bgBoard = new L7.Board({
			tileSize: tileSize,
			width: 60,
			height: 60,
			borderWidth: 0,
			defaultTileColor: [50, 220, 70, 1],
			parallaxRatio: 0
		});

		bgBoard.ani.repeat(Infinity, function(ani) {
			ani.shimmer({
				filter: 'tiles',
				minAlpha: 0.2,
				maxAlpha: 0.5,
				baseRate: 2000,
				rateVariance: 0.4
			});
		});

		return new L7.ParallaxBoard({
			boards: [
			bgBoard, catBoard]
		});
	};

})();


(function() {
	SAM.DadTractor = function(bgImage, clouds, tileSize, spriteFactory) {
		var levelLoader = new L7.ColorLevelLoader(bgImage, tileSize, 0);
		var board = levelLoader.load();
		board.parallaxRatio = 0;

		levelLoader = new L7.ColorLevelLoader(clouds, tileSize, 0);
		clouds = levelLoader.load();
		clouds.parallaxRatio = 0.2;

		var dad = spriteFactory.dad(L7.p(10, 38));
		var mom = spriteFactory.mom(L7.p(20, 39));
		var livi = spriteFactory.livi(L7.p(2, 43));
		var buddy = spriteFactory.buddy(L7.p(52, 28));

		var smoke = this._createSmokeSystem(L7.p(36, 28));

		board.addActors(dad, mom, livi, buddy);
		board.addDaemon(smoke);

		board.ani.frame({
			targets: [mom, livi, buddy],
			pieceSetIndex: 1,
			rate: 150,
			looping: 'backforth',
			loops: Infinity
		});

		dad.ani.frame({
			targets: [dad],
			pieceSetIndex: 1,
			rate: 400,
			looping: 'backforth',
			loops: Infinity
		});

		var parallax = new L7.ParallaxBoard({
			boards: [board, clouds],
			tileSize: tileSize,
			width: board.width,
			height: board.height
		});

		clouds.ani.repeat(Infinity, function(ani) {
			ani.invoke(function() {
				SAM.game.viewport.scrollX(1);
			});
			ani.wait(10);
		});

		parallax.destroy = function() {
			SAM.game.viewport.reset();
		};

		return parallax;
	};

	SAM.DadTractor.prototype._createSmokeSystem = function(position) {
		return fireSystem = new L7.ParticleSystem({
			totalParticles: 200,
			duration: Infinity,
			gravity: L7.p(),
			centerOfGravity: L7.p(),
			angle: - 90,
			angleVar: 10,
			speed: 24,
			speedVar: 10,
			radialAccel: 0,
			radialAccelVar: 0,
			tangentialAccel: 0,
			tangentialAccelVar: 0,
			position: position,
			posVar: L7.p(1, 1),
			life: 0.3,
			lifeVar: 0.05,
			emissionRate: 200 / 1,
			startColor: L7.Color.fromFloats(0.2, 0.2, 0.2, 1),
			startColorVar: [0, 0, 0, 0],
			endColor: [0, 0, 0, 0],
			endColorVar: [0, 0, 0, 0],
			active: true
		});
	}

})();

(function() {
	SAM.DogLine = function(tileSize, spriteFactory) {
		var dogy = 45;
		var dogs = [
			spriteFactory.ben(L7.p(15, dogy - 20 )),
			spriteFactory.livi(L7.p(5, dogy)),
			spriteFactory.buddy(L7.p(45, dogy))
		];

		var bubble = spriteFactory.woohooBubble(L7.p(2, 5));

		var dogBoard = new L7.Board({
			tileSize: tileSize,
			width: 60,
			height: 60,
			borderWidth: 0,
			parallaxRatio: 0
		});

		dogBoard.addActors.apply(dogBoard, dogs);

		dogBoard.ani.frame({
			targets: dogs,
			pieceSetIndex: 1,
			rate: 150,
			looping: 'backforth',
			loops: Infinity
		});

		var wordY = 8;

		dogBoard.ani.sequence(function(ani) {
			ani.wait(500);
			ani.invoke(function() {
				dogBoard.addActor(bubble);
			});
			for(var i = 0; i < 6; ++i) {
				ani.wait(200);
				(function(xoff) {
					ani.invoke(function() {
						dogBoard.addActor(spriteFactory.ooo(L7.p(4 + (4*xoff), wordY)))
					});
				})(i);
			}
			ani.wait(200);
			ani.invoke(function() {
				dogBoard.addActor(spriteFactory.woo(L7.p(29, wordY)))
			});
			ani.wait(200);
			ani.invoke(function() {
				dogBoard.addActor(spriteFactory.hoo(L7.p(44, wordY - 2)))
			});
		});

		var bgBoard = new L7.Board({
			tileSize: tileSize,
			width: 60,
			height: 60,
			borderWidth: 0,
			defaultTileColor: [50, 120, 200, 1],
			parallaxRatio: 0
		});

		bgBoard.ani.repeat(Infinity, function(ani) {
			ani.shimmer({
				filter: 'tiles',
				minAlpha: 0.2,
				maxAlpha: 0.5,
				baseRate: 2000,
				rateVariance: 0.4
			});
		});

		return new L7.ParallaxBoard({
			boards: [
			bgBoard, dogBoard]
		});
	};

})();

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

		var mantaLeftBoard2 = this._getMantaBoard({
			from: 'right',
			actors: [{ n: 'blackMantaGoingLeft', y: 26 }],
			duration: 5000,
			delay: 8800,
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
			boards: [bgBoard, fgBoard, fishRightBoard1, mantaLeftBoard, mantaLeftBoard2, fishLeftBoard1, mantaRightBoard, fishLeftBoard2],
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

(function() {
	SAM.Hockey = function(bgImage, fgImage, tileSize, spriteFactory) {
		var bgLevelLoader = new L7.ColorLevelLoader(bgImage, tileSize, 0);
		var bgBoard = bgLevelLoader.load();
		bgBoard.parallaxRatio = 0;

		var matt = spriteFactory.matt(L7.p(20, 20));
		var sarah = spriteFactory.sarah(L7.p(30, 21));
		var phil = spriteFactory.phil(L7.p(40, 21));
		var emily = spriteFactory.emily(L7.p(7, 21));
		var blimp = spriteFactory.chipotleBlimp(L7.p(-10, 2));
		var tickets = this._createTickets(L7.p(0, 12));
		blimp.smoothMovement = true;
		blimp.rate = 200;

		bgBoard.addActors(matt, sarah, phil, emily, blimp);
		bgBoard.addDaemon(tickets);

		bgBoard.ani.frame({
			targets: [matt, sarah, phil, emily],
			pieceSetIndex: 1,
			rate: 150,
			looping: 'backforth',
			loops: Infinity
		});

		blimp.ani.repeat(70, function(ani) {
			ani.invoke(function() {
				tickets.position = tickets.position.add(L7.p(1, 0));
			});
			ani.wait(200);
		});
		blimp.onSmoothMovement = function() {
			blimp.right(1);
		};
		blimp.right(1);

		var fgLevelLoader = new L7.ColorLevelLoader(fgImage, tileSize, 0);
		var fgBoard = fgLevelLoader.load();
		fgBoard.parallaxRatio = 0;

		var avPlayer1 = spriteFactory.avPlayer(L7.p(7, 40));
		var avPlayer2 = spriteFactory.avPlayer(L7.p(18, 38));
		var rwPlayer1 = spriteFactory.redwingPlayer(L7.p(35, 36));
		var rwPlayer2 = spriteFactory.redwingPlayer(L7.p(43, 41));
		var ref = spriteFactory.hockeyRef(L7.p(25, 45));

		fgBoard.addActors(avPlayer1, avPlayer2, rwPlayer1, rwPlayer2, ref);

		fgBoard.tiles.forEach(function(tile) {
			tile.opaque = tile.position.y > 30;
		});

		fgBoard.ani.frame({
			targets: [avPlayer1, avPlayer2, rwPlayer1, rwPlayer2],
			pieceSetIndex: 1,
			rate: 150,
			looping: 'backforth',
			loops: Infinity
		});

		return new L7.ParallaxBoard({
			boards: [bgBoard, fgBoard]
		});
	};

	SAM.Hockey.prototype._createTickets = function(position) {
		return new L7.ParticleSystem({
			totalParticles: 1,
			duration: Infinity,
			gravity: L7.p(0, 1),
			centerOfGravity: L7.p(),
			angle: 90,
			angleVar: 10,
			speed: 3,
			speedVar: 1,
			radialAccel: 3,
			radialAccelVar: 2,
			tangentialAccel: 2,
			tangentialAccelVar: 2,
			position: position,
			posVar: L7.p(0,0),
			life: 4,
			lifeVar: 1,
			emissionRate: 1,
			startColor: L7.Color.fromFloats(1, 1, 1, 1),
			startColorVar: [0, 0, 0, 0],
			endColor: L7.Color.fromFloats(1, 1, 1, 0),
			endColorVar: [0, 0, 0, 0],
			active: true
		});

	};

})();

(function() {
	SAM.Intro = function(bgImage, tileSize, spriteFactory) {
		var levelLoader = new L7.ColorLevelLoader(bgImage, tileSize, 0);
		var board = levelLoader.load();

		var matt = spriteFactory.matt(L7.p(20, 20));
		var sarah = spriteFactory.sarah(L7.p(30, 21));

		var confetti = this._createConfettiSystem(board.width);
		board.addDaemon(confetti);

		board.addActors(matt, sarah);

		board.ani.sequence(function(ani) {
			ani.wait(6500);
			ani.invoke(function() {
				confetti.active = true;
			});
			ani.frame({
				targets: [matt, sarah],
				pieceSetIndex: 1,
				rate: 150,
				looping: 'backforth',
				loops: Infinity
			});
		});

		return board;
	};

	SAM.Intro.prototype._createConfettiSystem = function(width) {
		return new L7.ParticleSystem({
			totalParticles: 50,
			duration: Infinity,
			gravity: L7.p(0, 1),
			centerOfGravity: L7.p(),
			angle: 90,
			angleVar: 10,
			speed: 5,
			speedVar: 1,
			radialAccel: 0,
			radialAccelVar: 2,
			tangentialAccel: 0,
			tangentialAccelVar: 2,
			position: L7.p(width / 2, 0),
			posVar: L7.p(width / 2, 0),
			life: 6,
			lifeVar: 2,
			emissionRate: 10,
			startColor: L7.Color.fromFloats(1, 1, 1, 1),
			startColorVar: [255, 255, 255, 0],
			endColor: L7.Color.fromFloats(1, 1, 1, 0),
			endColorVar: [255, 255, 255, 0],
			active: false
		});
	};

})();


(function() {
	SAM.LivingRoom = function(bgImage, tileSize, spriteFactory) {
		var levelLoader = new L7.ColorLevelLoader(bgImage, tileSize, 0);
		var board = levelLoader.load();

		var matt = spriteFactory.mattYellowLantern(L7.p(20, 20));
		var sarah = spriteFactory.sarahClownPants(L7.p(30, 21));
		var lucy = spriteFactory.lucy(L7.p(10, 26));
		var schoeff = spriteFactory.schoeffLaying(L7.p(40, 29));

		board.addActors(matt, sarah, lucy, schoeff);

		board.ani.frame({
			targets: [matt, sarah, lucy],
			pieceSetIndex: 1,
			rate: 150,
			looping: 'backforth',
			loops: Infinity
		});

		return board;
	};

})();


(function() {
	SAM.LowerPeninsula = function(bgImage, tileSize, spriteFactory) {
		var levelLoader = new L7.ColorLevelLoader(bgImage, tileSize, 0);
		var board = levelLoader.load();

		var matt = spriteFactory.matt(L7.p(20, 20));
		var sarah = spriteFactory.sarah(L7.p(30, 21));
		var dad = spriteFactory.dad(L7.p(40, 21));
		var mom = spriteFactory.mom(L7.p(50, 22));
		var chad = spriteFactory.chad(L7.p(10, 20));
		var tammy = spriteFactory.tammy(L7.p(0, 21));
		var troll = spriteFactory.troll(L7.p(3, 43));
		var goTigers = spriteFactory.goTigers(L7.p(11, 5));
		var goRedWings = spriteFactory.goRedWings(L7.p(3, 5));


		board.addActors(matt, sarah, mom, dad, chad, tammy, troll);

		board.ani.together(function(ani) {
			ani.frame({
				targets: [matt, sarah, mom, chad, tammy, troll],
				pieceSetIndex: 1,
				rate: 150,
				looping: 'backforth',
				loops: Infinity
			});
			ani.sequence(function(ani) {
				ani.wait(1500);
				ani.invoke(function() {
					board.addActor(goTigers);
				});
				ani.wait(3000);
				ani.invoke(function() {
					board.removeActor(goTigers);
				});
				ani.wait(1300);
				ani.invoke(function() {
					board.addActor(goRedWings);
				});
				ani.wait(2000);
				ani.invoke(function() {
					board.removeActor(goRedWings);
				});
			});
		});

		dad.ani.frame({
			targets: [dad],
			pieceSetIndex: 1,
			rate: 400,
			looping: 'backforth',
			loops: Infinity
		});

		var schoeff = spriteFactory.schoeffPoke(L7.p(32, 52));
		var goBears = spriteFactory.goBears(L7.p(14, 37));

		var schoeffBoard = new L7.Board({
			width: board.width,
			height: board.height,
			tileSize: tileSize
		});
		schoeffBoard.offsetY = -schoeff.framesConfig.height * schoeffBoard.tileSize;

		schoeffBoard.addActor(schoeff);

		schoeffBoard.ani.sequence(function(ani) {
			ani.wait(9000);
			ani.tween({
				targets: [schoeffBoard],
				property: 'offsetY',
				from: schoeffBoard.offsetY,
				to: 0,
				duration: 500
			});
			ani.wait(500);
			ani.invoke(function() {
				schoeffBoard.addActor(goBears);
			});
			ani.wait(2000);
			ani.invoke(function() {
				schoeffBoard.removeActor(goBears);
			});
		});

		var parallax = new L7.ParallaxBoard({
			boards: [board, schoeffBoard],
			width: board.width,
			height: board.height
		});

		return parallax;
	};

})();

(function() {
	SAM.Outro = function(bgImage, tileSize, spriteFactory) {
		var levelLoader = new L7.ColorLevelLoader(bgImage, tileSize, 0);
		var board = levelLoader.load();
		board.parallaxRatio = 0;

		var danceBoard = new L7.Board({
			tileSize: tileSize * 1.8,
			width: board.width,
			height: board.height,
			parallaxRatio: 0
		});

		var sarahWedding = spriteFactory.sarahWedding(L7.p(18, 21));
		var mattWedding = spriteFactory.mattWedding(L7.p(10, 21));

		danceBoard.addActors(sarahWedding, mattWedding);

		danceBoard.ani.frame({
			targets: [sarahWedding, mattWedding],
			rate: 150,
			looping: 'backforth',
			pieceSetIndex: 1,
			loops: Infinity
		});

		var parallax = new L7.ParallaxBoard({
			boards: [board, danceBoard],
			width: board.width,
			height: board.height
		});

		parallax.destroy = function() {
			SAM.game.viewport.reset();
		};

		return parallax;
	};
})();



(function() {
	SAM.PoolSchoeffLump = function(bgImage, tileSize, spriteFactory) {
		var levelLoader = new L7.ColorLevelLoader(bgImage, tileSize, 0);
		var board = levelLoader.load();

		var schoeff = spriteFactory.schoeffLump(L7.p(36, 33));
		var please = spriteFactory.please(L7.p(28, 22));
		var lucy = spriteFactory.lucy(L7.p(18, 29));

		board.addActors(lucy, schoeff);

		board.ani.together(function(ani) {
			ani.frame({
				targets: [lucy],
				pieceSetIndex: 1,
				rate: 150,
				looping: 'backforth',
				loops: Infinity
			});
			ani.sequence(function(ani) {
				ani.wait(2000);
				ani.invoke(function() {
					board.addActor(please);
				});
			});
		});

		return board;
	};

})();

(function() {
	SAM.PoolSchoeffOutside = function(bgImage, tileSize, spriteFactory) {
		var levelLoader = new L7.ColorLevelLoader(bgImage, tileSize, 0);
		var board = levelLoader.load();

		var schoeff = spriteFactory.schoeffLaying(L7.p(36, 33));
		var ellipsis = spriteFactory.ellipsis(L7.p(28, 18));
		var lucy = spriteFactory.lucy(L7.p(18, 29));

		board.addActors(lucy, schoeff);

		board.ani.together(function(ani) {
			ani.frame({
				targets: [lucy],
				pieceSetIndex: 1,
				rate: 150,
				looping: 'backforth',
				loops: Infinity
			});
			ani.sequence(function(ani) {
				ani.wait(2000);
				ani.invoke(function() {
					board.addActor(ellipsis);
				});
			});
		});

		return board;
	};

})();


(function() {
	SAM.Race = function(bgImage, tileSize, spriteFactory) {
		var levelLoader = new L7.ColorLevelLoader(bgImage, tileSize, 0);
		var board = levelLoader.load();

		var matt = spriteFactory.mattRace(L7.p(20, 20));
		var sarah = spriteFactory.sarahRace(L7.p(30, 21));
		var clock = spriteFactory.raceClock(L7.p(5, 24));
		var pr = spriteFactory.pr(L7.p(33, 37));
		var yeahBabe = spriteFactory.yeahBabe(L7.p(7, 37));

		board.addActors(matt, sarah, clock);

		board.ani.together(function(ani) {
			ani.frame({
				targets: [matt, sarah],
				pieceSetIndex: 1,
				rate: 150,
				looping: 'backforth',
				loops: Infinity
			});
			ani.sequence(function(ani) {
				ani.wait(2000);
				ani.invoke(function() {
					board.addActor(pr);
				});
				ani.wait(3500);
				ani.invoke(function() {
					board.removeActor(pr);
				});
				ani.wait(200);
				ani.invoke(function() {
					board.addActor(yeahBabe);
				});
				ani.wait(3500);
				ani.invoke(function() {
					board.removeActor(yeahBabe);
				});
			});
		});

		clock.ani.frame({
			targets: [clock],
			pieceSetIndex: 1,
			rate: 1000,
			looping: 'backforth',
			loops: Infinity
		});

		return board;
	};

})();

(function() {
	SAM.Seattle = function(bgImage, duck, tileSize, spriteFactory) {
		var levelLoader = new L7.ColorLevelLoader(bgImage, tileSize, 0);
		var board = levelLoader.load();

		levelLoader = new L7.ColorLevelLoader(duck, tileSize, 0);
		duck = levelLoader.load();
		duck.parallaxRatio = 0.4;

		var matt = spriteFactory.mattDuck(L7.p(95, 21));
		var sarah = spriteFactory.sarahDuck(L7.p(109, 22));
		var lucy = spriteFactory.lucyDuck(L7.p(123, 26));
		var chad = spriteFactory.chadDuck(L7.p(137, 21));
		var mom = spriteFactory.momDuck(L7.p(151, 22));

		duck.addActors(matt, sarah, lucy, chad, mom);

		duck.ani.frame({
			targets: [sarah, matt, lucy, chad, mom],
			pieceSetIndex: 1,
			rate: 150,
			looping: 'backforth',
			loops: Infinity
		});

		var parallax = new L7.ParallaxBoard({
			boards: [board, duck],
			tileSize: tileSize,
			width: board.width,
			height: board.height
		});

		duck.ani.repeat(Infinity, function(ani) {
			ani.invoke(function() {
				SAM.game.viewport.scrollX(5);
			});
			ani.wait(1);
		});

		parallax.destroy = function() {
			SAM.game.viewport.reset();
		};

		return parallax;
	};
})();


(function() {
	SAM.Skydiving = function(bgImage, clouds, landscape, tileSize, spriteFactory) {
		var levelLoader = new L7.ColorLevelLoader(bgImage, tileSize, 0);
		var board = levelLoader.load();

		levelLoader = new L7.ColorLevelLoader(clouds, tileSize, 0);
		clouds = levelLoader.load();

		levelLoader = new L7.ColorLevelLoader(landscape, tileSize, 0);
		landscape = levelLoader.load();

		var chad = spriteFactory.chad(L7.p(33, 29));
		var tammy = spriteFactory.tammy(L7.p(41, 0));
		var bobo = spriteFactory.bobo(L7.p(7, 15));
		var boo = spriteFactory.boo(L7.p(19, 48));

		board.addActors(chad, tammy, bobo, boo);

		board.ani.frame({
			targets: [chad, tammy, bobo, boo],
			pieceSetIndex: 1,
			rate: 150,
			looping: 'backforth',
			loops: Infinity
		});

		board.parallaxRatio = 0;
		clouds.parallaxRatio = 0.4;
		landscape.parallaxRatio = 0.2;

		var parallax = new L7.ParallaxBoard({
			boards: [landscape, board, clouds],
			tileSize: tileSize,
			width: board.width,
			height: board.height
		});

		clouds.ani.repeat(Infinity, function(ani) {
			ani.invoke(function() {
				SAM.game.viewport.scrollY(1);
			});
			ani.wait(10);
		});

		parallax.destroy = function() {
			SAM.game.viewport.reset();
		};
		
		return parallax;
	};

})();


(function() {
	SAM.TedGarden = function(bgImage, tileSize, spriteFactory) {
		var levelLoader = new L7.ColorLevelLoader(bgImage, tileSize, 0);
		var board = levelLoader.load();

		var ted = spriteFactory.ted(L7.p(34, 40));
		var chris = spriteFactory.chris(L7.p(49, 41));
		var ben = spriteFactory.ben(L7.p(2, 23));

		board.addActors(chris, ted, ben);

		board.ani.frame({
			targets: [ted, chris, ben],
			pieceSetIndex: 1,
			rate: 150,
			looping: 'backforth',
			loops: Infinity
		});

		return board;
	};

})();


(function() {
	SAM.UpperPeninsula = function(bgImage, tileSize, spriteFactory) {
		var levelLoader = new L7.ColorLevelLoader(bgImage, tileSize, 0);
		var board = levelLoader.load();

		var matt = spriteFactory.matt(L7.p(20, 20));
		var sarah = spriteFactory.sarah(L7.p(30, 21));
		var chris = spriteFactory.chris(L7.p(40, 21));
		var ted = spriteFactory.ted(L7.p(50, 21));
		var emily = spriteFactory.emily(L7.p(10, 21));
		var phil = spriteFactory.phil(L7.p(0, 19));
		var goPackers = spriteFactory.goPackers(L7.p(3, 5));
		var yeahPackers = spriteFactory.yeahPackers(L7.p(2, 5));

		board.addActors(matt, sarah, chris, ted, emily, phil);

		board.ani.together(function(ani) {
			ani.frame({
				targets: [matt, sarah, chris, ted, emily, phil],
				pieceSetIndex: 1,
				rate: 150,
				looping: 'backforth',
				loops: Infinity
			});
			ani.sequence(function(ani) {
				ani.wait(2000);
				ani.invoke(function() {
					board.addActor(goPackers);
				});
				ani.wait(3500);
				ani.invoke(function() {
					board.removeActor(goPackers);
				});
				ani.wait(500);
				ani.invoke(function() {
					board.addActor(yeahPackers);
				});
				ani.wait(3000);
				ani.invoke(function() {
					board.removeActor(yeahPackers);
				});
			});
		});

		return board;
	};

})();

(function() {

	var row1 = {
		tileSizeRatio: 1,
		from: 'right',
		positionTweak: 0,
		actors: [{
			n: 'boo',
			y: 17
		},
		{
			n: 'chad',
			y: 11
		},
		{
			n: 'tammy',
			y: 12
		},
		{
			n: 'schoeffDance',
			y: 13
		},
		{
			n: 'bobo',
			y: 16
		},
		{
			n: 'ben',
			y: - 4,
			x: 1
		}],
		duration: 8000
	};

	var row2 = {
		tileSizeRatio: 1.2,
		from: 'left',
		positionTweak: 0,
		actors: [{
			n: 'ted',
			y: 17
		},
		{
			n: 'chris',
			y: 17
		},
		{
			n: 'buddy',
			y: 20
		},
		{
			n: 'dad',
			y: 15
		},
		{
			n: 'mom',
			y: 16
		},
		{
			n: 'livi',
			y: 21
		}],
		duration: 9000,
		delay: 1200
	};

	var row3 = {
		tileSizeRatio: 1.4,
		from: 'right',
		positionTweak: 0,
		actors: [{
			n: 'phil',
			y: 20
		},
		{
			n: 'emily',
			y: 22
		},
		{
			n: 'lily',
			y: 24
		},
		{
			n: 'lucy',
			y: 23
		}],
		duration: 10000,
		delay: 2000
	};

	var row4 = {
		tileSizeRatio: 1.8,
		from: 'left',
		positionTweak: 10,
		actors: [{
			n: 'mattWedding',
			y: 21
		}],
		duration: 10000,
		delay: 4000
	};

	var row5 = {
		tileSizeRatio: 1.8,
		from: 'right',
		positionTweak: 18,
		actors: [{
			n: 'sarahWedding',
			y: 21
		}],
		duration: 10000,
		delay: 4000
	};


	SAM.Wedding = function(bgImage, tileSize, spriteFactory) {
		var levelLoader = new L7.ColorLevelLoader(bgImage, tileSize, 0);
		var board = levelLoader.load();
		board.parallaxRatio = 0;

		var john = spriteFactory.john(L7.p(10, 0));
		var byron = spriteFactory.byron(L7.p(40, - 4));
		var nicky = spriteFactory.nicky(L7.p(22, 0));

		board.addActors(john, byron, nicky);

		board.ani.frame({
			targets: [john, byron, nicky],
			pieceSetIndex: 0,
			rate: 150,
			looping: 'backforth',
			loops: Infinity
		});

		this.baseWidth = board.width;
		this.baseHeight = board.height;
		this.tileSize = tileSize;
		this.spriteFactory = spriteFactory;

		var firstRow = this._getRow(row1);
		var secondRow = this._getRow(row2);
		var thirdRow = this._getRow(row3);
		var fourthRow = this._getRow(row4);
		var fifthRow = this._getRow(row5);

		var parallax = new L7.ParallaxBoard({
			boards: [board, firstRow, secondRow, thirdRow, fourthRow, fifthRow],
			width: board.width,
			height: board.height
		});

		parallax.destroy = function() {
			SAM.game.viewport.reset();
		};

		return parallax;
	};

	SAM.Wedding.prototype._getRow = function(config) {
		var board = new L7.Board({
			width: this.baseWidth,
			height: this.baseHeight,
			tileSize: this.tileSize * config.tileSizeRatio,
			parallaxRatio: 0
		});

		board.offsetX = board.pixelWidth;
		if (config.from === 'right') {
			board.offsetX *= - 1;
		}

		var tweak = config.positionTweak || 0;
		var actors = [];

		for (var i = 0; i < config.actors.length; ++i) {
			var actorConfig = config.actors[i];
			var xOffset = actorConfig.x || 0;
			var actor = this.spriteFactory[actorConfig.n](L7.p(i * 9 + tweak + xOffset, actorConfig.y));
			board.addActor(actor);
			actors.push(actor);
		}

		board.ani.together(function(ani) {
			ani.sequence(function(ani) {
				ani.wait(config.delay || 0);
				ani.tween({
					targets: [board],
					property: 'offsetX',
					from: board.offsetX,
					to: config.offsetTo || 0,
					duration: config.duration
				});
			});
			ani.frame({
				targets: actors,
				pieceSetIndex: 1,
				rate: 150,
				looping: 'backforth',
				loops: Infinity
			});
		});

		return board;
	};
})();

(function() {
	L7.useWebGL = true;

	function dumpWarning(image, text) {
		var container = document.getElementById('introContainer');
		container.innerHTML = '<img src="' + image + '"/><div>' + text + '</div>';
	}

	function clearContainer(container) {
		while (container.hasChildNodes()) {
			container.removeChild(container.firstChild);
		}
	}

	function createUrl(file) {
		var url;
		if (window.createObjectURL) {
			url = window.createObjectURL(file)
		} else if (window.createBlobURL) {
			url = window.createBlobURL(file)
		} else if (window.URL && window.URL.createObjectURL) {
			url = window.URL.createObjectURL(file)
		} else if (window.webkitURL && window.webkitURL.createObjectURL) {
			url = window.webkitURL.createObjectURL(file)
		}

		return url;
	}

	function loadMusic(file, callback) {
		var url = createUrl(file);

		var audio = document.createElement('audio');
		document.body.appendChild(audio);

		audio.addEventListener('canplaythrough', function() {
			audio.play();
		}, false);

		audio.addEventListener('play', callback, false);

		audio.src = url;
	}

	function addMp3Input(containerId, callback) {
		var container = document.getElementById(containerId);
		clearContainer(container);

		var div = document.createElement('div');
		div.innerHTML = "<div id='dragContainer'><img id='dragImg' src='drag.png' alt='drag an mp3 here to start' /><span id='asterisk'>*</span></div>" + "<div id='skipContainer'><a id='skipLink' href='#'>or start with no music</a></div><div id='disclaimer'>* best results with John Butler Trio\'s \"Funky Tonight\"</div>";

		container.appendChild(div);
		var image = document.getElementById('dragImg');
		var baseOpacity = 0.7;
		image.style.opacity = baseOpacity;


		function clearBg(e) {
			e.preventDefault();
			e.stopPropagation();
			image.style.opacity = baseOpacity;
		}

		image.addEventListener('dragenter', function(e) {
			e.preventDefault();
			e.stopPropagation();
			image.style.opacity = 1;
		}, true);

		image.addEventListener('dragleave', function(e) {
			clearBg(e);	
		}, true);
		
		image.addEventListener('dragover', function(e) {
			e.preventDefault();
			e.stopPropagation();
			return false;
		}, true);

		image.addEventListener('drop', function(e) {
			clearBg(e);

			var file = e.dataTransfer.files[0];

			if (file) {
				loadMusic(file, callback);
			}

			return false;
		},
		true);

		var skipLink = document.getElementById('skipLink');
		skipLink.addEventListener('click', function(e) {
			e.preventDefault();
			e.stopPropagation();
			callback();
			return false;
		},
		false);
	}

	function onImagesLoaded(images) {
		var tileSize = 8;

		var spriteFactory = new SAM.SpriteFactory(images.dance);
		var storyBoardConfig = [{
			board: new SAM.Intro(images.intro, tileSize, spriteFactory),
			duration: 20000
		},
		{
			board: new SAM.Seattle(images.seattle, images.duck, tileSize, spriteFactory),
			duration: 18000
		},
		{
			board: new SAM.Race(images.race, tileSize, spriteFactory),
			duration: 12000
		},
		{
			board: new SAM.Hawaii(images.oceanBg, images.oceanFg, tileSize, spriteFactory),
			duration: 13000
		},
		{
			board: new SAM.PoolSchoeffLump(images.pool, tileSize, spriteFactory),
			duration: 15000
		},
		{
			board: new SAM.DadTractor(images.dadTractor, images.iowaClouds, tileSize, spriteFactory),
			duration: 13000
		},
		{
			board: new SAM.CasaBonita(images.casabonita, tileSize, spriteFactory),
			duration: 12000
		},
		{
			board: new SAM.TedGarden(images.tedGarden, tileSize, spriteFactory),
			duration: 16000
		},
		{
			board: new SAM.CatLineSchoeffSits(tileSize, spriteFactory),
			duration: 13000
		},
		{
			board: new SAM.Hockey(images.hockeyBg, images.hockeyFg, tileSize, spriteFactory),
			duration: 12000
		},
		{
			board: new SAM.CatLineSchoeffSits(tileSize, spriteFactory),
			duration: 13000
		},
		// dogs ooooooooooo woo hoo, total of 33 seconds
		{
			board: new SAM.DogLine(tileSize, spriteFactory),
			duration: 33000 / 4
		},
		{
			board: new SAM.DogLine(tileSize, spriteFactory),
			duration: 33000 / 4
		},
		{
			board: new SAM.DogLine(tileSize, spriteFactory),
			duration: 33000 / 4
		},
		{
			board: new SAM.DogLine(tileSize, spriteFactory),
			duration: 33000 / 4
		},
		{
			board: new SAM.LivingRoom(images.livingRoom, tileSize, spriteFactory),
			duration: 21000
		},
		{
			board: new SAM.Skydiving(images.skydiving, images.clouds, images.landscape, tileSize, spriteFactory),
			duration: 13000
		},
		{
			board: new SAM.PoolSchoeffOutside(images.pool, tileSize, spriteFactory),
			duration: 10000
		},
		{
			board: new SAM.CatLine(tileSize, spriteFactory),
			duration: 13000
		},
		{
			board: new SAM.UpperPeninsula(images.upperPeninsula, tileSize, spriteFactory),
			duration: 15000
		},
		{
			board: new SAM.LowerPeninsula(images.lowerPeninsula, tileSize, spriteFactory),
			duration: 15000
		},
		{
			board: new SAM.Wedding(images.stage, tileSize, spriteFactory),
			duration: 40000
		},
		{
			board: new SAM.Outro(images.outro, tileSize, spriteFactory),
			duration: 100000
		}];

		addMp3Input('loadingContainer', function() {
			var storyBoard = new L7.StoryBoard(storyBoardConfig);
			var game = new L7.Game({
				width: storyBoard.pixelWidth,
				height: storyBoard.pixelHeight,
				board: storyBoard,
				container: document.getElementById('introContainer'),
				clearOutContainer: true
			});

			SAM.game = game;

			game.go();
		});
	}

	if (L7.isSupportedBrowser) {
		if (L7.isWebGLAvailable) {
			var imageLoader = new L7.ImageLoader({
				srcs: ['resources/images/dance.png', 'resources/images/intro.png', 'resources/images/race.png', 'resources/images/pool.png', 'resources/images/livingRoom.png', 'resources/images/tedGarden.png', 'resources/images/skydiving.png', 'resources/images/landscape.png', 'resources/images/clouds.png', 'resources/images/hockeyBg.png', 'resources/images/hockeyFg.png', 'resources/images/lowerPeninsula.png', 'resources/images/upperPeninsula.png', 'resources/images/stage.png', 'resources/images/dadTractor.png', 'resources/images/iowaClouds.png', 'resources/images/casabonita.png', 'resources/images/oceanBg.png', 'resources/images/oceanFg.png', 'resources/images/outro.png', 'resources/images/duck.png', 'resources/images/seattle.png'],
				loadNow: true,
				handler: onImagesLoaded
			});
		} else {
			dumpWarning('noWebGL.png', 'Your browser does not support WebGL, which is required to see the animation');
		}
	} else {
		dumpWarning('browserSupportBigG.gif', 'Sorry, the animation only works in Chrome or the latest Firefox');
	}

})();

(function() {
	SAM.SpriteFactory = function(image) {
		this.image = image;
	};

	SAM.SpriteFactory.prototype = {
		fishGoingLeft: function(position) {
			return new L7.Actor({
				framesConfig: {
					src: this.image,
					width: 24,
					height: 26,
					direction: 'horizontal',
					sets: [[0], [0, 1]],
					initialSet: 0,
					initialFrame: 0,
					anchor: L7.p(0, 0),
					offset: L7.p(209, 121)
				},
				position: position || L7.p(0, 0)
			});
		},

		fishGoingRight: function(position) {
			return new L7.Actor({
				framesConfig: {
					src: this.image,
					width: 24,
					height: 26,
					flip: 'horizontal',
					direction: 'horizontal',
					sets: [[0], [0, 1]],
					initialSet: 0,
					initialFrame: 0,
					anchor: L7.p(0, 0),
					offset: L7.p(209, 121)
				},
				position: position || L7.p(0, 0)
			});
		},


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
	
		blackMantaGoingLeft: function(position) {
			return new L7.Actor({
				framesConfig: {
					src: this.image,
					width: 22,
					height: 21,
					direction: 'horizontal',
					flip: 'horizontal',
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

		ugh: function(position) {
			return new L7.Actor({
				framesConfig: {
					src: this.image,
					width: 21,
					height: 14,
					direction: 'horizontal',
					sets: [[0]],
					initialSet: 0,
					initialFrame: 0,
					anchor: L7.p(0, 0),
					offset: L7.p(214, 36)
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

		pr: function(position) {
			return new L7.Actor({
				framesConfig: {
					src: this.image,
					width: 18,
					height: 13,
					direction: 'horizontal',
					sets: [[0]],
					initialSet: 0,
					initialFrame: 0,
					anchor: L7.p(0, 0),
					offset: L7.p(214, 51)
				},
				position: position || L7.p(0, 0)
			});
		},

		yeahBabe: function(position) {
			return new L7.Actor({
				framesConfig: {
					src: this.image,
					width: 45,
					height: 13,
					direction: 'horizontal',
					sets: [[0]],
					initialSet: 0,
					initialFrame: 0,
					anchor: L7.p(0, 0),
					offset: L7.p(232, 51)
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

		mattDuck: function(position) {
			return new L7.Actor({
				framesConfig: {
					src: this.image,
					width: 9,
					height: 10,
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

		sarahDuck: function(position) {
			return new L7.Actor({
				framesConfig: {
					src: this.image,
					width: 9,
					height: 9,
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

		lucyDuck: function(position) {
			return new L7.Actor({
				framesConfig: {
					src: this.image,
					width: 9,
					height: 5,
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

		momDuck: function(position) {
			return new L7.Actor({
				framesConfig: {
					src: this.image,
					width: 10,
					height: 9,
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

		chadDuck: function(position) {
			return new L7.Actor({
				framesConfig: {
					src: this.image,
					width: 10,
					height: 10,
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

		yeahPackers: function(position) {
			return new L7.Actor({
				framesConfig: {
					src: this.image,
					width: 54,
					height: 13,
					direction: 'horizontal',
					sets: [[0]],
					initialSet: 0,
					initialFrame: 0,
					anchor: L7.p(0, 0),
					offset: L7.p(78,80)
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

