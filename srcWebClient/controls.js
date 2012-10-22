/**
 * Screen movement on x axis.
 * If this variable is lower zero, the screen will move left a bit
 * in every update step until it reaches zero. If the value is
 * greater zero it will move right.
 */
userInput.moveScreenX = 0;

/**
 * Screen movement on y axis.
 * If this variable is lower zero, the screen will move up a bit
 * in every update step until it reaches zero. If the value is
 * greater zero it will move down.
 */
userInput.moveScreenY = 0;

/**
 * Holds the current selected move path.
 */
userInput.currentMovePath = util.list( CWT_MAX_MOVE_RANGE, null );

/**
 * Holds the current left move points.
 */
userInput.currentMoveLeftPoints = -1;

/**
 * Current move path index of the last tile.
 */
userInput.currentMoveIndex = 0;

/**
 * X coordinate of the current move path source position.
 */
userInput.currentMovePathSourceX = -1;

/**
 * Y coordinate of the current move path source position.
 */
userInput.currentMovePathSourceY = -1;

/**
 * X coordinate of the last tile in the current current move path.
 */
userInput.currentMovePathX = -1;

/**
 * X coordinate of the last tile in the current move path.
 */
userInput.currentMovePathY = -1;

/** @private */
userInput._shiftOldX = 0;

/** @private */
userInput._shiftOldY = 0;

/**
 * Resets the current active move path for a given unit.
 *
 * @param uid
 */
userInput.resetCurrentMovePath = function( uid ){
  util.fill( userInput.currentMovePath, null );

  var unit = game.unitById( uid );
  userInput.currentMovePathSourceX = unit.x;
  userInput.currentMovePathSourceY = unit.y;
  userInput.currentMovePathX = unit.x;
  userInput.currentMovePathY = unit.y;
  userInput.currentMoveIndex = 0;

  userInput.currentMoveLeftPoints = Math.min( unit.fuel,
    game.unitSheet( unit.type ).moveRange );
};

/**
 * Returns a valid path array from the current active move path selection.
 */
userInput.getMovePathFromSelection = function(){
  var path = [];

  for( var i=0; i<CWT_MAX_MOVE_RANGE; i++ ){
    if( userInput.currentMovePath[i] === null ) break;
    path[i] = userInput.currentMovePath[i];
  }

  return path;
};

/**
 * Invokes an action on a given position.
 *
 * @param x
 * @param y
 */
userInput.invokeActionAt = function( x,y ){
  sound.play("MENU_OK");

  // CHECK REDRAWS OF THE FOCUS TILES --> BEFORE
  for(var ix=screen.screenX,xe=screen.screenWidth; ix<xe; ix++){
    for(var iy=screen.screenY,ye=screen.screenHeight; iy<ye; iy++){
      if( controller.valueOfSelectionPos(ix,iy) > 0 ){
        screen.drawnMap[ix][iy] = true;
        screen.drawChanges++;
      }
    }
  }

  if( controller.currentState === controller.STATE_SELECT_ACTION ) return;
  if( controller.currentState === controller.STATE_SELECT_MOVE_PATH ){
    if( userInput.currentMoveIndex > 0 ){
      controller.tickPath( userInput.getMovePathFromSelection() );
    }
  }

  if( util.DEBUG ) util.logInfo("got action request for (",x,",",y,")");
  controller.tickTile(x,y);

  if( controller.currentState === controller.STATE_SELECT_ACTION ){
    menu.showMenu( x,y, controller.actionList );
  }
  else if( controller.currentState === controller.STATE_SELECT_MOVE_PATH ){
    userInput.resetCurrentMovePath( controller.selectedObject );
  }
};

/**
 * Invokes a cancel process.
 */
userInput.invokeCancel = function(){
  if( util.DEBUG ) util.logInfo("got cancel request");
  controller.reset();
};

/**
 * Invokes a entry selection in the menu.
 *
 * @param index
 */
userInput.invokeActionFromMenu = function( index ){
  if( util.DEBUG ){
    util.logInfo("got action call for ",controller.actionList[index] );
  }

  // SELECT MENU
  if( controller.currentState === controller.STATE_SELECT_ACTION ){
    controller.selectEntry( controller.actionList[index] );
  } else if( controller.currentState === controller.STATE_SELECT_SUBMENU_ACTION ){
    controller.selectEntry( controller.subActionList[index] );
  }

  // PREPARE SUB MENU -> IF ITS A SUB MENU CALL
  if( controller.currentState === controller.STATE_SELECT_SUBMENU_ACTION ){
    menu.showMenu( -1, -1, controller.subActionList );
  }
};

/**
 * Shifts the screen in relationship to the screen movement variables.
 */
userInput.solveMapShift = function(){
  var dir = -1;

  if( userInput.moveScreenX !== 0 ){

    if( userInput.moveScreenX < 0 ){ dir = 3; userInput.moveScreenX++; }
    else                           { dir = 1; userInput.moveScreenX--; }
  }
  else if( userInput.moveScreenY !== 0 ){

    if( userInput.moveScreenY < 0 ){ dir = 0; userInput.moveScreenY++; }
    else                           { dir = 2; userInput.moveScreenY--; }
  }

  if( dir !== -1 ) userInput.mapShift( dir, 1 );
};

/**
 * New map shift method. This one uses the update step based screen
 * movement algorithm.
 */
userInput.betterMapShift = function( dir, len ){

       if( dir === 0 ) userInput.moveScreenY -= len;
  else if( dir === 1 ) userInput.moveScreenX += len;
  else if( dir === 2 ) userInput.moveScreenY += len;
  else if( dir === 3 ) userInput.moveScreenX -= len;
};

/** @private */
userInput._checkShift = function( x,y ){

  var render = false;
  var tpN = game.tileByPos(x,y);
  var tpO = game.tileByPos(x+userInput._shiftOldX,y+userInput._shiftOldY);
  if(
    tpO !== tpN ||
      screen.OVERLAYER[tpO] === true ||
      screen.OVERLAYER[tpN] === true
    ){
    render = true;
    if( screen.OVERLAYER[tpO] === true && y > 0 ){
      screen.markForRedraw( x,y-1 );
    }
  }
  else{

    var unitN = game.unitByPos(x,y);
    var unitO = game.unitByPos(x+ userInput._shiftOldX,y+ userInput._shiftOldY);
    if( unitN !== null ||unitO !== null ){
      screen.markForRedrawWithNeighbours( x,y );
    }
    else{

      var propN = game.propertyByPos(x,y);
      var propO = game.propertyByPos(x+ userInput._shiftOldX,y+ userInput._shiftOldY);
      if( propN !== null ||propO !== null ){
        render = true;
        if( propO !== null && y > 0 ){
          screen.markForRedraw( x,y-1 );
        }
      }
    }
  }

  if( render ) screen.markForRedraw( x,y );
};

/**
 * Shifts the screen by a distance in a given direction. This
 * function calculates the redraw map.
 */
userInput.mapShift = function( dir, dis ){
  if( dis === undefined ) dis = 1;

  // CHECK REDRAWS OF THE FOCUS TILES --> BEFORE
  for(var x=screen.screenX,xe=screen.screenWidth; x<xe; x++){
    for(var y=screen.screenY,ye=screen.screenHeight; y<ye; y++){
      if( controller.valueOfSelectionPos(x,y) > 0 ){
        screen.drawnMap[x-screen.screenX][y-screen.screenY] = true;
        screen.drawChanges++;
      }
    }
  }

  // UPDATE SCREEN META DATA
  switch (dir) {

    case 0:
      userInput._shiftOldX = 0;
      userInput._shiftOldY = +dis;
      screen.screenY = Math.max( 0, screen.screenY - dis );
      break;

    case 1:
      userInput._shiftOldX = -dis;
      userInput._shiftOldY = 0;
      screen.screenX = Math.min(
        game.mapWidth()-screen.screenX-1, screen.screenX + dis
      );
      client.screenX = Math.max( 0, client.screenX );
      break;

    case 2:
      userInput._shiftOldX = 0;
      userInput._shiftOldY = -dis;
      screen.screenY = Math.min(
        game.mapHeight()-screen.screenY-1, screen.screenY + dis
      );
      client.screenY = Math.max( 0, client.screenY );
      break;

    case 3:
      userInput._shiftOldX = +dis;
      userInput._shiftOldY = 0;
      screen.screenX = Math.max( 0, screen.screenX - dis );
      break;
  }

  // CHECK REDRAWS OF THE FOCUS TILES --> AFTER
  for(var x=screen.screenX,xe=screen.screenWidth; x<xe; x++){
    for(var y=screen.screenY,ye=screen.screenHeight; y<ye; y++){
      if( controller.valueOfSelectionPos(x,y) > 0 ){
        screen.drawnMap[x-screen.screenX][y-screen.screenY] = true;
        screen.drawChanges++;
      }

      userInput._checkShift( x,y );
    }
  }

  var x  = screen.screenX;
  var yS = screen.screenY;
  var xe = x+ screen.screenWidth;
  var ye = yS+screen.screenHeight;

  // CHECK BOUNDS
  if( xe > game.mapWidth() )  xe = game.mapWidth();
  if( ye > game.mapHeight() ) ye = game.mapHeight();

  // ITERATE THROUGH THE SCREEN
  for( ; x<xe; x++ ){
    for( var y=yS ; y<ye; y++ ){

      screen.ammoStatusMap[x-screen.screenX][y-screen.screenY] = false;
      screen.fuelStatusMap[x-screen.screenX][y-screen.screenY] = false;

      var unit = game.unitByPos(x,y);
      if( unit !== null ){

        var us = game.unitSheet( unit.type );
        if( us.maxAmmo > 0 &&
          ( unit.ammo <= us.maxAmmo*0.35 || unit.ammo <= 1 ) ){

          screen.ammoStatusMap[x-screen.screenX][y-screen.screenY] = true;
        }
        if( unit.fuel <= us.maxFuel*0.25 || unit.fuel <= 5 ){
          screen.fuelStatusMap[x-screen.screenX][y-screen.screenY] = true;
        }
      }
    }
  }
};

/**
 * @private
 */
userInput._setGeneratedPath = function(x,y){
  var path = controller.returnPath(x,y);
  userInput.resetCurrentMovePath( controller.selectedObject );
  var cX = userInput.currentMovePathSourceX;
  var cY = userInput.currentMovePathSourceY;
  for( var i=0,e=path.length; i<e; i++ ){
    userInput.currentMovePath[i] = path[i];
    userInput.currentMoveIndex++;

    switch( path[i] ){
      case game.MOVE_CODE_UP :    cY--; break;
      case game.MOVE_CODE_RIGHT : cX++; break;
      case game.MOVE_CODE_DOWN :  cY++; break;
      case game.MOVE_CODE_LEFT :  cX--; break;
    }

    userInput.currentMoveLeftPoints -=
      controller.valueOfSelectionPos(cX,cY);
  }

  userInput.currentMovePathX = cX;
  userInput.currentMovePathY = cY;

  if( util.DEBUG ){
    util.logInfo("set calculated path (",path,")");
  }
};

/**
 *
 * @param x
 * @param y
 */
userInput.appendToCurrentMovePath = function( x,y ){
  if( controller.valueOfSelectionPos(x,y) === -1 ||
    ( x === userInput.currentMovePathX &&
      y === userInput.currentMovePathY )
     ||
    ( x === userInput.currentMovePathSourceX &&
      y === userInput.currentMovePathSourceY )
    ) return;

  var diffX = Math.abs( userInput.currentMovePathX - x );
  var diffY = Math.abs( userInput.currentMovePathY - y );

  if( util.DEBUG ) util.logInfo("diffX:",diffX," diffY:",diffY );

  if( diffX === 0 && diffY === 0 ){
    // NOTHING HAPPENS
    return;
  }
  else{
    var diff = diffX+diffY;
    if( diff === 1 ){

      var code;

      if( diffX === 1 && diffY === 0 ){
        code = ( x < userInput.currentMovePathX )? game.MOVE_CODE_LEFT:
                                                    game.MOVE_CODE_RIGHT;
      }
      else{
        code = ( y < userInput.currentMovePathY )? game.MOVE_CODE_UP:
                                                    game.MOVE_CODE_DOWN;
      }

      var costs = controller.valueOfSelectionPos(x,y);
      var cCode = userInput.currentMovePath[ userInput.currentMoveIndex-1 ];
      if( userInput.currentMoveLeftPoints - costs >= 0 &&
        ( userInput.currentMoveIndex === 0 || !(
          ( cCode === game.MOVE_CODE_UP && code === game.MOVE_CODE_DOWN )
            ||
          ( cCode === game.MOVE_CODE_LEFT && code === game.MOVE_CODE_RIGHT )
            ||
          ( cCode === game.MOVE_CODE_DOWN && code === game.MOVE_CODE_UP )
            ||
          ( cCode === game.MOVE_CODE_RIGHT && code === game.MOVE_CODE_LEFT )
          )
        )
      ){
        userInput.currentMovePath[ userInput.currentMoveIndex ] = code;
        userInput.currentMoveIndex++;
        userInput.currentMoveLeftPoints = userInput.currentMoveLeftPoints - costs;
        userInput.currentMovePathX = x;
        userInput.currentMovePathY = y;

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

         userInput._setGeneratedPath(x,y);
      }
    }
    else userInput._setGeneratedPath(x,y);

    if( util.DEBUG ){
      util.logInfo(
        "current move data",
        "source (",userInput.currentMovePathSourceX,",",
                   userInput.currentMovePathSourceY,")",
        "target (",userInput.currentMovePathX,",",
                   userInput.currentMovePathY,")",
        "path (",  userInput.currentMovePath,")",
        "rest points",userInput.currentMoveLeftPoints
      );
    }
  }
};