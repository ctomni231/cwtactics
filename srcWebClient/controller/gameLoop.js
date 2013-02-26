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

            /*
             MOVE ANIMATED ?
            var move = actionData.getMovePath();
            if( move !== null && move.length > 0 ){

              var moveAnimCmd = view.getCommandHook("move");
              controller.currentAnimatedKey = moveAnimCmd;
              moveAnimCmd.prepare( actionData );

              if( CLIENT_DEBUG ){
                util.logInfo( "preparing command animation for",moveAnimCmd.key );
              }
            }
            */

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

            /*
             SWAP IF NO MOVE ANIMATION IS AVAILABLE
            if( controller.currentAnimatedKey === null &&
              controller.currentAnimatedKeyNext !== null ){

              controller.currentAnimatedKey = controller.currentAnimatedKeyNext;
              controller.currentAnimatedKeyNext = null;
            }
            
            controller.releaseActionDataObject( actionData );
            */
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