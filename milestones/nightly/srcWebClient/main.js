cwt.defineLayer( CWT_LAYER_CLIENT,
  function( client, userAction, data, util, persistence){

    client.ID_APP_DIV = "CWTWCW_APP";

    /**
     * Updates the game logic and graphic.
     *
     * @param delta time since last call in ms
     */
    client.update = function( delta ){

      if( client.isMoveAnimationActive() === false ){

        // UPDATE LOGIC
        if( userAction.hasNextAction() ){
          var msg = userAction.evaluateNextAction();

          if( msg.k === "move" ){
            client.prepareMoveAnimation(msg.a[0], msg.a[1],msg.a[2], msg.a[3]);
          }

          if( util.DEBUG ){
            util.logInfo("Executed a",msg.k,"command");
          }
        }
      }
      else{

        // UPDATE MOVE
        client.updateMoveAnimation( delta );
      }

      // UPDATE ANIMATION STEP
      if( client.moveScreenX === 0 &&
          client.moveScreenY === 0 ){

        client.updateAnimationTimer( delta );
      }
      else{
        client.solveMapShift();
      }

      // RENDER
      if( client.drawChanges > 0 ){
        client.drawScreen();
      }

      // RENDER MOVE
      if( client.isMoveAnimationActive() === true ) client.drawMoveAnimation();
    };

    /**
     * Iterates through the tiles on the screen.
     *
     * @param cb
     */
    client.eachPosOfScreen = function( cb ){

      var x = client.screenX;
      var yS = client.screenY;
      var xe = x+client.screenWidth;
      var ye = yS+client.screenHeight;

      // CHECK BOUNDS
      if( xe > data.mapWidth() ) xe = data.mapWidth();
      if( ye > data.mapHeight() ) ye = data.mapHeight();

      // ITERATE THROUGH THE SCREEN
      for( ; x<xe; x++ ){
        for( var y=yS ; y<ye; y++ ){
          cb( x, y );
        }
      }
    };
  });