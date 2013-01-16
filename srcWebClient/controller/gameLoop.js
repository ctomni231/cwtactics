/**
 *
 */
controller.currentAnimatedKey = null;

/**
 *
 */
controller.currentAnimatedKeyNext = null;

controller.noRendering = true;

/**
 *
 * @param delta
 */
controller.gameLoop = function( delta ){

  var inMove = (controller.moveScreenX !== 0 || controller.moveScreenY !== 0);

  // 0. MAP SHIFT
  if( inMove ){
    controller.solveMapShift();
  }
  else{

    // 1.1. UPDATE LOGIC
    if( controller.currentAnimatedKey === null ){
      if( !controller.isBufferEmpty() ){
        var actionData = controller.evalNextMessageFromBuffer();
        if( actionData !== null ){

          var key = actionData.getAction();

          // MOVE ANIMATED ?
          var move = actionData.getMovePath();
          if( move !== null && move.length > 0 ){

            var moveAnimCmd = view.getCommandHook("move");
            controller.currentAnimatedKey = moveAnimCmd;
            moveAnimCmd.prepare( actionData );

            if( CLIENT_DEBUG ){
              util.logInfo( "preparing command animation for",moveAnimCmd.key );
            }
          }

          // IS ANIMATED ?
          var animCmd = view.getCommandHook(key);
          if( animCmd !== null ){

            animCmd.prepare( actionData );
            controller.currentAnimatedKeyNext = animCmd;

            if( CLIENT_DEBUG ){
              util.logInfo( "preparing command animation for",animCmd.key );
            }
          }

          // SWAP IF NO MOVE ANIMATION IS AVAILABLE
          if( controller.currentAnimatedKey === null &&
                controller.currentAnimatedKeyNext !== null ){

            controller.currentAnimatedKey = controller.currentAnimatedKeyNext;
            controller.currentAnimatedKeyNext = null;
          }

          // RELEASE COMMAND
          controller.releaseActionDataObject( actionData );
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

  if( !controller.noRendering && !inMove ){
    // 4. RENDER COMMAND ANIMATION
    if( controller.currentAnimatedKey !== null ){

      if( controller.currentAnimatedKey.isDone() ){

        if( CLIENT_DEBUG ){
          util.logInfo(
            "completed command animation for", controller.currentAnimatedKey.key
          );
        }

        controller.currentAnimatedKey = null;

        if( controller.currentAnimatedKeyNext !== null ){
          controller.currentAnimatedKey = controller.currentAnimatedKeyNext;
          controller.currentAnimatedKeyNext = null;
        }
      }
      else{ controller.currentAnimatedKey.render(); }
    }
  }
};

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

  controller.input.event("start");
  view.fitScreenToDeviceOrientation();

  // ENTER LOOP
  window.requestAnimationFrame( looper );
};