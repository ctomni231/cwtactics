cwt.defineLayer( CWT_LAYER_CLIENT,
  function( client, userAction, data, util, persistence){

    var actions = null;

    /**
     * Screen movement on x axis.
     * If this variable is lower zero, the screen will move left a bit
     * in every update step until it reaches zero. If the value is
     * greater zero it will move right.
     */
    client.moveScreenX = 0;

    /**
     * Screen movement on y axis.
     * If this variable is lower zero, the screen will move up a bit
     * in every update step until it reaches zero. If the value is
     * greater zero it will move down.
     */
    client.moveScreenY = 0;

    var checkFocus = function( x,y ){
      if( userAction.getValueOfSelectionTile(x,y) > -1 ){
        client.markForRedraw(x,y);
      }
    };

    client.invokeActionAt = function( x,y ){
      if( userAction.currentState() === userAction.STATE_SELECT_ACTION ) return;
      if( userAction.currentState() === userAction.STATE_SELECT_MOVE_PATH ){
        if( currentMoveIndex > 0 ){
          userAction.setPath( client.getCurrenttMovePathCopy() );
        }
      }

      if( util.DEBUG ) util.logInfo("got action request for (",x,",",y,")");
      userAction.selectTile(x,y);

      if( userAction.currentState() === userAction.STATE_SELECT_ACTION ){
        actions = userAction.getEntryList();
        client.eachPosOfScreen( checkFocus );
        client.showMenu( x,y, actions );
      }
      else if( userAction.currentState() === userAction.STATE_SELECT_MOVE_PATH ){
        client.eachPosOfScreen( checkFocus );
        client.resetCurrentMovePath( userAction.getSelectedId() );
      }
      else{
        userAction.completeRedraw();
      }
    };

    client.invokeCancel = function(){
      if( util.DEBUG ) util.logInfo("got cancel request");
      userAction.resetAction();
    };

    client.invokeActionFromMenu = function( index ){
      if( util.DEBUG ) util.logInfo("got action call for ",actions[index] );
      userAction.selectEntry( actions[index] );
      actions = null;
    };

    /**
     * Shifts the screen in relationship to the screen movement
     * variables.
     */
    client.solveMapShift = function(){
      var dir = -1;

      if( client.moveScreenX !== 0 ){

        if( client.moveScreenX < 0 ){ dir = 3; client.moveScreenX++; }
        else                        { dir = 1; client.moveScreenX--; }
      }
      else if( client.moveScreenY !== 0 ){

        if( client.moveScreenY < 0 ){ dir = 0; client.moveScreenY++; }
        else                        { dir = 2; client.moveScreenY--; }
      }

      if( dir !== -1 ) client.mapShift( dir, 1 );
    };

    /**
     * New map shift method. This one uses the update step based screen
     * movement algorithm.
     */
    client.betterMapShift = function( dir, len ){

           if( dir === 0 ) client.moveScreenY -= len;
      else if( dir === 1 ) client.moveScreenX += len;
      else if( dir === 2 ) client.moveScreenY += len;
      else if( dir === 3 ) client.moveScreenX -= len;
    };

    var shiftOldX = 0;
    var shiftOldY = 0;
    var checkShift = function( x,y ){

      var render = false;
      var tpN = data.tileByPos(x,y);
      var tpO = data.tileByPos(x+shiftOldX,y+shiftOldY);
      if(
        tpO !== tpN ||
          client.OVERLAYER[tpO] === true ||
          client.OVERLAYER[tpN] === true
      ){
        render = true;
        if( client.OVERLAYER[tpO] === true && y > 0 ){
          client.markForRedraw( x,y-1 );
        }
      }
      else{

        var unitN = data.unitByPos(x,y);
        var unitO = data.unitByPos(x+shiftOldX,y+shiftOldY);
        if( unitN !== null ||unitO !== null ){
          client.markForRedrawWithNeighbours( x,y );
        }
        else{

          var propN = data.propertyByPos(x,y);
          var propO = data.propertyByPos(x+shiftOldX,y+shiftOldY);
          if( propN !== null ||propO !== null ){
            render = true;
            if( propO !== null && y > 0 ){
              client.markForRedraw( x,y-1 );
            }
          }
        }
      }

      if( render ) client.markForRedraw( x,y );
    };

    /**
     * Shifts the screen by a distance in a given direction. This
     * function calculates the redraw map.
     */
    client.mapShift = function( dir, dis ){
      if( dis === undefined ) dis = 1;

      // UPDATE SCREEN META DATA
      switch (dir) {

        case 0:
          shiftOldX = 0;
          shiftOldY = +dis;
          client.screenY = Math.max( 0, client.screenY - dis );
          break;

        case 1:
          shiftOldX = -dis;
          shiftOldY = 0;
          client.screenX = Math.min(
             data.mapWidth()-client.screenX-1, client.screenX + dis
          );
          client.screenX = Math.max( 0, client.screenX );
          break;

        case 2:
          shiftOldX = 0;
          shiftOldY = -dis;
          client.screenY = Math.min(
            data.mapHeight()-client.screenY-1, client.screenY + dis
          );
          client.screenY = Math.max( 0, client.screenY );
          break;

        case 3:
          shiftOldX = +dis;
          shiftOldY = 0;
          client.screenX = Math.max( 0, client.screenX - dis );
          break;
      }

      // CHECK REDRAWS
      client.eachPosOfScreen( checkShift );
    };



    var currentMovePath = util.list( CWT_MAX_MOVE_RANGE, null );
    var currentMoveLeftPoints = -1;
    var currentMoveIndex = 0;
    var currentMovePathSourceX = -1;
    var currentMovePathSourceY = -1;
    var currentMovePathX = -1;
    var currentMovePathY = -1;

    client.resetCurrentMovePath = function( uid ){
      util.fill( currentMovePath, null );

      var unit = data.unitById( uid );
      currentMovePathSourceX = unit.x;
      currentMovePathSourceY = unit.y;
      currentMovePathX = unit.x;
      currentMovePathY = unit.y;
      currentMoveIndex = 0;

      currentMoveLeftPoints = Math.min( unit.fuel,
        data.unitSheet( unit.type ).moveRange );
    };

    client.getCurrenttMovePathCopy = function(){
      var path = [];
      for( var i=0; i<CWT_MAX_MOVE_RANGE; i++ ){
        if( currentMovePath[i] === null ) break;
        path[i] = currentMovePath[i];
      }
      return path;
    };

    client.appendToCurrentMovePath = function( x,y ){
      if( userAction.getValueOfSelectionTile(x,y) === -1 ||
        ( x === currentMovePathX && y === currentMovePathY ) ||
        ( x === currentMovePathSourceX && y === currentMovePathSourceY )
      ) return;

      var diffX = Math.abs( currentMovePathX - x );
      var diffY = Math.abs( currentMovePathY - y );

      if( util.DEBUG ){ util.logInfo("diffX:",diffX," diffY:",diffY ); }

      if( diffX === 0 && diffY === 0 ){
        // NOTHING HAPPENS
        return;
      }
      else{
        var diff = diffX+diffY;
        if( diff === 1 ){

          var code;

          if( diffX === 1 && diffY === 0 ){
            code = ( x < currentMovePathX )? data.MOVE_CODE_LEFT: data.MOVE_CODE_RIGHT; }
          else{
            code = ( y < currentMovePathY )? data.MOVE_CODE_UP: data.MOVE_CODE_DOWN; }

          var costs = userAction.getValueOfSelectionTile(x,y);
          if( currentMoveLeftPoints - costs >= 0 &&
              ( currentMoveIndex === 0 || !(
               ( currentMovePath[ currentMoveIndex-1 ] === data.MOVE_CODE_UP
                  &&
                 code === data.MOVE_CODE_DOWN )
                 ||
               ( currentMovePath[ currentMoveIndex-1 ] === data.MOVE_CODE_LEFT
                  &&
                 code === data.MOVE_CODE_RIGHT )
                 ||
               ( currentMovePath[ currentMoveIndex-1 ] === data.MOVE_CODE_DOWN
                  &&
                 code === data.MOVE_CODE_UP )
                 ||
               ( currentMovePath[ currentMoveIndex-1 ] === data.MOVE_CODE_RIGHT
                  &&
                 code === data.MOVE_CODE_LEFT )
              )
             )
            ){
            currentMovePath[ currentMoveIndex ] = code;
            currentMoveIndex++;
            currentMoveLeftPoints = currentMoveLeftPoints - costs;
            currentMovePathX = x;
            currentMovePathY = y;

            if( util.DEBUG ){
              util.logInfo("added (",x,",",y,") to the current path");
            }
          }
          else{
            if( util.DEBUG ){
              util.logInfo(
                "not enough points or back step, need to calculate path"
              );
            }

            var path = userAction.generatePathTo(x,y);
            client.resetCurrentMovePath( userAction.getSelectedId() );
            var cX = currentMovePathSourceX;
            var cY = currentMovePathSourceY;
            for( var i=0,e=path.length; i<e; i++ ){
              currentMovePath[i] = path[i];
              currentMoveIndex++;

              switch( path[i] ){
                case data.MOVE_CODE_UP : cY--; break;
                case data.MOVE_CODE_RIGHT : cX++; break;
                case data.MOVE_CODE_DOWN : cY++; break;
                case data.MOVE_CODE_LEFT : cX--; break;
              }

              currentMoveLeftPoints -= userAction.getValueOfSelectionTile(cX,cY);
            }

            currentMovePathX = cX;
            currentMovePathY = cY;

            if( util.DEBUG ){
              util.logInfo("set calculated path (",path,")");
            }
          }
        }
        else{

          var path = userAction.generatePathTo(x,y);
          client.resetCurrentMovePath( userAction.getSelectedId() );
          var cX = currentMovePathSourceX;
          var cY = currentMovePathSourceY;
          for( var i=0,e=path.length; i<e; i++ ){
            currentMovePath[i] = path[i];
            currentMoveIndex++;

            switch( path[i] ){
              case data.MOVE_CODE_UP : cY--; break;
              case data.MOVE_CODE_RIGHT : cX++; break;
              case data.MOVE_CODE_DOWN : cY++; break;
              case data.MOVE_CODE_LEFT : cX--; break;
            }

            currentMoveLeftPoints -= userAction.getValueOfSelectionTile(cX,cY);
          }

          currentMovePathX = cX;
          currentMovePathY = cY;

          if( util.DEBUG ){
            util.logInfo("set calculated path (",path,")");
          }
        }

        if( util.DEBUG ){
          util.logInfo(
            "current move data",
            "source (",currentMovePathSourceX,",",currentMovePathSourceY,")",
            "target (",currentMovePathX,",",currentMovePathY,")",
            "path (",currentMovePath,")",
            "rest points",currentMoveLeftPoints
          );
        }
      }
    };


    client.drawMoveArrow = function( ctx ){
      if( userAction.currentState() !== userAction.STATE_SELECT_MOVE_PATH ){
        return;
      }

      var tileX = client.tileSizeX;
      var tileY = client.tileSizeY;

      var cX = currentMovePathSourceX;
      var cY = currentMovePathSourceY;
      var oX;
      var oY;
      var tX;
      var tY;
      var pic;
      for( var i=0,e=currentMovePath.length; i<e; i++ ){
        if( currentMovePath[i] === null ) break;

        var oX = cX;
        var oY = cY;

        // CURRENT TILE
        switch( currentMovePath[i] ){
          case data.MOVE_CODE_UP :    cY--; break;
          case data.MOVE_CODE_RIGHT : cX++; break;
          case data.MOVE_CODE_DOWN :  cY++; break;
          case data.MOVE_CODE_LEFT :  cX--; break;
        }

        // NEXT TILE
        if( i === e-1 || currentMovePath[i+1] === null ){
          tX = -1; tY = -1;
        }
        else{
          switch( currentMovePath[i+1] ){
            case data.MOVE_CODE_UP :    tX = cX;   tY = cY-1; break;
            case data.MOVE_CODE_RIGHT : tX = cX+1; tY = cY;   break;
            case data.MOVE_CODE_DOWN :  tX = cX;   tY = cY+1; break;
            case data.MOVE_CODE_LEFT :  tX = cX-1; tY = cY;   break;
          }
        }

        if( tX == -1 ){

          // TARGET TILE
          switch( currentMovePath[i] ){
            case data.MOVE_CODE_UP :
              pic = client.getTileImageForType("ARROW_T_N"); break;
            case data.MOVE_CODE_RIGHT :
              pic = client.getTileImageForType("ARROW_T_E"); break;
            case data.MOVE_CODE_DOWN :
              pic = client.getTileImageForType("ARROW_T_S"); break;
            case data.MOVE_CODE_LEFT :
              pic = client.getTileImageForType("ARROW_T_W"); break;
          }
        }
        else{

          var diffX = Math.abs( tX-oX );
          var diffY = Math.abs( tY-oY );

          // IN THE MIDDLE OF THE WAY
          if( diffX === 2 ){
            pic = client.getTileImageForType("ARROW_L_EW");
          }
          else if( diffY === 2 ){
            pic = client.getTileImageForType("ARROW_L_NS");
          }
          else if( (tX<cX && oY>cY) || (oX<cX && tY>cY)  ){
            pic = client.getTileImageForType("ARROW_E_SW");
          }
          else if( (tX<cX && oY<cY) || (oX<cX && tY<cY) ){
            pic = client.getTileImageForType("ARROW_E_WN");
          }
          else if( (tX>cX && oY<cY) || (oX>cX && tY<cY) ){
            pic = client.getTileImageForType("ARROW_E_NE");
          }
          else if( (tX>cX && oY>cY) || (oX>cX && tY>cY) ){
            pic = client.getTileImageForType("ARROW_E_ES");
          }
          else{
            util.logError(
              "illegal move arrow state",
              "old (",oX,",",oY,")",
              "current (",cX,",",cY,")",
              "next (",tX,",",tY,")",
              "path (",currentMovePath,")"
            );

            continue;
          }
        }

        cX = cX - client.screenX;
        cY = cY - client.screenY;
        if( cX >= 0 && cY >= 0 &&
          cX < client.screenWidth && cY < client.screenHeight ){

          ctx.drawImage( pic,cX*tileX,cY*tileY );
        }
      }
    };

  });