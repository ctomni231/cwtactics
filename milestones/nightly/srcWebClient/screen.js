cwt.defineLayer( CWT_LAYER_CLIENT,
  function( client, userAction, data, util, persistence){

    /**
     * SOME TILES THAT ARE KNOWN AS OVERLAYERS --> TODO this should be
     * set able via configs ( custom graphics )
     */
    client.OVERLAYER = {
      MNTN:true,
      FRST:true
    };

    client.preventRenderUnit = null;

    var drawTile = function( x,y,tx,ty ){

      var  tp = data.tileByPos(x,y);
      var pic = client.getTileImageForType( tp );

      var scx = 0;
      var scy = 0;
      var scw = 32;
      var sch = 64;
      var tcx = (x- client.screenX )*tx;
      var tcy = (y- client.screenY )*ty - ty;
      var tcw = tx;
      var tch = ty+ty;

      if( tcy < 0 ){
        scy = scy + ty;
        sch = sch - ty;
        tcy = tcy + ty;
        tch = tch - ty;
      }

      if( pic !== undefined ){
        canvasCtx.drawImage(
          pic,
          scx,scy,
          scw,sch,
          tcx,tcy,
          tcw,tch
        );
      }
      else{
        canvasCtx.fillStyle="rgb(0,0,255)";
        canvasCtx.fillRect( tcx,tcy, tcw,tch );
      }
    };

    var drawProperty = function( x,y,tx,ty ){
      var property = data.propertyByPos(x,y);
      if( property !== null ){

        var color;
        if( property.owner === -1 ){
          color = client.COLOR_NEUTRAL; }
        else if( property.owner === data.getTurnOwner() ){
          color = client.COLOR_GREEN; }
        else if( data.player(property.owner).team ===
                  data.player( data.getTurnOwner() ).team ){

          color = client.COLOR_BLUE; }
        else {
          color = client.COLOR_RED; }

        var pic = client.getPropertyImageForType( property.type, color );

        var scx = 0 + 32*client.propertyAnimationStep();
        var scy = 0;
        var scw = 32;
        var sch = 64;
        var tcx = (x- client.screenX )*tx;
        var tcy = (y- client.screenY )*ty - ty;
        var tcw = tx;
        var tch = ty+ty;

        if( tcy < 0 ){
          scy = scy + ty;
          sch = sch - ty;
          tcy = tcy + ty;
          tch = tch - ty;
        }

        if( pic !== undefined ){
          canvasCtx.drawImage(
            pic,
            scx,scy,
            scw,sch,
            tcx,tcy,
            tcw,tch
          );
        }
        else{

          canvasCtx.fillStyle="rgb(0,255,0)";
          canvasCtx.fillRect( tcx,tcy, tcw,tch );
        }
      }
    };

    var drawFocusTile = function( x,y, tx,ty ){

      var pic = client.getTileImageForType(
        ( userAction.currentState() === userAction.STATE_SELECT_MOVE_PATH )?
          "MOVE_FOC" : "ATK_FOC"
      );

      if( userAction.getValueOfSelectionTile(x,y) > -1 ){

        var scx = 0 + 32*client.selectorAnimationStep();
        var scy = 0;
        var scw = 32;
        var sch = 32;
        var tcx = (x- client.screenX )*tx;
        var tcy = (y- client.screenY )*ty;
        var tcw = 32;
        var tch = 32;

        canvasCtx.globalAlpha = 0.85;
        canvasCtx.drawImage(
          pic,
          scx,scy,
          scw,sch,
          tcx,tcy,
          tcw,tch
        );
        canvasCtx.globalAlpha = 1;
      }
    };

    var drawUnit = function( x,y,tx,ty ){

      // draw unit above tile
      var unit = data.unitByPos(x,y);
      if( unit !== null ){
        if( unit === client.preventRenderUnit ) return;

        var color;
        if( unit.owner === data.getTurnOwner() ){
          color = client.COLOR_GREEN;
        }
        else if( data.player(unit.owner).team ===
                  data.player( data.getTurnOwner() ).team ){

          color = client.COLOR_BLUE;
        }
        else color = client.COLOR_RED;

        var state = ( unit.owner % 2 === 1 )?
          client.IMAGE_CODE_IDLE : client.IMAGE_CODE_IDLE_INVERTED;

        var pic = client.getUnitImageForType( unit.type, state, color );

        var scx = 64*client.unitAnimationStep();
        var scy = 0;
        var scw = 64;
        var sch = 64;
        var tcx = (x- client.screenX )*tx -16;
        var tcy = (y- client.screenY )*ty -16;
        var tcw = tx+tx;
        var tch = ty+ty;

        if( pic !== undefined ){

          canvasCtx.drawImage(
            pic,
            scx,scy,
            scw,sch,
            tcx,tcy,
            tcw,tch
          );

          // RENDER GRAY OVERLAY TO MARK AS USED
          if( unit.owner === data.getTurnOwner() &&
              !data.canAct( data.extractUnitId( unit ) ) ){

            canvasCtx.globalAlpha = 0.15;
            canvasCtx.drawImage(
              client.getUnitImageForType(
                unit.type, state, client.COLOR_BLACK_MASK
              ),
              scx,scy,
              scw,sch,
              tcx,tcy,
              tcw,tch
            );
            canvasCtx.globalAlpha = 1;
          }
        }
        else{

          canvasCtx.fillStyle="rgb(255,0,0)";
          canvasCtx.fillRect( tcx+8,tcy+8, tcw/2,tch/2 );
        }

        if( unit.hp <= 90 ){

          var pic = undefined;
          if( unit.hp > 80 ) pic = client.getTileImageForType("HP_9");
          else if( unit.hp > 70 ) pic = client.getTileImageForType("HP_8");
          else if( unit.hp > 60 ) pic = client.getTileImageForType("HP_7");
          else if( unit.hp > 50 ) pic = client.getTileImageForType("HP_6");
          else if( unit.hp > 40 ) pic = client.getTileImageForType("HP_5");
          else if( unit.hp > 30 ) pic = client.getTileImageForType("HP_4");
          else if( unit.hp > 20 ) pic = client.getTileImageForType("HP_3");
          else if( unit.hp > 10 ) pic = client.getTileImageForType("HP_2");
          else pic = client.getTileImageForType("HP_1");

          canvasCtx.drawImage(
            pic,
            tcx+32,tcy+32,
            16,16
          );
        }
      }
    };

    /** @constant */
    client.ID_CANVAS = "CWTWC_CANVAS";

    var canvasCtx;

    client.cursorX = -1;
    client.cursorY = -1;

    /**
     * Screen position on x axis.
     *
     * @example read_only
     */
    client.screenX = 0;

    /**
     * Screen position on y axis.
     *
     * @example read_only
     */
    client.screenY = 0;

    /**
     * Screen width in tiles.
     *
     * @example read_only
     */
    client.screenWidth = -1;

    /**
     * Screen height in tiles.
     *
     * @example read_only
     */
    client.screenHeight = -1;

    client.tileSizeX = 32;
    client.tileSizeY = 32;

    /**
     * Indicates that the screen needs to be redrawn.
     * (in future the value will be true|false)
     */
    client.drawChanges = 0;
//TODO can be private scoped
    client.drawnMap = util.matrix( CWT_MAX_MAP_WIDTH, CWT_MAX_MAP_HEIGHT, 0 );

    /**
     * Invokes a complete redraw of the screen.
     */
    client.completeRedraw = function(){
      client.drawChanges = 1;
      for(var x=0; x< client.screenWidth; x++){
        for(var y=0; y< client.screenHeight; y++){

          client.drawnMap[x][y] = true;
        }
      }
    };

    var checkTileRedraw = function( x,y ){
      if( y < data.mapHeight() ){
        if( data.propertyByPos(x,y) !== null ) client.markForRedraw(x,y);
        else{
          var tp = data.tileByPos(x,y);
          if( client.OVERLAYER[tp] === true ) client.markForRedraw(x,y);
        }
      }
    };

    /**
     * Marks a position for re-rendering.
     *
     * @param x
     * @param y
     */
    client.markForRedraw = function( x,y ){
      var rX = x;
      var rY = y;
      if( x >= 0 && y >= 0 && x < data.mapWidth() && y < data.mapHeight() ){
        x = x - client.screenX;
        y = y - client.screenY;
        if( x >= 0 && y >= 0 &&
          x < client.screenWidth && y < client.screenHeight ){

          if( client.drawnMap[x][y] === 1 ) return;

          client.drawnMap[x][y] = 1;
          client.drawChanges++;

          // check bottom tile
          checkTileRedraw(rX,rY+1);
        }
      }
      else{
        util.logError("illegal arguments ",x,",",y," -> out of screen bounds");
      }
    };

    client.markForRedrawWithNeighbours = function( x,y ){

      if( y>0 ) client.markForRedraw(x,y-1);
      if( x>0 ) client.markForRedraw(x-1,y);
      client.markForRedraw(x,y);
      if( y<data.mapHeight()-1 ) client.markForRedraw(x,y+1);
      if( x<data.mapWidth()-1 ) client.markForRedraw(x+1,y);
    }

    client.markForRedrawWithNeighboursRing = function( x,y ){

      if( x>0 ){
        if( y>0 ) client.markForRedraw(x-1,y-1);
        client.markForRedraw(x-1,y);
        if( y<data.mapHeight()-1 ) client.markForRedraw(x-1,y+1);
      }

      if( y>0 ) client.markForRedraw(x,y-1);
      client.markForRedraw(x,y);
      if( y<data.mapHeight()-1 ) client.markForRedraw(x,y+1);

      if( x<data.mapWidth()-1 ){
        if( y>0 ) client.markForRedraw(x+1,y-1);
        client.markForRedraw(x+1,y);
        if( y<data.mapHeight()-1 ) client.markForRedraw(x+1,y+1);
      }
    }

    /**
     * Draws the screen.
     */
    client.drawScreen = function(){

      var xe,ye;
      var tx = client.tileSizeX;
      var ty = client.tileSizeY;
      var focusExists = (
        userAction.currentState() === userAction.STATE_SELECT_MOVE_PATH ||
          userAction.currentState() === userAction.STATE_SELECT_ACTION_TARGET
      );

      // iterate by row
      ye = client.screenY + client.screenHeight -1;
      if( ye >= data.mapHeight() ) ye = data.mapHeight()-1;
      for(var y=client.screenY; y<=ye; y++){

        // iterate by column
        xe = client.screenX + client.screenWidth -1;
        if( xe >= data.mapWidth() ) xe = data.mapWidth()-1;
        for(var x=client.screenX; x<=xe; x++){

          // RENDER IF NEEDED
          if( client.drawnMap[ x-client.screenX ][ y-client.screenY ] > 0 ){

            drawTile(     x, y, tx, ty );
            drawProperty( x, y, tx, ty );
            if( focusExists ) drawFocusTile(  x, y, tx, ty );
            drawUnit(     x, y, tx, ty );

            client.drawnMap[ x-client.screenX ][ y-client.screenY ] = 0;
          }
        }
      }

      client.drawMoveArrow( canvasCtx );

      // clear counter
      client.drawChanges = 0;
    };

    client.initCanvas = function(){
      var canvEl = document.getElementById( client.ID_CANVAS );
      canvEl.height = window.innerHeight -16;
      canvEl.width = window.innerWidth -32;
      canvasCtx = canvEl.getContext("2d");

      client.screenWidth = parseInt( canvEl.width / client.tileSizeX , 10 );
      client.screenHeight = parseInt( canvEl.height / client.tileSizeY , 10 );
      canvasCtx.font="Bold 16px Arial";
    };

    client.getDrawContext = function(){ return canvasCtx; };
});
