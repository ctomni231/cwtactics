/**
 * Canvas context.
 */
cwtwc.ctx_map = null;

cwtwc.ctx_map_buffer = null;
cwtwc.map_buffer = null;

cwtwc.tx = 32;
cwtwc.ty = 32;

cwtwc.cursorX = 0;
cwtwc.cursorY = 0;

cwtwc.drawnMap = [];

cwtwc.cAnimTime = 0;
cwtwc.cAnimStep = 0;

/**
 * Time in ms to trigger next picture of the animation.
 *
 * @config
 */
cwtwc.DURATION_ANIM_STEP = 250;

/**
 * Invokes a complete redraw of the screen.
 */
cwtwc.completeRedraw = function(){
  cwtwc.drawChanges = 1;
  for(var x=0; x< cwtwc.sw; x++){
    for(var y=0; y< cwtwc.sh; y++){

      cwtwc.drawnMap[x][y] = true;
    }
  }
};

/**
 * @private
 */
cwtwc._initCanvasElement = function(){
  var canvEl = document.getElementById( cwtwc.CANVAS_CONTAINER );

  cwtwc.ctx_map = canvEl.getContext("2d");
  cwtwc.sw = parseInt( canvEl.width / cwtwc.tx , 10 );
  cwtwc.sh = parseInt( canvEl.height / cwtwc.ty , 10 );

  for( var i=0; i<cwtwc.sw; i++ ) cwtwc.drawnMap[i] = [];

  var canvas = document.createElement("canvas");
  var canvasContext = canvas.getContext("2d");

  canvas.width = canvEl.width;
  canvas.height = canvEl.height;

  cwtwc.ctx_map_buffer = canvasContext;
  cwtwc.map_buffer = canvas;
};

/**
 * This calculates the the tile that needs to be redrawn to
 * draw animations correctly.
 *
 * @param time delta time since the last call of this function
 */
cwtwc.triggerAnimation = function( time ){

  cwtwc.cAnimTime += time;
  if( cwtwc.cAnimTime >= cwtwc.DURATION_ANIM_STEP ){

    cwtwc.cAnimTime = 0;
    
    /*
    this.cAnimStep++;
    if( this.cAnimStep === 3 ) this.cAnimStep= 0;
    */
    
    // increase animations
    var keys = Object.keys( cwtwc.imageTypeMap );
    for( var i=0,e=keys.length ; i<e; i++ ){
      var type = cwtwc.imageTypeMap[ keys[i] ];

      type[7]++;
      if( type[7] >= type[3] ) type[7] = 0;
    }

    cwtwc.drawChanges = 0;

    // rebuild draw map
    var xe,ye;
    var map = cwt._map;

    ye = cwtwc.sy + cwtwc.sh-1;
    if( ye >= cwt.mapHeight ) ye = cwt.mapHeight-1;
    for(var y=cwtwc.sy; y<=ye; y++){

      xe = cwtwc.sx + cwtwc.sw-1;
      if( xe >= cwt.mapWidth ) xe = cwt.mapWidth-1;
      for(var x=cwtwc.sx; x<=xe; x++){

        var unit = cwt.unitByPos(x,y);
        var property = cwt.propertyByPos(x,y);
        if(
          unit !== null ||
          property !== null
            || cwtwc.focusTiles[x][y] === true
            || (
              ( x-cwtwc.sx-1 === cwtwc.cursorX ||
                x-cwtwc.sx   === cwtwc.cursorX   ||
                x-cwtwc.sx+1 === cwtwc.cursorX    ) &&
              ( y-cwtwc.sy-1 === cwtwc.cursorY ||
                y-cwtwc.sy   === cwtwc.cursorY   ||
                y-cwtwc.sy+1 === cwtwc.cursorY    )
            )
            ||
            (
              y>0 &&
                (
                  cwt._unitPosMap[x][y-1] !== null ||
                    cwtwc.drawnMap[x-cwtwc.sx][y-cwtwc.sy-1]
                  )
              )
          ){

          if( y > 0 && property !== null && cwtwc.imageTypeMap[ property.type ][6] ){
            cwtwc.drawnMap[x-cwtwc.sx][y-cwtwc.sy-1] = true;
            cwtwc.drawChanges++;
          }

          cwtwc.drawnMap[x-cwtwc.sx][y-cwtwc.sy] = true;
          cwtwc.drawChanges++;
        }
        else cwtwc.drawnMap[x-cwtwc.sx][y-cwtwc.sy] = false;
      }
    }
  }
};

cwtwc._drawTile = function( map,x,y,tx,ty ){

  var tp= map[x][y];
  var pix = cwtwc.imageTypeMap[ tp ];
  var selimgL = cwtwc.imageListMap.GREEN;

  var scx = pix[4];
  var scy = pix[5];
  var scw = pix[1];
  var sch = pix[2];
  var tcx = (x-cwtwc.sx)*tx;
  var tcy = (y-cwtwc.sy)*ty - ty;
  var tcw = tx;
  var tch = ty+ty;

  if( tcy < 0 ){
    scy = scy + ty;
    sch = sch - ty;
    tcy = tcy + ty;
    tch = tch - ty;
  }

  if( pix !== undefined ){

    // draw tile
    cwtwc.ctx_map.drawImage(
      selimgL[ pix[0] ],
      scx,scy,
      scw,sch,
      tcx,tcy,
      tcw,tch
    );
  }
  else{

    cwtwc.ctx_map.fillStyle="rgb(0,0,255)";
    cwtwc.ctx_map.fillRect( (x-this.sx)*tx, (y-this.sy)*ty, tx, ty );
  }
};

cwtwc._drawProperty = function( map,x,y,tx,ty ){
  // draw property above tile
  var property = cwt.propertyByPos(x,y);
  if( property !== null ){

    var pix = cwtwc.imageTypeMap[ property.type ];
    var selimgL = cwtwc.imageListMap.GREEN;

    if( property.owner === -1 ) selimgL = cwtwc.imageListMap.GRAY;
    else if( property.owner === cwt._turnPid ) selimgL = cwtwc.imageListMap.GREEN;
    else if( cwt.player(property.owner).team === cwt.player(cwt._turnPid).team ) selimgL = cwtwc.imageListMap.BLUE;
    else selimgL = cwtwc.imageListMap.RED;

    var scx = pix[4];
    var scy = pix[5];
    var scw = pix[1];
    var sch = pix[2];
    var tcx = (x-cwtwc.sx)*tx;
    var tcy = (y-cwtwc.sy)*ty - ty;
    var tcw = tx;
    var tch = ty+ty;

    if( tcy < 0 ){
      scy = scy + ty;
      sch = sch - ty;
      tcy = tcy + ty;
      tch = tch - ty;
    }

    if( pix !== undefined ){
      cwtwc.ctx_map.drawImage(
        selimgL[ pix[0] ],
        scx,scy,
        scw,sch,
        tcx,tcy,
        tcw,tch
      );
    }
    else{
      cwtwc.ctx_map.fillStyle="rgb(0,255,0)";
      cwtwc.ctx_map.fillRect( (x-cwtwc.sx)*tx+4, (y-cwtwc.sy)*ty+4, tx-8, ty-8 );
    }
  }
};

cwtwc._drawFocusTile = function( map,x,y,tx,ty ){
  var selimgL = cwtwc.imageListMap.RED;
  if( cwtwc.focusTiles[x][y] === true ){

    // canvas.globalAlpha = 0.5;
    var pix = cwtwc.imageTypeMap[ "MOVE_CURSOR" ];
    cwtwc.ctx_map.drawImage(
      selimgL[ pix[0] ],
      pix[4] + ( pix[7]*pix[1] ), pix[5],
      pix[1], pix[2],
      (x-cwtwc.sx)*tx, (y-cwtwc.sy)*ty,
      tx, ty
    );
    // canvas.globalAlpha = 1;
  }

};

cwtwc._drawUnit = function( map,x,y,tx,ty ){
  var canvas = cwtwc.ctx_map;

  // draw unit above tile
  var unit = cwt._unitPosMap[x][y];
  if( unit !== null ){

    var selimgL;
    var pix = cwtwc.imageTypeMap[ unit.type ];

    if( unit.owner % 2 === 1 ){
      if( unit.owner === cwt._turnPid ) selimgL = cwtwc.imageListMap.GREEN;
      else if( cwt.player(unit.owner).team === cwt.player(cwt._turnPid).team ) selimgL = cwtwc.imageListMap.BLUE;
      else selimgL = cwtwc.imageListMap.RED;
    }
    else{
      if( unit.owner === cwt._turnPid ) selimgL = cwtwc.imageListMap.GREEN_FLIPPED;
      else if( cwt.player(unit.owner).team === cwt.player(cwt._turnPid).team ) selimgL = cwtwc.imageListMap.BLUE_FLIPPED;
      else selimgL = cwtwc.imageListMap.RED_FLIPPED;
    }

    var scrX = (x-cwtwc.sx)*tx -16;
    var scrY = (y-cwtwc.sy)*ty -16;

    if( pix !== undefined ){
      canvas.drawImage(
        selimgL[ pix[0] ],
        pix[4] + ( pix[7]*pix[1]), pix[5],
        pix[1], pix[2],
        scrX, scrY,
        64, 64
      );

      var uid = cwt.extractUnitId( cwt.unitByPos(x,y) );
      if( unit.owner === cwt._turnPid && !cwt.canAct(uid) ){
        canvas.globalAlpha = 0.15;
        canvas.drawImage(
          ( unit.owner % 2 === 1 )? cwtwc.imageListMap.BLACK_MASK[ pix[0] ]: cwtwc.imageListMap.BLACK_MASK_FLIPPED[ pix[0] ],
          pix[4] + ( pix[7]*pix[1]), pix[5],
          pix[1], pix[2],
          scrX, scrY,
          64, 64
        );
        canvas.globalAlpha = 1;
      }
    }
    else{
      canvas.fillStyle="rgb(255,0,0)";
      canvas.fillRect( (x-this.sx)*tx+4, (y-this.sy)*ty+4, tx-8, ty-8 );
    }
  }
};

/**
 * Draws the changes on the screen. This algorithm draws only the delta changes
 * from the last drawing step. Furthermore this function recognizes overlapping
 * objects.
 *
 * @param animStep
 */
cwtwc.drawScreen = function(){

  var xe,ye;
  var tx = cwtwc.tx;
  var ty = cwtwc.ty;
  var map = cwt._map;

  // iterate by row
  ye = cwtwc.sy + cwtwc.sh -1;
  if( ye >= cwt.mapHeight ) ye = cwt.mapHeight-1;
  for(var y=cwtwc.sy; y<=ye; y++){

    // iterate by column
    xe = cwtwc.sx + cwtwc.sw -1;
    if( xe >= cwt.mapWidth ) xe = cwt.mapWidth-1;
    for(var x=cwtwc.sx; x<=xe; x++){

      cwtwc._drawTile( map, x, y, tx, ty );
      cwtwc._drawProperty( map, x, y, tx, ty );
      cwtwc._drawFocusTile( map, x, y, tx, ty );
      cwtwc._drawUnit( map, x, y, tx, ty );
    }
  }

  // clear counter
  cwtwc.drawChanges = 0;
};