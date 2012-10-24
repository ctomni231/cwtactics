/**
 * Creates a timerable object with holdable step state.
 *
 * @private
 */
animation._createTimer = function( steps, timePerStep ){
  var cTime = 0;
  var cStep = 0;

  return {
    update: function( delta ){
      cTime += delta;
      if( cTime >= timePerStep ){
        // INCREASE STEP AND RESET TIMER
        cTime = 0;
        cStep++;
        if( cStep >= steps ) cStep = 0;
        return true;
      }
      return false;
    },

    currentStep : function(){
      return cStep;
    }
  }
}

animation._unitAnimStep = 0;
animation._unitAnimMaxStep = 3;
animation._unitAnimTime = 0;
animation._unitAnimMaxTime = 250;

/**
 * Unit animation timer.
 */
animation.unitAnimation     = animation._createTimer( 3, 250 );

animation._propAnimStep = 0;
animation._propAnimMaxStep = 4;
animation._propAnimTime = 0;
animation._propAnimMaxTime = 300;

/**
 * Property animation timer.
 */
animation.propertyAnimation = animation._createTimer( 4, 300 );

animation._selectorAnimStep = 0;
animation._selectorAnimMaxStep = 7;
animation._selectorAnimTime = 0;
animation._selectorAnimMaxTime = 100;

/**
 * Selector animation timer.
 */
animation.selectorAnimation = animation._createTimer( 7, 100 );

animation._statAnimStep = 0;
animation._statAnimMaxStep = 8;
animation._statAnimTime = 0;
animation._statAnimMaxTime = 375;

/**
 * Status animation timer.
 */
animation.statAnimation     = animation._createTimer( 8, 375 );

/**
 * X coordinate of the current position of a moving unit.
 */
animation.moveAnimationX     = 0;

/**
 * Y coordinate of the current position of a moving unit.
 */
animation.moveAnimationY     = 0;

/**
 * Move path of the current moving unit.
 */
animation.moveAnimationPath  = null;

/**
 * Index of the current position in the move path of the moving unit.
 */
animation.moveAnimationIndex = -1;

/**
 * Id of the moving unit.
 */
animation.moveAnimationUid   = -1;

/**
 * Shift of the current move.
 */
animation.moveAnimationShift = 0;

/**
 * Updates the animation timer step.
 *
 * @param delta delta time in milliseconds
 */
animation.updateAnimationTimer = function( delta ){
  /*
  var uni = animation.unitAnimation.update( delta );
  var pro = animation.propertyAnimation.update( delta );
  var sel = animation.selectorAnimation.update( delta );
  animation.statAnimation.update( delta );*/


  var uni = false, pro = false, sel = false;

  // UNIT
  animation._unitAnimTime += delta;
  if( animation._unitAnimTime >= animation._unitAnimMaxTime ){
    // INCREASE STEP AND RESET TIMER
    animation._unitAnimTime = 0;
    animation._unitAnimStep++;
    if( animation._unitAnimStep >= animation._unitAnimMaxStep ){
      animation._unitAnimStep = 0;
    }
    uni = true;
  }
  else uni = false;
  
  // PROP
  animation._propAnimTime += delta;
  if( animation._propAnimTime >= animation._propAnimMaxTime ){
    // INCREASE STEP AND RESET TIMER
    animation._propAnimTime = 0;
    animation._propAnimStep++;
    if( animation._propAnimStep >= animation._propAnimMaxStep ){
      animation._propAnimStep = 0;
    }
    pro = true;
  }
  else pro = false;
  
  // SELECTOR
  animation._selectorAnimTime += delta;
  if( animation._selectorAnimTime >= animation._selectorAnimMaxTime ){
    // INCREASE STEP AND RESET TIMER
    animation._selectorAnimTime = 0;
    animation._selectorAnimStep++;
    if( animation._selectorAnimStep >= animation._selectorAnimMaxStep ){
      animation._selectorAnimStep = 0;
    }
    sel = true;
  }
  else sel = false;
  
  // STAT
  animation._statAnimTime += delta;
  if( animation._statAnimTime >= animation._statAnimMaxTime ){
    // INCREASE STEP AND RESET TIMER
    animation._statAnimTime = 0;
    animation._statAnimStep++;
    if( animation._statAnimStep >= animation._statAnimMaxStep ){
      animation._statAnimStep = 0;
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

      if( uni ){
        var unit = game.unitByPos(x,y);
        if( unit !== null ){
          screen.markForRedrawWithNeighbours(x,y);
        }
      }

      if( pro ){
        var prop = game.propertyByPos(x,y);
        if( prop !== null ){
          if( y>0 ) screen.markForRedraw(x,y-1);
                    screen.markForRedraw(x,y);
        }
      }

      if( sel ){
        if( controller.valueOfSelectionPos(x,y) > -1 ){
          screen.markForRedraw(x,y);
        }
      }
    }
  }


};

/**
 * Returns the step of the unit timer.
 */
animation.unitAnimationStep = function(){
  // return animation.unitAnimation.currentStep();
  return animation._unitAnimStep;
};

/**
 * Returns the step of the property timer.
 */
animation.propertyAnimationStep = function(){
  // return animation.propertyAnimation.currentStep();
  return animation._propAnimStep;
};

/**
 * Returns the step of the selector timer.
 */
animation.selectorAnimationStep = function(){
  // return animation.selectorAnimation.currentStep();
  return animation._selectorAnimStep;
};

/**
 *
 */
animation.statAnimationStep = function(){
  // return animation.statAnimation.currentStep();
  return animation._statAnimStep;
};

/**
 * Prepares a move animation for drawing.
 */
animation.prepareMoveAnimation = function( uid, x,y, path ){
  var unit = game.unitById( uid );

  animation.moveAnimationX = x;
  animation.moveAnimationY = y;
  animation.moveAnimationIndex = 0;
  animation.moveAnimationPath = path;
  animation.moveAnimationUid = uid;
  animation.moveAnimationShift = 0;

  if( util.DEBUG ){
    util.logInfo(
      "drawing move from",
      "(",animation.moveAnimationX,",",animation.moveAnimationY,")",
      "with path",
      "(",animation.moveAnimationPath,")");
  }

  screen.preventRenderUnit = unit;
};

/**
 *
 */
animation.isMoveAnimationActive = function(){
  return animation.moveAnimationUid !== -1;
};

/**
 *
 */
animation.updateMoveAnimation = function( delta ){

  // MOVE 4 TILES / SECOND
  animation.moveAnimationShift += (delta/1000)*screen.tileSizeX*14;

  screen.markForRedrawWithNeighboursRing(
    animation.moveAnimationX, animation.moveAnimationY
  );

  if( animation.moveAnimationShift > screen.tileSizeX ){

    // UPDATE ANIMATION POS
    switch( animation.moveAnimationPath[ animation.moveAnimationIndex ] ){
      case game.MOVE_CODE_UP :    animation.moveAnimationY--; break;
      case game.MOVE_CODE_RIGHT : animation.moveAnimationX++; break;
      case game.MOVE_CODE_DOWN :  animation.moveAnimationY++; break;
      case game.MOVE_CODE_LEFT :  animation.moveAnimationX--; break;
    }

    animation.moveAnimationIndex++;

    // moveAnimationShift = 0;
    animation.moveAnimationShift -= screen.tileSizeX;

    // MOVE ANIMATION HAS ENDED
    if( animation.moveAnimationIndex === animation.moveAnimationPath.length ){
      animation.moveAnimationX = -1;
      animation.moveAnimationY = -1;
      animation.moveAnimationIndex = 0;
      animation.moveAnimationUid = -1;
      animation.moveAnimationPath = null;

      screen.preventRenderUnit = null; // RENDER UNIT NOW NORMALLY
    }
  }
};