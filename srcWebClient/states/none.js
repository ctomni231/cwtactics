controller.screenStateMachine.structure.NONE = Object.create(controller.stateParent);

controller.screenStateMachine.structure.NONE.section = null;

controller.screenStateMachine.structure.NONE.start = function(){
  if( DEBUG ) util.log("start client");
  
  controller.hideMenu();

  var deltaEL = document.getElementById("DELTA");
  var deltaEL2 = document.getElementById("DELTA2");
  var drops = 0;
  var drops2 = 0;
  var lastDelta = 0;
  var evenFrame = false;
  (function setupAnimationFrame(){
    if( DEBUG ) util.log("setup animation frame");

    var oldTime = new Date().getTime();
    function looper(){
      
      // calculate delta
      var now = new Date().getTime();
      var delta = now - oldTime;
      oldTime = now;
      
      if( delta > 32 ){
        if( evenFrame ) drops++
        else drops2++;
        deltaEL.innerHTML = drops;
        deltaEL2.innerHTML = drops2;
      }      

      evenFrame = !evenFrame;
      
      controller.updateInputCoolDown( delta );
      controller.updateGamePadControls(delta);

      var usedInput = controller.input_evalNextKey();
      
      // if the system is in the game loop, then update the game data
      if( controller.inGameLoop ){

        if( controller.update_inGameRound ){
          controller.gameLoop( delta , evenFrame, usedInput );
        } else controller.screenStateMachine.event("gameHasEnded"); // game ends --> stop game loop
      }

      lastDelta = delta;
      
      if( controller.screenStateMachine.state === "MOBILE" ){
        controller.screenStateMachine.event("decreaseTimer", delta );
      }
      
      // acquire next frame
      requestAnimationFrame( looper );
    }

    // ENTER LOOP
    requestAnimationFrame( looper );
  })();
	
  return "LOAD"; 
};
