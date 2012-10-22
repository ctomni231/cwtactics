/**
 * SOME TILES THAT ARE KNOWN AS OVERLAYERS --> TODO this should be
 * set able via configs ( custom graphics )
 */
screen.OVERLAYER = {
  MNTN:true,
  FRST:true
};


/**
 * Status map for tiles that contains a ammo fuel status ( only on tiles
 * that are occupied by units ).
 */
screen.ammoStatusMap = null;

/**
 * Status map for tiles that contains a low fuel status ( only on tiles
 * that are occupied by units ).
 */
screen.fuelStatusMap = null;

/**
 *
 */
screen.preventRenderUnit = null;


/** @private */
screen._canvasCtx = null;

/**
 * Screen position on x axis.
 *
 * @example read_only
 */
screen.screenX = 0;

/**
 * Screen position on y axis.
 *
 * @example read_only
 */
screen.screenY = 0;

/**
 * Screen width in tiles.
 *
 * @example read_only
 */
screen.screenWidth = -1;

/**
 * Screen height in tiles.
 *
 * @example read_only
 */
screen.screenHeight = -1;

/**
 *
 */
screen.tileSizeX = 32;

/**
 *
 */
screen.tileSizeY = 32;

/**
 * Indicates that the screen needs to be redrawn.
 * (in future the value will be true|false)
 */
screen.drawChanges = 0;

/**
 *
 */
screen.drawnMap = util.matrix( CWT_MAX_MAP_WIDTH, CWT_MAX_MAP_HEIGHT, 0 );

/**
 *
 * @param x
 * @param y
 * @param tx
 * @param ty
 * @private
 */
screen._drawTile = function( x,y,tx,ty ){
  var canvasCtx = screen._canvasCtx;
  var  tp = game.tileByPos(x,y);
  var pic = images.getTileImageForType( tp );

  var scx = 0;
  var scy = 0;
  var scw = 32;
  var sch = 64;
  var tcx = (x- screen.screenX )*tx;
  var tcy = (y- screen.screenY )*ty - ty;
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

/**
 *
 * @param x
 * @param y
 * @param tx
 * @param ty
 * @private
 */
screen._drawProperty = function( x,y,tx,ty ){
  var canvasCtx = screen._canvasCtx;
  var property = game.propertyByPos(x,y);
  if( property !== null ){

    var color;
    if( property.owner === -1 ){
      color = images.COLOR_NEUTRAL;
    }
    else if( property.owner === game.getTurnOwner() ){
      color = images.COLOR_GREEN;
    }
    else if( game.player(property.owner).team ===
      game.player( game.getTurnOwner() ).team ){

      color = images.COLOR_BLUE;
    }
    else {
      color = images.COLOR_RED;
    }

    var pic = images.getPropertyImageForType( property.type, color );

    var scx = 0 + 32* animation.propertyAnimationStep();
    var scy = 0;
    var scw = 32;
    var sch = 64;
    var tcx = (x- screen.screenX )*tx;
    var tcy = (y- screen.screenY )*ty - ty;
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
      canvasCtx.fillRect( tcx,tcy + screen.tileSizeY,
                          tcw,tch - screen.tileSizeY );
    }
  }
};

/**
 *
 * @param x
 * @param y
 * @param tx
 * @param ty
 */
screen._drawFocusTile = function( x,y, tx,ty ){
  var canvasCtx = screen._canvasCtx;

  var pic = images.getTileImageForType(
    ( controller.currentState === controller.STATE_SELECT_MOVE_PATH )?
      "MOVE_FOC" : "ATK_FOC"
  );

  if( controller.valueOfSelectionPos(x,y) > -1 ){

    var scx = 0 + 32* animation.selectorAnimationStep();
    var scy = 0;
    var scw = 32;
    var sch = 32;
    var tcx = (x- screen.screenX )*tx;
    var tcy = (y- screen.screenY )*ty;
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

/**
 *
 * @param x
 * @param y
 * @param tx
 * @param ty
 * @param step
 */
screen._drawUnit = function( x,y,tx,ty,step ){
  var canvasCtx = screen._canvasCtx;

  // draw unit above tile
  var unit = game.unitByPos(x,y);
  if( unit !== null ){
    if( unit === screen.preventRenderUnit ) return;

    var color;
    if( unit.owner === game.getTurnOwner() ){
      color = images.COLOR_GREEN;
    }
    else if( game.player(unit.owner).team ===
      game.player( game.getTurnOwner() ).team ){

      color = images.COLOR_BLUE;
    }
    else color = images.COLOR_RED;

    var state = ( unit.owner % 2 === 1 )?
      images.IMAGE_CODE_IDLE : images.IMAGE_CODE_IDLE_INVERTED;

    var pic = images.getUnitImageForType( unit.type, state, color );

    var scx = 64* animation.unitAnimationStep();
    var scy = 0;
    var scw = 64;
    var sch = 64;
    var tcx = (x- screen.screenX )*tx -16;
    var tcy = (y- screen.screenY )*ty -16;
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
      if( unit.owner === game.getTurnOwner() &&
        !game.canAct( game.extractUnitId( unit ) ) ){

        canvasCtx.globalAlpha = 0.15;
        canvasCtx.drawImage(
          images.getUnitImageForType(
            unit.type, state, images.COLOR_BLACK_MASK
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
           if( unit.hp > 80 ) pic = images.getTileImageForType("HP_9");
      else if( unit.hp > 70 ) pic = images.getTileImageForType("HP_8");
      else if( unit.hp > 60 ) pic = images.getTileImageForType("HP_7");
      else if( unit.hp > 50 ) pic = images.getTileImageForType("HP_6");
      else if( unit.hp > 40 ) pic = images.getTileImageForType("HP_5");
      else if( unit.hp > 30 ) pic = images.getTileImageForType("HP_4");
      else if( unit.hp > 20 ) pic = images.getTileImageForType("HP_3");
      else if( unit.hp > 10 ) pic = images.getTileImageForType("HP_2");
      else pic = images.getTileImageForType("HP_1");

      canvasCtx.drawImage(
        pic,
        tcx+32,tcy+32,
        16,16
      );
    }

    if( step <= 2 &&
      screen.ammoStatusMap[x- screen.screenX][y- screen.screenY] === true ){

      pic = images.getTileImageForType("UNIT_STAT_AMMO");
      canvasCtx.drawImage(
        pic,
        tcx+16,tcy+32,
        16,16
      );
    }

    if( step >= 4 && step <= 6 &&
      screen.fuelStatusMap[x- screen.screenX][y- screen.screenY] === true){

      pic = images.getTileImageForType("UNIT_STAT_FUEL");
      canvasCtx.drawImage(
        pic,
        tcx+16,tcy+32,
        16,16
      );
    }
  }
};

/**
 * Draws a arrow for the active move path on the screen.
 *
 * @param ctx
 * @private
 */
screen._drawMoveArrow = function(){
  var ctx = screen._canvasCtx;
  var tileX = screen.tileSizeX;
  var tileY = screen.tileSizeY;
  var currentMovePath = userInput.currentMovePath;
  var cX = userInput.currentMovePathSourceX;
  var cY = userInput.currentMovePathSourceY;
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
      case game.MOVE_CODE_UP :    cY--; break;
      case game.MOVE_CODE_RIGHT : cX++; break;
      case game.MOVE_CODE_DOWN :  cY++; break;
      case game.MOVE_CODE_LEFT :  cX--; break;
    }

    // NEXT TILE
    if( i === e-1 || currentMovePath[i+1] === null ){
      tX = -1; tY = -1;
    }
    else{
      switch( currentMovePath[i+1] ){
        case game.MOVE_CODE_UP :    tX = cX;   tY = cY-1; break;
        case game.MOVE_CODE_RIGHT : tX = cX+1; tY = cY;   break;
        case game.MOVE_CODE_DOWN :  tX = cX;   tY = cY+1; break;
        case game.MOVE_CODE_LEFT :  tX = cX-1; tY = cY;   break;
      }
    }

    if( tX == -1 ){

      // TARGET TILE
      switch( currentMovePath[i] ){
        case game.MOVE_CODE_UP :
          pic = images.getTileImageForType("ARROW_T_N"); break;
        case game.MOVE_CODE_RIGHT :
          pic = images.getTileImageForType("ARROW_T_E"); break;
        case game.MOVE_CODE_DOWN :
          pic = images.getTileImageForType("ARROW_T_S"); break;
        case game.MOVE_CODE_LEFT :
          pic = images.getTileImageForType("ARROW_T_W"); break;
      }
    }
    else{

      var diffX = Math.abs( tX-oX );
      var diffY = Math.abs( tY-oY );

      // IN THE MIDDLE OF THE WAY
      if( diffX === 2 ){
        pic = images.getTileImageForType("ARROW_L_EW");
      }
      else if( diffY === 2 ){
        pic = images.getTileImageForType("ARROW_L_NS");
      }
      else if( (tX<cX && oY>cY) || (oX<cX && tY>cY)  ){
        pic = images.getTileImageForType("ARROW_E_SW");
      }
      else if( (tX<cX && oY<cY) || (oX<cX && tY<cY) ){
        pic = images.getTileImageForType("ARROW_E_WN");
      }
      else if( (tX>cX && oY<cY) || (oX>cX && tY<cY) ){
        pic = images.getTileImageForType("ARROW_E_NE");
      }
      else if( (tX>cX && oY>cY) || (oX>cX && tY>cY) ){
        pic = images.getTileImageForType("ARROW_E_ES");
      }
      else{
        util.logError(
          "illegal move arrow state",
          "old (",oX,",",oY,")",
          "current (",cX,",",cY,")",
          "next (",tX,",",tY,")",
          "path (", currentMovePath ,")"
        );

        continue;
      }
    }

    cX = cX - screen.screenX;
    cY = cY - screen.screenY;
    if( cX >= 0 && cY >= 0 &&
      cX < screen.screenWidth && cY < screen.screenHeight ){

      ctx.drawImage( pic,cX*tileX,cY*tileY );
    }
  }
};

/**
 * Draws a moving unit.
 *
 * @param uid mover id
 * @param cx current y position
 * @param cy current x position
 * @param shift shift thats already moved on the current tile
 * @param moveCode move code of the current position in the move path
 */
screen.drawMoveAnimation = function( uid, cx, cy, shift, moveCode ){
  var unit = game.unitById( uid );

  var color;
  if( unit.owner === game.getTurnOwner() ){
    color = images.COLOR_GREEN;
  }
  else if( game.player(unit.owner).team ===
    game.player( game.getTurnOwner() ).team ){

    color = images.COLOR_BLUE;
  }
  else color = images.COLOR_RED;

  var state;
  var tp = unit.type;

  // GET CORRECT IMAGE STATE
  switch( moveCode ){
    case game.MOVE_CODE_UP :    state = images.IMAGE_CODE_UP;    break;
    case game.MOVE_CODE_RIGHT : state = images.IMAGE_CODE_RIGHT; break;
    case game.MOVE_CODE_DOWN :  state = images.IMAGE_CODE_DOWN;  break;
    case game.MOVE_CODE_LEFT :  state = images.IMAGE_CODE_LEFT;  break;
  }

  var pic = images.getUnitImageForType( unit.type, state, color );

  var scx = 64* animation.unitAnimationStep();
  var scy = 0;
  var scw = 64;
  var sch = 64;
  var tcx = ( cx- screen.screenX )*screen.tileSizeY -16;
  var tcy = ( cy- screen.screenY )*screen.tileSizeY -16;
  var tcw = screen.tileSizeX+screen.tileSizeX;
  var tch = screen.tileSizeY+screen.tileSizeY;

  // ADD SHIFT
  switch( moveCode ){
    case game.MOVE_CODE_UP:    tcy -= shift; break;
    case game.MOVE_CODE_LEFT:  tcx -= shift; break;
    case game.MOVE_CODE_RIGHT: tcx += shift; break;
    case game.MOVE_CODE_DOWN:  tcy += shift; break;
  }

  // DRAW IT
  screen._canvasCtx.drawImage(
    pic,
    scx,scy,
    scw,sch,
    tcx,tcy,
    tcw,tch
  );
};

/**
 * Draws the screen.
 */
screen.drawScreen = function(){

  var xe,ye;
  var screen = window.screen;
  var tx = screen.tileSizeX;
  var ty = screen.tileSizeY;
  var focusExists = (
    controller.currentState === controller.STATE_SELECT_MOVE_PATH ||
      controller.currentState === controller.STATE_SELECT_ACTION_TARGET
    );

  // iterate by row
  ye = screen.screenY + screen.screenHeight -1;
  if( ye >= game.mapHeight() ) ye = game.mapHeight()-1;
  for(var y=screen.screenY; y<=ye; y++){

    // iterate by column
    xe = screen.screenX + screen.screenWidth -1;
    if( xe >= game.mapWidth() ) xe = game.mapWidth()-1;
    for(var x= screen.screenX; x<=xe; x++){

      // RENDER IF NEEDED
      if( screen.drawnMap[ x- screen.screenX ][ y- screen.screenY ] > 0 ){

        screen._drawTile(     x, y, tx, ty );
        screen._drawProperty( x, y, tx, ty );
        if( focusExists ) screen._drawFocusTile(  x, y, tx, ty );
        screen._drawUnit(     x, y, tx, ty , animation.statAnimationStep() );

        screen.drawnMap[ x- screen.screenX ][ y- screen.screenY ] = 0;
      }
    }
  }

  // DRAW ARROW
  if( controller.currentState === controller.STATE_SELECT_MOVE_PATH ){
    screen._drawMoveArrow();
  }

  // clear counter
  screen.drawChanges = 0;
};

/**
 * Invokes a complete redraw of the screen.
 */
screen.completeRedraw = function(){

  screen.drawChanges = 1;
  for(var x=screen.screenX,xe=screen.screenWidth; x<xe; x++){
    for(var y=screen.screenY,ye=screen.screenHeight; y<ye; y++){

      screen.drawnMap[x][y] = true;
    }
  }
};

/**
 * Marks a position for re-rendering.
 *
 * @param x
 * @param y
 */
screen.markForRedraw = function( x,y ){
  var rX = x;
  var rY = y;
  if( x >= 0 && y >= 0 && x < game.mapWidth() && y < game.mapHeight() ){
    x = x - screen.screenX;
    y = y - screen.screenY;
    if( x >= 0 && y >= 0 &&
      x < screen.screenWidth && y < screen.screenHeight ){

      if( screen.drawnMap[x][y] === 1 ) return;

      screen.drawnMap[x][y] = 1;
      screen.drawChanges++;

      // check bottom tile
      x = rX;
      y = rY+1;
      if( y < game.mapHeight() ){
        if( game.propertyByPos(x,y) !== null ) screen.markForRedraw(x,y);
        else{
          var tp = game.tileByPos(x,y);
          if( screen.OVERLAYER[tp] === true ) screen.markForRedraw(x,y);
        }
      }
    }
  }
  else util.logError("illegal arguments ",x,",",y," -> out of screen bounds");
};

/**
 * Rerenders a tile and all neightbours in a range around it.
 *
 * @example
 *
 * r = 2;
 *
 *      x
 *    x x x
 *  x x o x x
 *    x x x
 *      x
 *
 * @param x
 * @param y
 */
screen.markForRedrawRange = function( x,y,r ){
  var lX;
  var hX;
  var lY = y-r;
  var hY = y+r;
  if( lY < 0 ) lY = 0;
  if( hY >= domain.mapHeight ) hY = domain.mapHeight-1;
  for( ; lY<=hY; lY++ ){

    var disY = Math.abs( lY-y );
    lX = x-r+disY;
    hX = x+r-disY;
    if( lX < 0 ) lX = 0;
    if( hX >= domain.mapWidth ) hX = domain.mapWidth-1;
    for( ; lX<=hX; lX++ ){

      screen.markForRedraw(lX,lY);
    }
  }
};

/**
 * Rerenders a tile and all 4 neightbours in a plus around it.
 *
 * @example
 *    x
 *  x o x
 *    x
 *
 * @param x
 * @param y
 */
screen.markForRedrawWithNeighbours = function( x,y ){

  if( y>0 ) screen.markForRedraw(x,y-1);
  if( x>0 ) screen.markForRedraw(x-1,y);
  screen.markForRedraw(x,y);
  if( y< game.mapHeight()-1 ) screen.markForRedraw(x,y+1);
  if( x< game.mapWidth()-1 )  screen.markForRedraw(x+1,y);
};

/**
 * Rerenders a tile and all 8 neightbours around it.
 *
 * @example
 *  x x x
 *  x o x
 *  x x x
 *
 * @param x
 * @param y
 */
screen.markForRedrawWithNeighboursRing = function( x,y ){
  var gW = game.mapWidth();
  var gH = game.mapHeight();

  // LEFT COLUMN
  if( x>0 ){
    if( y>0 )     screen.markForRedraw(x-1,y-1);
                  screen.markForRedraw(x-1,y);
    if( y< gH-1 ) screen.markForRedraw(x-1,y+1);
  }

  // MIDDLE COLUMN
  if( y>0 )       screen.markForRedraw(x,y-1);
                  screen.markForRedraw(x,y);
  if( y< gH-1 )   screen.markForRedraw(x,y+1);

  // RIGHT COLUMN
  if( x< gW-1 ){
    if( y>0 )     screen.markForRedraw(x+1,y-1);
                  screen.markForRedraw(x+1,y);
    if( y< gH-1 ) screen.markForRedraw(x+1,y+1);
  }
};

/**
 * Initializes the html 5 canvas object. This includes the automatical
 * resizing of the canvas object.
 *
 * @event
 */
signal.connect( signal.EVENT_CLIENT_INIT, function(){
  var canvEl = document.getElementById( client.ID_CANVAS );
  canvEl.height = window.innerHeight;
  canvEl.width = window.innerWidth;
  screen._canvasCtx = canvEl.getContext("2d");

  screen.screenWidth  = parseInt( canvEl.width  / screen.tileSizeX , 10 );
  screen.screenHeight = parseInt( canvEl.height / screen.tileSizeY , 10 );
  canvEl.height = screen.screenHeight * 32;
  canvEl.width  = screen.screenWidth * 32;

  var diffX = window.innerWidth - canvEl.width;
  var diffY = window.innerHeight - canvEl.height;

  canvEl.style.marginLeft   = diffX/2+"px";
  canvEl.style.marginRight  = diffX/2+"px";
  canvEl.style.marginTop    = diffY/2+"px";
  canvEl.style.marginBottom = diffY/2+"px";

  screen.ammoStatusMap = util.matrix(
    screen.screenWidth,
    screen.screenHeight,
    false
  );

  screen.fuelStatusMap = util.matrix(
    screen.screenWidth,
    screen.screenHeight,
    false
  );
});