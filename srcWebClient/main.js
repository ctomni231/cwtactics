/**
 * Custom Wars Tactcics Web Client (CWTWC) build for HTML 5 and ES5 compatible
 * environments. This program is a game client for the Custom Wars Tactics
 * game engine.
 *
 * @namespace
 */
var cwtwc = {};

cwtwc.version = "0.1.0";

/** @constant */
cwtwc.APP_CONTAINER = "app";

/** @constant */
cwtwc.CANVAS_CONTAINER = "cwt_maplayer";

/** @constant */
cwtwc.MENU_CONTAINER = "menu";

cwtwc.fps = 0;
cwtwc.now;
cwtwc.lastUpdate = (new Date)*1 - 1;

// The higher this value, the less the FPS will be affected by quick changes
// Setting this to 1 will show you the FPS of the last sampled frame only
cwtwc.fpsFilter = 10;

var _x = 0;

/**
 * Updates the game logic and graphic.
 *
 * @param delta time since last call in ms
 */
cwtwc.update = function( delta ){

  var holder = cwtwc.movingHolder;
  var thisFrameFPS = 1000 / ((cwtwc.now=new Date) - cwtwc.lastUpdate);
  cwtwc.fps += (thisFrameFPS - cwtwc.fps) / cwtwc.fpsFilter;
  cwtwc.lastUpdate = cwtwc.now;

  cwtwc.solveMapShift();

  if( cwtwc.movingHolder.cX !== -1 ){

    cwtwc.drawnMap[holder.cX][holder.cY] = true;
    cwtwc.drawChanges = 1;
    switch( holder.way[ holder.cur ] ){
      case cwt.MOVE_CODE_UP:
        cwtwc.drawnMap[holder.cX][holder.cY-1] = true;
        break;

      case cwt.MOVE_CODE_LEFT:
        cwtwc.drawnMap[holder.cX-1][holder.cY] = true;
        break;

      case cwt.MOVE_CODE_RIGHT:
        cwtwc.drawnMap[holder.cX+1][holder.cY] = true;
        break;

      case cwt.MOVE_CODE_DOWN:
        cwtwc.drawnMap[holder.cX][holder.cY+1] = true;
        break;

      default: cwt.error("unknown code {0}", holder.way[i]);
    }
  }

  if( cwtwc.drawChanges > 0 ){
    cwtwc.drawScreen();
  }

  if( cwtwc.movingHolder.cX !== -1 ){

    var selimgL;
    var tp = holder.type;
    switch( holder.way[ holder.cur ] ){
      case cwt.MOVE_CODE_UP:
        tp += "_MV_UP";
        break;

      case cwt.MOVE_CODE_LEFT:
        tp += "_MV_LEFT";
        break;

      case cwt.MOVE_CODE_RIGHT:
        tp += "_MV_LEFT";
        break;

      case cwt.MOVE_CODE_DOWN:
        tp += "_MV_DOWN";
        break;

      default: cwt.error("unknown code {0}", holder.way[i]);
    }
    var pix = cwtwc.imageTypeMap[ tp ];

    if( holder.owner % 2 === 1 ){
      if( holder.owner === cwt._turnPid ) selimgL = cwtwc.imageListMap.GREEN;
      else if( cwt.player(unit.owner).team === cwt.player(cwt._turnPid).team ) selimgL = cwtwc.imageListMap.BLUE;
      else selimgL = cwtwc.imageListMap.RED;
    }
    else{
      if( holder.owner === cwt._turnPid ) selimgL = cwtwc.imageListMap.GREEN_FLIPPED;
      else if( cwt.player(unit.owner).team === cwt.player(cwt._turnPid).team ) selimgL = cwtwc.imageListMap.BLUE_FLIPPED;
      else selimgL = cwtwc.imageListMap.RED_FLIPPED;
    }

    var scrX = (holder.cX-cwtwc.sx)*32 -16;
    var scrY = (holder.cY-cwtwc.sy)*32 -16;

    switch( holder.way[ holder.cur ] ){
      case cwt.MOVE_CODE_UP:
        scrY -= holder.shift;
        break;

      case cwt.MOVE_CODE_LEFT:
        scrX -= holder.shift;
        break;

      case cwt.MOVE_CODE_RIGHT:
        scrX += holder.shift;
        break;

      case cwt.MOVE_CODE_DOWN:
        scrY += holder.shift;
        break;

      default: cwt.error("unknown code {0}", holder.way[i]);
    }

    cwtwc.ctx_map.drawImage(
      selimgL[ pix[0] ],
      pix[4] + ( pix[7]*pix[1]), pix[5],
      pix[1], pix[2],
      scrX, scrY,
      64, 64
    )

    holder.shift += 4;
    if( holder.shift === 32 ){

      switch( holder.way[ holder.cur ] ){
        case cwt.MOVE_CODE_UP:
          holder.cY--;
          break;

        case cwt.MOVE_CODE_LEFT:
          holder.cX--;
          break;

        case cwt.MOVE_CODE_RIGHT:
          holder.cX++;
          break;

        case cwt.MOVE_CODE_DOWN:
          holder.cY++;
          break;

        default: cwt.error("unknown code {0}", holder.way[i]);
      }

      holder.cur++;
      holder.shift = 0;
    }

    if( holder.cur === holder.way.length ){
      holder.cX = -1; // DONE
    }
  }
  else if( cwt.isMsgInBuffer() ){
    var msg = cwt.popMsgFromBuffer();
    cwt.evalTransactionMessage( msg );
    if( msg.k === 'captureProperty' ) cwtwc.completeRedraw();

    if( msg.k === '_movePath' ){
      var unit = cwt.unitById( msg.a[0] );
      var holder = cwtwc.movingHolder;
      holder.cX = msg.a[1];
      holder.cY = msg.a[2];
      holder.type = unit.type;
      holder.way = msg.a[3];
      holder.owner = unit.owner;
      holder.cur = 0;

      var tX = holder.cX;
      var tY = holder.cY;

      for( var i =0, e= holder.way.length; i<e; i++ ){
        switch( holder.way[i] ){
          case cwt.MOVE_CODE_UP: tY--; break;
          case cwt.MOVE_CODE_LEFT: tX--; break;
          case cwt.MOVE_CODE_RIGHT: tX++; break;
          case cwt.MOVE_CODE_DOWN: tY++; break;
          default: cwt.error("unknown code {0}", holder.way[i]);
        }
      }

      holder.tX = tX;
      holder.tY = tY;

      if( cwt.DEBUG ) cwt.info("drawing way animation for {0}",holder);
    }
  }

  if( cwtwc.msx === 0 && cwtwc.msy === 0 ){
    cwtwc.triggerAnimation( delta );
  }
}

cwt.onInit("web client main",function( annotated ){
  cwtwc.fpsOut = document.getElementById('fps');
  setInterval(function(){
    cwtwc.fpsOut.innerHTML = cwtwc.fps.toFixed(1) + "fps";
  }, 250);

  // init controllers
  cwtwc._initCanvasElement();
  cwtwc.menuController.init();
  cwtwc.plugins.startAll();
  cwtwc._initInput();
});

cwtwc.movingHolder = {
  cX: -1,
  cY: -1,
  tX: -1,
  tY: -1,
  shift: 0,
  cur: 0,
  owner: 0,
  type: null,
  way: null
}