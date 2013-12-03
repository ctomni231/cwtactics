controller.screenStateMachine.structure.NONE = Object.create(controller.stateParent);

controller.screenStateMachine.structure.NONE.section = null;

controller.screenStateMachine.structure.NONE.start = function(){
  if( DEBUG ) util.log("start client");

  (function setupAnimationFrame(){
    if( DEBUG ) util.log("setup animation frame");

    var oldTime = new Date().getTime();
    function looper(){

      // acquire next frame
      requestAnimationFrame( looper );

      // calculate delta
      var now = new Date().getTime();
      var delta = now - oldTime;
      oldTime = now;

      controller.updateGamePadControls(delta);

      // if the system is in the game loop, then update the game data
      if( controller.inGameLoop ){

        if( controller.update_inGameRound ) controller.gameLoop( delta );
        else controller.screenStateMachine.event("gameHasEnded"); // game ends --> stop game loop
      }

      if( controller.screenStateMachine.state === "MOBILE" ){
        controller.screenStateMachine.event("decreaseTimer", delta );
      }
    }

    // ENTER LOOP
    requestAnimationFrame( looper );
  })();
	
	return "LOAD"; 
};
