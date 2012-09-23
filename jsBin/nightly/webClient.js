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
cwtwc.imageTypeMap = {};

cwtwc.imageListMap = {
  RED:   [],
  GREEN: [],
  BLUE:  [],
  BLACK_MASK:  [],
  GRAY:  [],
  RED_FLIPPED:   [],
  GREEN_FLIPPED: [],
  BLUE_FLIPPED:  [],
  BLACK_MASK_FLIPPED:  [],
  GRAY_FLIPPED:  []
};

/**
 * Color maps for different target color shemas.
 */
cwtwc.imgColorReplacementMapProperty = {

  GRAY:[
    120,104,120,
    152,136,200,
    192,192,200,
    240,232,208,
    248,248,240
  ],

  RED:[
    255,255,0,
    184,64,120,
    224,80,56,
    248,208,136,
    248,248,248
  ],

  BLACK_MASK:[
    0,0,0,
    0,0,0,
    0,0,0,
    0,0,0,
    0,0,0
  ],

  BLUE:[
    255,255,0,
    104,72,224,
    120,112,248,
    136,208,248,
    184,248,248
  ],

  GREEN:[
    255,255,0,
    64,160,104,
    80,200,88,
    128,232,120,
    168,248,168
  ]
}

/**
 * Color maps for different target color shemas.
 */
cwtwc.imgColorReplacementMap = {

  /** @constant */
          // "#381818","#980038","#E00008","#F82800","#F85800","#F89870","#F8C880"
  RED:    [ 56,24,24,
            152,0,56,
            224,0,8,
            248,40,0,
            248,88,0,
            248,152,112,
            248,200,128,
            255,239,95 ],

  /** @constant */
          // "#182818","#088048","#08A830","#10D028","#28F028","#88F880","#C8F8C0"
  GREEN:  [ 24,40,24,
            8,128,72,
            8,168,48,
            16,208,40,
            40,240,40,
            136,248,128,
            200,248,192,
            255,239,95 ],

  BLACK_MASK:[
    0,0,0,
    0,0,0,
    0,0,0,
    0,0,0,
    0,0,0,
    0,0,0,
    0,0,0,
    0,0,0
  ],

  /** @constant */
          // "#181840","#2820C0","#0068E8","#0098F0","#40B8F0","#68E0F8","#B8F0F8"
  BLUE:   [ 24,24,64,
            40,32,192,
            0,104,232,
            0,152,240,
            64,184,240,
            104,224,248,
            184,240,248,
            255,239,95 ]
};

/**
 *
 * @param key
 * @param img
 * @param w
 * @param h
 * @param tiles
 * @param sx
 * @param sy
 * @param overlay
 */
cwtwc.registerImage = function( key, img, w, h, tiles, sx, sy, overlay, property ){

  // register image for loading
  var index = cwtwc.imageListMap.RED.indexOf(img);
  if( index === -1 ){
    index = cwtwc.imageListMap.RED.length;
    cwtwc.imageListMap.RED.push( img );
  }

  if( property === true ){
    property = 1;
  }
  else property = 0;

  // register image type
  cwtwc.imageTypeMap[ key ] = [
    index,
    w, h,
    tiles,
    sx, sy,
    overlay, 0,
    property
  ];
};

/**
 * @private
 */
cwtwc._imagesLoaded = function(){

  for(var i = 0, e= cwtwc.imageListMap.RED.length; i <e; i++) {
    if( !cwtwc.imageListMap.RED[i].complete ){
      return false;
    }
  }

  return true;
};

cwtwc.imageLoadingStatus = StateMachine.create({

  initial: 'off',

  error: function( eventName, from, to, args, errorCode, errorMessage, e ){
    if( cwt.DEBUG ) cwt.info("error in image loading status, e:{0}", e.messages);
    return "";
  },

  events: [
    { name: 'init', from: 'off',         to: 'loadImages' },
    { name: 'next', from: 'loadImages',  to: 'filterColor' },
    { name: 'next', from: 'filterColor', to: 'filterHq' },
    { name: 'next', from: 'filterHq',    to: 'ready' }
  ],

  callbacks: {

    onloadImages: function(){
      var t = new Date().getTime();
      if( cwt.DEBUG ) cwt.info("loading images");

      function waitLoaded(){

        // wait unit all images are loaded
        if( !cwtwc._imagesLoaded() === true ){
          setTimeout( waitLoaded, 50 );
        }
        else{
          if( cwt.DEBUG ) cwt.info("needed {0}ms",( new Date().getTime()-t));
          cwtwc.imageLoadingStatus.next();
        }
      }

      setTimeout( waitLoaded, 50 );
    },

    /**
     * Filters images with the own color filter.
     */
    onfilterColor: function(){
      var t = new Date().getTime();
      if( cwt.DEBUG ) cwt.info("filtering images with custom colors");

      function flip( image ){
        return image;
        var canvas = document.createElement('canvas');
        var canvasHLP = document.createElement('canvas');
        var canvasContext = canvas.getContext('2d');
        var canvasContextHLP = canvas.getContext('2d');

        //canvasContext.translate( image.width , 0);
        //canvasContextHLP.translate( 32, 0 );
        //canvasContextHLP.scale( -1, 1);
        //canvasContext.scale(-1, 1);
        //canvasContext.drawImage( image , 0, 0);

        canvasHLP.width = 32;
        canvasHLP.height = image.height;
        canvas.width = image.width;
        canvas.height = image.height;

        // TODO to make it looking shiny take 4x3 pairs
        // TODO replace it with a solution later
        var num = parseInt(image.width/32,10);
        for( var i=0; i<num; i++ ){
          canvasContextHLP.clearRect( 0,0, 32, image.height );
          canvasContextHLP.drawImage( image, i*32, 0, 32, image.height, 0, 0, 32, image.height );
          canvasContext.drawImage( canvasHLP, 0, 0, 32, image.height, i*32, 0, 32, image.height );
         // canvasContext.drawImage( image, i*32, 0, 32, image.height, i*32, 0, 32, image.height );
        }

        // canvasContext.drawImage( image, 0, 0 );

        return canvas;
      }

      function replaceColors( image, oriColors, replColors ){
        var canvas = document.createElement("canvas");
        var canvasContext = canvas.getContext("2d");

        var imgW = image.width;
        var imgH = image.height;
        canvas.width = imgW;
        canvas.height = imgH;
        canvasContext.drawImage( image, 0, 0);
        var imgPixels = canvasContext.getImageData(0, 0, imgW, imgH);

        var t = true;
        for(var y = 0; y < imgPixels.height; y++){
          for(var x = 0; x < imgPixels.width; x++){
            var xi = (y * 4) * imgPixels.width + x * 4;


            for( var n=0,ne=oriColors.length; n<ne; n+=3 ){

              // compare red, green and blue color values
              if( imgPixels.data[xi]   ===  oriColors[n]   &&
                  imgPixels.data[xi+1] ===  oriColors[n+1] &&
                  imgPixels.data[xi+2] ===  oriColors[n+2]
                ){
                
                // replace them by new values
                imgPixels.data[xi]   = replColors[n];
                imgPixels.data[xi+1] = replColors[n+1];
                imgPixels.data[xi+2] = replColors[n+2];
              }
            }
          }
        }

        // write changes back
        canvasContext.putImageData(imgPixels, 0, 0 );
        return canvas;
      }

      var keys = Object.keys( cwtwc.imageTypeMap );
      var indexesProperties = []; // i=8
      for( var i=0,e=keys.length; i<e; i++ ){
        if( cwtwc.imageTypeMap[ keys[i] ][8] === 1 ){
          indexesProperties.push( cwtwc.imageTypeMap[ keys[i] ][0] );
        }
      }

      var imgMap = cwtwc.imageListMap;
      for( var i=0,e=imgMap.RED.length; i<e; i++ ){

        if( indexesProperties.indexOf(i) !== -1 ){
          var colorMap = cwtwc.imgColorReplacementMapProperty;

          imgMap.BLUE[i] = replaceColors( imgMap.RED[i], colorMap.RED, colorMap.BLUE );
          imgMap.GREEN[i] = replaceColors( imgMap.RED[i], colorMap.RED, colorMap.GREEN );
          imgMap.BLACK_MASK[i] = replaceColors( imgMap.RED[i], colorMap.RED, colorMap.BLACK_MASK );
          imgMap.GRAY[i]          = replaceColors( imgMap.RED[i], colorMap.RED, colorMap.GRAY );
          imgMap.BLUE_FLIPPED[i]  = null;
          imgMap.GREEN_FLIPPED[i] = null;
          imgMap.BLACK_MASK_FLIPPED[i] = null;
          imgMap.RED_FLIPPED[i] = null;
          imgMap.GRAY_FLIPPED[i]  = null;
        }
        else{
          var colorMap = cwtwc.imgColorReplacementMap;

          imgMap.BLUE[i] = replaceColors( imgMap.RED[i], colorMap.RED, colorMap.BLUE );
          imgMap.GREEN[i] = replaceColors( imgMap.RED[i], colorMap.RED, colorMap.GREEN );
          imgMap.BLACK_MASK[i] = replaceColors( imgMap.RED[i], colorMap.RED, colorMap.BLACK_MASK );
          imgMap.GRAY[i] = null;
          imgMap.BLUE_FLIPPED[i]  = flip(imgMap.BLUE[i]);
          imgMap.GREEN_FLIPPED[i] = flip(imgMap.GREEN[i]);
          imgMap.RED_FLIPPED[i] = flip(imgMap.RED[i]);
          imgMap.BLACK_MASK_FLIPPED[i] = flip(imgMap.BLACK_MASK[i]);
          imgMap.GRAY_FLIPPED[i]  = null;
        }
      }

      if( cwt.DEBUG ) cwt.info("needed {0}ms",( new Date().getTime()-t));
      cwtwc.imageLoadingStatus.next();
    },

    /**
     * Filters images with the HqX filter.
     */
    onfilterHq: function(){
      var t = new Date().getTime();
      if( cwt.DEBUG ) cwt.info("scaling up");
      
      function scale( image ){
        var canvas = document.createElement("canvas");
        var canvasContext = canvas.getContext("2d");

        var imgW = image.width*2;
        var imgH = image.height*2;
        canvas.width = imgW;
        canvas.height = imgH;
        canvasContext.drawImage( image, 0, 0, imgW, imgH );
        
        return canvas;
      }
      
      var imgMap = cwtwc.imageListMap;
      for( var i=0,e=imgMap.RED.length; i<e; i++ ){

        imgMap.RED[i] = scale( imgMap.RED[i] );
        imgMap.BLUE[i] = scale( imgMap.BLUE[i] );
        imgMap.GREEN[i] = scale( imgMap.GREEN[i] );
        if( imgMap.GRAY[i] !== null ) imgMap.GRAY[i] = scale( imgMap.GRAY[i] );
        if( imgMap.BLACK_MASK[i] !== null ) imgMap.BLACK_MASK[i] = scale( imgMap.BLACK_MASK[i] );
        if( imgMap.BLACK_MASK_FLIPPED[i] !== null ) imgMap.BLACK_MASK_FLIPPED[i] = scale( imgMap.BLACK_MASK_FLIPPED[i] );
        if( imgMap.RED_FLIPPED[i] !== null ) imgMap.RED_FLIPPED[i] = scale( imgMap.RED_FLIPPED[i] );
        if( imgMap.GREEN_FLIPPED[i] !== null ) imgMap.GREEN_FLIPPED[i] = scale( imgMap.GREEN_FLIPPED[i] );
        if( imgMap.BLUE_FLIPPED[i] !== null ) imgMap.BLUE_FLIPPED[i] = scale( imgMap.BLUE_FLIPPED[i] );
      }      
      
/*
      if( cwt.DEBUG ) cwt.log.info("filtering images with hqX");

      var imgMap = cwt.client.imageListMap;
      for( var i=0,e=imgMap.RED.length; i<e; i++ ){

        imgMap.RED[i] = hqx( imgMap.RED[i], 2 );
        imgMap.BLUE[i] = hqx( imgMap.BLUE[i], 2 );
        imgMap.GREEN[i] = hqx( imgMap.GREEN[i], 2 );
      }
*/
      if( cwt.DEBUG ) cwt.info("needed {0}ms",( new Date().getTime()-t));
      cwtwc.imageLoadingStatus.next();
    }
  }
})
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
/**
 * Holds the current selected unit by the client.
 */
cwtwc.selectedUnit = null;

/**
 * Holds markers for tiles that will be shown as focussed
 * (move map, attack range or commander range).
 */
cwtwc.focusTiles = null;

cwtwc._initInput = function(){
  var appEl = document.getElementById( cwtwc.APP_CONTAINER );

  cwtwc._initMouseEvents(appEl);
  cwtwc._initTouchEvents(appEl);

  // react on state changes
  cwt.input.addStateChangeListener( cwtwc._stateChangelistener );

  cwtwc.focusTiles = cwt.util.matrix(100, 100, false);
};

/**
 * @private
 */
cwtwc._stateChangelistener = function( state, oldState, event ){

  // OLD STATE
  switch( oldState ){

    // MENU
    case 'UnitActions' :
    case 'MapActions' :
    case 'FactoryActions' :

      if( event === 'back' || event === 'doAction' ){
        cwtwc.menuController.hide();
      }

      break;
  }

  // TO STATE
  switch( state ){
  
    // hide move tiles after releasing unit selection
    case 'NoSelection' :
      cwtwc._resetFocusTiles();
      break;
      
    // show move tiles
    case 'UnitMoveMap' :
      // var mvBlock = cwt.input.movemap.moveMap;
      var card = cwt.input.movemap;
      var cost;
      
      for( var mvsX=card.moveMapX,
               mvsXe=card.moveMapX+(cwt.MAX_MOVE_RANGE*2+1) ; mvsX<mvsXe; mvsX++ ){
        
        for( var mvsY=card.moveMapY,
                 mvsYe=card.moveMapY+(cwt.MAX_MOVE_RANGE*2+1) ; mvsY<mvsYe; mvsY++ ){

          cost = cwt.moveCostsForPos( card, mvsX, mvsY );
          if( cost > 0 ){

            // set focus
            cwtwc.focusTiles[mvsX][mvsY] = true;

            // mark for redraw
            if( mvsX >= cwtwc.sx && mvsX < cwtwc.sx+cwtwc.sw &&
                mvsY >= cwtwc.sy && mvsY < cwtwc.sy+cwtwc.sh    ){

              cwtwc.drawnMap[mvsX-cwtwc.sx][mvsY-cwtwc.sy] = true;
            }

            cwtwc.drawChanges = 1;
          }
        }
      }

      break;

    case 'UnitSelection':
      cwt.input.showMoveMap();
      break;
      
    // MENU
    case 'UnitActions' :
    case 'MapActions' :
    case 'FactoryActions' :
      cwtwc.menuController.show(
        cwt.input.actions,
        cwtwc.cursorX, cwtwc.cursorY
      );
      break;
  } 
};

/**
 * @param x
 * @param y
 */
cwtwc.click = function(x,y){
  if( cwt.DEBUG ){
    cwt.info("got a click at tile {0},{1}", x, y );
  }

  if( cwt.input.current === 'UnitMoveMap' ){
    if( cwt.moveCostsForPos( cwt.input.movemap, x, y ) > 0 ){

      var card = cwt.input.movemap;
      card.way = cwt.returnPath( card.uid, card.x, card.y, x, y, card );
      cwt.input.showActionMap(x,y);
    }
    else{

      cwtwc.back(x,y);
    }
  }
  else{
    var unitId = cwt.tileOccupiedByUnit(x,y);
    if( unitId !== false && cwt.canAct(unitId) ){

      // UNIT SELECTION
      cwt.input.unitSelected( unitId );
    }
    else{
/*
      var propId = cwt.tileIsProperty(x,y);
      if( propId !== false ){

        // FACTORY SELECTION
        cwt.input.factorySelected( propId );
      }
      else{
*/
        // MAP SELECTION
        cwt.input.mapSelected( x, y );
      /* } */
    }
  }
};

cwtwc.back = function(x,y){
  cwt.input.back();
};

/**
 * Erases the focus tiles and invokes a rerender of the
 * focussed tile in the next draw tick.
 *
 * @private
 */
cwtwc._resetFocusTiles = function(){
  for( var i=0,e=cwt.mapWidth; i<e; i++ ){
    for( var j=0,ej=cwt.mapHeight; j<ej; j++ ){
      
      if( cwtwc.focusTiles[i][j] === true ){
          if( i >= cwtwc.sx && i < cwtwc.sx+cwtwc.sw &&
              j >= cwtwc.sy && j < cwtwc.sy+cwtwc.sh ){

            cwtwc.drawnMap[i-cwtwc.sx][j-cwtwc.sy] = true;
          }

          cwtwc.focusTiles[i][j] = false;
      }
    }
  }
  cwtwc.drawChanges = 1;
};

/**
 * @private
 */
cwtwc._rerenderCursorTiles = function(){

  if( cwtwc.cursorY-1 >= 0 ){
    if( cwtwc.cursorX-1 >= 0 )      cwtwc.drawnMap[ cwtwc.cursorX-1 ][ cwtwc.cursorY-1 ] = true;
    cwtwc.drawnMap[ cwtwc.cursorX   ][ cwtwc.cursorY-1 ] = true;
    if( cwtwc.cursorX+1 < cwtwc.sw ) cwtwc.drawnMap[ cwtwc.cursorX+1 ][ cwtwc.cursorY-1 ] = true;
  }

  if( cwtwc.cursorX-1 >= 0 )      cwtwc.drawnMap[ cwtwc.cursorX-1 ][ cwtwc.cursorY   ] = true;
  cwtwc.drawnMap[ cwtwc.cursorX   ][ cwtwc.cursorY   ] = true;
  if( cwtwc.cursorX+1 < cwtwc.sw ) cwtwc.drawnMap[ cwtwc.cursorX+1 ][ cwtwc.cursorY   ] = true;

  if( cwtwc.cursorY+1 < cwtwc.sh ){
    if( cwtwc.cursorX-1 >= 0 )      cwtwc.drawnMap[ cwtwc.cursorX-1 ][ cwtwc.cursorY+1 ] = true;
    cwtwc.drawnMap[ cwtwc.cursorX ][ cwtwc.cursorY+1 ] = true;
    if( cwtwc.cursorX+1 < cwtwc.sw ) cwtwc.drawnMap[ cwtwc.cursorX+1 ][ cwtwc.cursorY+1 ] = true;
  }

  // mark redraw wish
  cwtwc.drawChanges = 1;
};

/**
 * Extracts the key code from an key event and calls the map shift
 * function of the webclient with correct arguments.
 *
 * @private
 */
cwtwc._keyboardEvent = function( event ){

  switch( event.keyCode ){

    // LEFT
    case 37:
      cwtwc._rerenderCursorTiles();
      if( cwtwc.cursorX == 3 && cwtwc.sx > 0 ){
        cwtwc.betterMapShift(3,1);
      }
      else{
        cwtwc.cursorX--;
        if( cwtwc.cursorX < 0 ) cwtwc.cursorX = 0;
      }
      break;

    // UP
    case 38:
      cwtwc._rerenderCursorTiles();
      if( cwtwc.cursorY == 3 && cwtwc.sy > 0 ){
        cwtwc.betterMapShift(0,1);
      }
      else{
        cwtwc.cursorY--;
        if( cwtwc.cursorY < 0 ) cwtwc.cursorY = 0;
      }
      break;

    // RIGHT
    case 39:
      this._rerenderCursorTiles();
      if( cwtwc.cursorX == cwtwc.sw-4 && cwtwc.sx < cwtwc.mapWidth-1-cwtwc.sw ){
        cwtwc.betterMapShift(1,1);
      }
      else{
        cwtwc.cursorX++;
        if( cwtwc.cursorX >= cwtwc.sw ) cwtwc.cursorX = cwtwc.sw-1;
      }
      break;

    // DOWN
    case 40:
      this._rerenderCursorTiles();
      if( cwtwc.cursorY == cwtwc.sh-4 && cwtwc.sy < cwt.mapHeight-1-cwtwc.sh ){
        cwtwc.betterMapShift(2,1);
      }
      else{
        cwtwc.cursorY++;
        if( cwtwc.cursorY >= cwtwc.sh ) cwtwc.cursorY = cwtwc.sh-1;
      }
      break;

    // BACKSPACE
    case 8:
      cwtwc.back();
      break;

    // ENTER
    case 13:
      cwtwc.click( cwtwc.sx+ cwtwc.cursorX, cwtwc.sy+ cwtwc.cursorY );
      break;
  }
};

/**
 * Initializes the mouse events.
 *
 * @private
 */
cwtwc._initMouseEvents = function( appEl ){

  /* MOUSE MOVE */
  appEl.onmousemove = function (ev) {
    var x = parseInt( ev.pageX / cwtwc.tx, 10);
    var y = parseInt( ev.pageY / cwtwc.ty, 10);

    // check boundaries
    if (x < cwtwc.sw && y < cwtwc.sh) {

      if ( cwtwc.cursorX !== x || cwtwc.cursorY !== y) {

        // TODO: think about this, because cursor is dropped in m1
        cwtwc._rerenderCursorTiles();
        cwtwc.cursorX = x;
        cwtwc.cursorY = y;
      }
    }
  };

  // MOUSE BUTTON_HOLD, BUTTON_CLICK ETC. WILL BE DONE BY HAMMER.JS
};

/**
 * Initializes the touch events.
 *
 * @private
 */
cwtwc._initTouchEvents = function( appEl ){};
/**
 * Menu controller that holds and controls the menu system and content.
 */
cwtwc.menuController = StateMachine.create({

  initial: 'off',

  error: function(eventName, from, to, args, errorCode, errorMessage) {
    if( cwt.DEBUG ){
      cwt.info("illegal transition in menu at state '"+from+"' via event '"+eventName+"'");
    }

    return "";
  },

  events: [
    { name: 'init', from: 'off',        to: 'hidden' },
    { name: 'show', from: 'hidden',     to: 'visible' },
    { name: 'hide', from: 'visible',    to: 'hidden'  }
  ],

  callbacks: {

    oninit: function(){
      if( cwt.DEBUG ) cwt.info("initializing web client menu controller");

      var menuEl = document.getElementById( cwtwc.MENU_CONTAINER );

      cwtwc.menuController._menuEl = menuEl;
      cwtwc.menuController._menu = [];
    },

    onhide: function(){
      cwtwc.menuController._menu.splice(0);
      cwtwc.menuController._popup.close();
    },

    onenterhidden: function(){
      if( cwt.DEBUG ) cwt.info("menu: closed");
    },

    onshow: function( event, from, to, actionMap, x, y ){
      if( cwt.DEBUG ) cwt.info("menu: open");

      var menu = $('#menu');
      cwtwc.menuController._menu = actionMap;

      // get screen positions
      x = x - cwtwc.sx;
      y = y - cwtwc.sy;
      if( y > (cwtwc.sh/2) ) y = y - actionMap.length - 1 ;
      if( x > (cwtwc.sw/2) ) x = x - 6;

      // generate entries

      for( var i=0,e=9 ; i<=e; i++ ){ $('#menuEntry_'+i).hide(); }
      for( var i=0,e=actionMap.length ; i<e; i++ ){
        $('#menuEntry_'+i).show();
        $('#menuEntry_'+i).html(actionMap[i].k);
      }

      // make it visible
      cwtwc.menuController._popup = menu.bPopup({
        modalClose: false,
        position: [ x*32+16, y*32+15 ],
        opacity: 0.3,
        fadeSpeed: 500,
        positionStyle: 'fixed'
      });
    }
  }
});
cwtwc.plugins = {

  /**
   * @type Object<enable,disable>
   */
  _data: {},

  register: function( desc ){
    desc.enabled = false;
    cwtwc.plugins._data[ desc.id ] = desc;
  },

  enable: function( key ){
    var plugin = cwtwc.plugins._data[key];

    plugin.enable();
    plugin.enabled = true;

    if( cwt.DEBUG ) cwt.info("enabled {0} plugin", key);
  },

  disable: function( key ){
    var plugin = cwtwc.plugins._data[key];

    if( plugin.toggleable === false ) throw Error("plugin cannot be disabled!");

    plugin.disable();
    plugin.enabled = false;

    if( cwt.DEBUG ) cwt.info("disabled {0} plugin", key);
  },

  startAll: function(){
    var plugin;
    var keys = Object.keys( cwtwc.plugins._data );
    for( var i=0,e=keys.length; i<e; i++ ){
      plugin = cwtwc.plugins._data[ keys[i] ];
      if( plugin.enabled === false ){
        this.enable( keys[i] );
      }
    }
  }
};
/** 
 * Screen position on x axis.
 * 
 * @example read_only
 */
cwtwc.sx = 0;

/** 
 * Screen position on y axis. 
 * 
 * @example read_only
 */
cwtwc.sy = 0;

/**  
 * Screen width in tiles. 
 * 
 * @example read_only
 */
cwtwc.sw = 0;

/** 
 * Screen height in tiles. 
 * 
 * @example read_only
 */
cwtwc.sh = 0;

/** 
 * Screen movement on x axis. 
 * If this variable is lower zero, the screen will move left a bit
 * in every update step until it reaches zero. If the value is 
 * greater zero it will move right.
 */
cwtwc.msx = 0;

/** 
 * Screen movement on y axis. 
 * If this variable is lower zero, the screen will move up a bit
 * in every update step until it reaches zero. If the value is 
 * greater zero it will move down.
 */
cwtwc.msy = 0;

/** 
 * Indicates that the screen needs to be redrawn.
 * (in future the value will be true|false)
 */
cwtwc.drawChanges = 0;

/**
 * Shifts the screen in relationship to the screen movement 
 * variables.
 */
cwtwc.solveMapShift = function(){
  var dir = -1;

  if( cwtwc.msx !== 0 ){
    if( cwtwc.msx < 0 ){ dir = 3; cwtwc.msx++; }
    else               { dir = 1; cwtwc.msx--; }
  } else if( cwtwc.msy !== 0 ){
    if( cwtwc.msy < 0 ){ dir = 0; cwtwc.msy++; }
    else               { dir = 2; cwtwc.msy--; }
  }

  if( dir !== -1 ) cwtwc.mapShift( dir, 1 );
};

/**
 * New map shift method. This one uses the update step based screen
 * movement algorithm.
 */
cwtwc.betterMapShift = function( dir, len ){

       if( dir === 0 ) cwtwc.msy -= len;
  else if( dir === 1 ) cwtwc.msx += len;
  else if( dir === 2 ) cwtwc.msy += len;
  else if( dir === 3 ) cwtwc.msx -= len;
};

/**
 * Shifts the screen by a distance in a given direction. This 
 * function calculates the redraw map.
 */
cwtwc.mapShift = function( dir, dis ){
  if( dis === undefined ) dis = 1;

  var sx = cwtwc.sx;
  var sy = cwtwc.sy;

  // update screen meta data
  switch (dir) {
    case 0:
      cwtwc.sy -= dis;
      if( cwtwc.sy < 0 ){
        cwtwc.sy = 0;
      }
      break;

    case 1:
      cwtwc.sx += dis;
      if( cwtwc.sx >= cwt.mapWidth-cwtwc.sw ) cwtwc.sx = cwt.mapWidth-cwtwc.sw-1;
      if( cwtwc.sx < 0 ) cwtwc.sx = 0; // bugfix if map width is smaller than screen width
      break;

    case 2:
      cwtwc.sy += dis;
      if( cwtwc.sy >= cwt.mapHeight-cwtwc.sh ) cwtwc.sy = cwt.mapHeight-cwtwc.sh-1;
      if( cwtwc.sy < 0 ) cwtwc.sy = 0; // bugfix if map height is smaller than screen height
      break;

    case 3:
      cwtwc.sx -= dis;
      if( cwtwc.sx < 0 ) cwtwc.sx = 0;
      break;
  }

  cwtwc.drawChanges = 0;

  // rebuild redraw map
  var xe,ye;
  var map = cwt._map;
  var shiftX = cwtwc.sx - sx;
  var shiftY = cwtwc.sy - sy;

  ye = cwtwc.sy + cwtwc.sh -1;
  if( ye >= cwt.mapHeight ) ye = cwt.mapHeight-1;
  for(var y=cwtwc.sy; y<=ye; y++){

    xe = cwtwc.sx + cwtwc.sw -1;
    if( xe >= cwt.mapWidth ) xe = cwt.mapWidth-1;
    for(var x=cwtwc.sx; x<=xe; x++){
          
          // tile type is different
      if( map[x][y] !== map[x-shiftX][y-shiftY]
        ||
          (
            // unit was/is on screen tile
            cwt._unitPosMap[x][y] !== null ||
            cwt._unitPosMap[x-shiftX][y-shiftY] !== null
          )
        ||
          (
            // property was/is on screen tile
            cwt._propertyPosMap[x][y] !== null ||
            cwt._propertyPosMap[x-shiftX][y-shiftY] !== null
          )
        ||
          // new target cell overlaps
          cwtwc.imageTypeMap[ map[x][y] ] !== undefined &&
          cwtwc.imageTypeMap[ map[x][y] ][6] === 1
        ||
          // bottom cell below target overlaps
        ( y<ye && cwtwc.imageTypeMap[ map[x][y+1] ] !== undefined
               && cwtwc.imageTypeMap[ map[x][y+1] ][6] === 1 )
        ||
          // bottom cell below target overlaps
        ( y<ye && cwtwc.imageTypeMap[ map[x-shiftX][y-shiftY+1] ] !== undefined
               && cwtwc.imageTypeMap[ map[x-shiftX][y-shiftY+1] ][6] === 1 )
      ){

        cwtwc.drawnMap[x-cwtwc.sx][y-cwtwc.sy] = true;
        cwtwc.drawChanges = 1;
      }
      else cwtwc.drawnMap[x-cwtwc.sx][y-cwtwc.sy] = false;
    }
  }

};
cwtwc.plugins.register({

  id:"touchControls",

  availableInEnvironment: function(){
    // TODO
  },

  enable: function(){
    var appEl = document.getElementById( cwtwc.APP_CONTAINER );
    var hammer = new Hammer( appEl, { prevent_default: true });
    this.hammer = hammer;

    /* DRAG EVENT */
    hammer.ondragend = function(ev){

      // get direction
      var a = ev.angle;
      var d = 0;

      if( a >= -135 && a < -45  ) d = 0;
      else if( a >= -45  && a < 45   ) d = 1;
      else if( a >= 45   && a < 135  ) d = 2;
      else if( a >= 135  || a < -135 ) d = 3;

      // get distance
      var dis = parseInt( ev.distance/32, 10 );
      if( dis === 0 ) dis = 1;

      cwtwc.betterMapShift( d, dis );
    };

    /* TAP EVENT */
    hammer.ontap = function(ev) {
      var x = parseInt( ev.position[0].x/cwtwc.tx, 10 );
      var y = parseInt( ev.position[0].y/cwtwc.ty, 10 );

      if( cwtwc.cursorX !== x || cwtwc.cursorY !== y ){
        cwtwc._rerenderCursorTiles();
        cwtwc.cursorX = x;
        cwtwc.cursorY = y;
      }

      // convert screen to real position
      x = x+ cwtwc.sx;
      y = y+ cwtwc.sy;

      cwtwc.click( x, y );
    };

    /* HOLD TOUCH EVENT */
    hammer.onhold = function( ev ){
      var x = parseInt( ev.position[0].x/cwtwc.tx, 10 );
      var y = parseInt( ev.position[0].y/cwtwc.ty, 10 );

      cwtwc.back( x, y );
    };

    /* RELEASE TOUCH EVENT */
    hammer.onrelease = function(){
      // if( cwt.DEBUG ) cwt.log.error("feature is not implemented yet!");
    };
  },

  disable: function(){
    this.hammer.destroy();
    this.hammer = null;
  }

});
