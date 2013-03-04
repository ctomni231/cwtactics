/**
 *
 */
controller.currentAnimatedKey = null;

// controller.currentAnimatedKeyNext = null;

/**
 *
 */
controller.noRendering = true;

/**
 *
 */
controller.lockCommandEvaluation = false;

/**
 *
 * @param delta
 */
controller.gameLoop = function( delta ){

  controller.updateTurnTimer( delta );

  var inMove = (controller.moveScreenX !== 0 || controller.moveScreenY !== 0);
  
  // 0. MAP SHIFT
  if( inMove ){
    controller.solveMapShift();
  }
  else{

    // 1.1. UPDATE LOGIC
    if( controller.currentAnimatedKey === null ){


      if( controller.lockCommandEvaluation === false ){

        if( !controller.noNextActions() ){
          var data = controller.doNextAction();
          if( data !== null ){

            var key = data[ data.length-1 ];
            view.invokeCommandListener(key,data);

            // IS ANIMATED ?
            var animCmd = view.getCommandHook(key);
            if( animCmd !== null ){

              animCmd.prepare.apply( animCmd, data );
              controller.currentAnimatedKey = animCmd;

              if( CLIENT_DEBUG ){
                util.log( "preparing command animation for", key );
              }
            }
          }
        }

      }
    }
    // 1.2. UPDATE COMMAND ANIMATION
    else{
      controller.currentAnimatedKey.update( delta );
    }

    // 2. UPDATE SPRITE ANIMATION
    view.updateSpriteAnimations( delta );
  }

  // 3. RENDER SCREEN
  if( !controller.noRendering && view.drawScreenChanges > 0 ){
    view.renderMap( controller.screenScale );
  }
  
  // UPDATE CURSOR
  if( controller.stateMachine.state === "ACTION_SELECT_TILE" ){
    
    var r = view.selectionRange;
    var x = controller.mapCursorX;
    var y = controller.mapCursorY;
    var lX;
    var hX;
    var lY = y-r;
    var hY = y+r;
    if( lY < 0 ) lY = 0;
    if( hY >= model.mapHeight ) hY = model.mapHeight-1;
    for( ; lY<=hY; lY++ ){
  
      var disY = Math.abs( lY-y );
      lX = x-r+disY;
      hX = x+r-disY;
      if( lX < 0 ) lX = 0;
      if( hX >= model.mapWidth ) hX = model.mapWidth-1;
      for( ; lX<=hX; lX++ ){
  
        view.markForRedraw(lX,lY);
      }
    }
  }

  if( !controller.noRendering && !inMove ){
    
    // 4. RENDER COMMAND ANIMATION
    if( controller.currentAnimatedKey !== null ){

      if( controller.currentAnimatedKey.isDone() ){

        if( CLIENT_DEBUG ){
          util.log( "completed command animation for", controller.currentAnimatedKey.key );
        }

        controller.currentAnimatedKey = null;
      } else { 
        controller.currentAnimatedKey.render(); 
      }
    }
  }
};

/**
 *
 */
controller.enterGameLoop = function(){

  if( CLIENT_DEBUG ) util.logInfo("enter game loop");

  var fps = 0, now, lastUpdate = (new Date())*1 - 1;
  var fpsFilter = 50;
  var oldTime = new Date().getTime();
  function looper(){
    requestAnimationFrame( looper );

    var now = new Date().getTime();
    var delta = now - oldTime;
    oldTime = now;

    var thisFrameFPS = 1000 / ((now=new Date) - lastUpdate);
    if( !isNaN(thisFrameFPS) ) fps += (thisFrameFPS - fps) / fpsFilter;
    lastUpdate = now;

    controller.gameLoop( delta );
  }

  var fpsOut = document.getElementById('fps');
  setInterval(function(){
    fpsOut.innerHTML = CWT_VERSION + " " + fps.toFixed(1) + "fps";
  }, 1000);

  controller.stateMachine.event("start");
  view.fitScreenToDeviceOrientation();

  // ENTER LOOP
  window.requestAnimationFrame( looper );
};