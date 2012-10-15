cwt.defineLayer( CWT_LAYER_CLIENT,
  function( client, userAction, data, util, persistence){

    var createTimer = function( steps, timePerStep ){
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

    var unitAnimation     = createTimer( 3, 250 );
    var propertyAnimation = createTimer( 4, 300 );
    var selectorAnimation = createTimer( 7, 100 );

    client.ANIMATION_KEYS = [ "move" ];

    client.isAnimationActive = function(){
      return false;
    };

    client.isAnimationKey = function( key ){
      return client.ANIMATION_KEYS.indexOf(key) !== -1;
    };

    client.drawAnimation = function( delta ){

    };

    var checkUnits = function( x,y ){
      var unit = data.unitByPos(x,y);
      if( unit !== null ){
        client.markForRedrawWithNeighbours(x,y);
      }
    };

    var checkProperties = function( x,y ){
      var prop = data.propertyByPos(x,y);
      if( prop !== null ){
        if( y>0 ) client.markForRedraw(x,y-1);
        client.markForRedraw(x,y);
      }
    };

    var checkFocus = function( x,y ){
      if( userAction.getValueOfSelectionTile(x,y) > -1 ){
        client.markForRedraw(x,y);
      }
    };

    /**
     * Updates the animation timer step.
     *
     * @param delta delta time in milliseconds
     */
    client.updateAnimationTimer = function( delta ){

      if( unitAnimation.update( delta ) ){
        client.eachPosOfScreen( checkUnits );
      } if( propertyAnimation.update( delta ) ){
        client.eachPosOfScreen( checkProperties );
      } if( selectorAnimation.update( delta ) ){
        client.eachPosOfScreen( checkFocus );
      }
    };

    /**
     * Returns the step of the unit timer.
     */
    client.unitAnimationStep = function(){
      return unitAnimation.currentStep();
    };

    /**
     * Returns the step of the property timer.
     */
    client.propertyAnimationStep = function(){
      return propertyAnimation.currentStep();
    };

    /**
     * Returns the step of the selector timer.
     */
    client.selectorAnimationStep = function(){
      return selectorAnimation.currentStep();
    };



    var moveAnimationX     = 0;
    var moveAnimationY     = 0;
    var moveAnimationPath  = null;
    var moveAnimationIndex = -1;
    var moveAnimationUid   = -1;
    var moveAnimationShift = 0;

    client.prepareMoveAnimation = function( uid, x,y, path ){
      var unit = data.unitById( uid );

      moveAnimationX = x;
      moveAnimationY = y;
      moveAnimationIndex = 0;
      moveAnimationPath = path;
      moveAnimationUid = uid;
      moveAnimationShift = 0;

      if( util.DEBUG ){
        util.logInfo("drawing move from (",moveAnimationX,",",moveAnimationY,
          ") with path (",moveAnimationPath,")");
      }

      client.preventRenderUnit = unit;
    };

    client.isMoveAnimationActive = function(){
      return moveAnimationUid !== -1;
    };

    client.drawMoveAnimation = function(){
      var unit = data.unitById( moveAnimationUid );

      var color;
      if( unit.owner === data.getTurnOwner() ){
        color = client.COLOR_GREEN;
      }
      else if( data.player(unit.owner).team ===
        data.player( data.getTurnOwner() ).team ){

        color = client.COLOR_BLUE;
      }
      else color = client.COLOR_RED;

      var state;
      var tp = unit.type;

      // GET CORRECT IMAGE STATE
      switch( moveAnimationPath[ moveAnimationIndex ] ){
        case data.MOVE_CODE_UP :    state = client.IMAGE_CODE_UP;    break;
        case data.MOVE_CODE_RIGHT : state = client.IMAGE_CODE_RIGHT; break;
        case data.MOVE_CODE_DOWN :  state = client.IMAGE_CODE_DOWN;  break;
        case data.MOVE_CODE_LEFT :  state = client.IMAGE_CODE_LEFT;  break;
      }

      var pic = client.getUnitImageForType( unit.type, state, color );

      var scx = 64*client.unitAnimationStep();
      var scy = 0;
      var scw = 64;
      var sch = 64;
      var tcx = ( moveAnimationX- client.screenX )*client.tileSizeY -16;
      var tcy = ( moveAnimationY- client.screenY )*client.tileSizeY -16;
      var tcw = client.tileSizeX+client.tileSizeX;
      var tch = client.tileSizeY+client.tileSizeY;

      // ADD SHIFT
      switch(  moveAnimationPath[ moveAnimationIndex ] ){
        case data.MOVE_CODE_UP:    tcy += moveAnimationShift; break;
        case data.MOVE_CODE_LEFT:  tcx -= moveAnimationShift; break;
        case data.MOVE_CODE_RIGHT: tcx += moveAnimationShift; break;
        case data.MOVE_CODE_DOWN:  tcy += moveAnimationShift; break;
      }

      // DRAW IT
      client.getDrawContext().drawImage(
        pic,
        scx,scy,
        scw,sch,
        tcx,tcy,
        tcw,tch
      );
    };

    client.updateMoveAnimation = function( delta ){

      // MOVE 4 TILES / SECOND
      moveAnimationShift += (delta/1000)*client.tileSizeX*8;

      client.markForRedrawWithNeighboursRing( moveAnimationX, moveAnimationY );

      if( moveAnimationShift > client.tileSizeX ){

        // UPDATE ANIMATION POS
        switch( moveAnimationPath[ moveAnimationIndex ] ){
          case data.MOVE_CODE_UP :    moveAnimationY--; break;
          case data.MOVE_CODE_RIGHT : moveAnimationX++; break;
          case data.MOVE_CODE_DOWN :  moveAnimationY++; break;
          case data.MOVE_CODE_LEFT :  moveAnimationX--; break;
        }

        moveAnimationIndex++;

        // moveAnimationShift = 0;
        moveAnimationShift -= client.tileSizeX;

        // MOVE ANIMATION HAS ENDED
        if( moveAnimationIndex === moveAnimationPath.length ){
          moveAnimationX = -1;
          moveAnimationY = -1;
          moveAnimationIndex = 0;
          moveAnimationUid = -1;
          moveAnimationPath = null;

          client.preventRenderUnit = null; // RENDER UNIT NOW NORMALLY
        }
      }
    };

});