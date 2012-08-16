/**
 * Canvas context.
 */
cwt.client.ctx_map = null;

cwt.client.ctx_map_buffer = null;
cwt.client.map_buffer = null;

cwt.client.tx = 32;
cwt.client.ty = 32;

cwt.client.cursorX = 0;
cwt.client.cursorY = 0;

cwt.client.drawnMap = [];

cwt.client.cAnimTime = 0;
cwt.client.cAnimStep = 0;

/**
 * Time in ms to trigger next picture of the animation.
 *
 * @constant
 */
cwt.client.DURATION_ANIM_STEP = 250;

/**
 * Invokes a complete redraw of the screen.
 */
cwt.client.completeRedraw = function(){
  this.drawChanges = 1;
  for(var x=0; x< this.sw; x++){
    for(var y=0; y< this.sh; y++){

      this.drawnMap[x][y] = true;
    }
  }
};

/**
 * @private
 */
cwt.client._initCanvasElement = function(){
  var canvEl = document.getElementById( cwt.client.CANVAS_CONTAINER );

  this.ctx_map = canvEl.getContext("2d");
  this.sw = parseInt( canvEl.width / this.tx , 10 );
  this.sh = parseInt( canvEl.height / this.ty , 10 );

  for( var i=0; i<this.sw; i++ ) this.drawnMap[i] = [];

  var canvas = document.createElement("canvas");
  var canvasContext = canvas.getContext("2d");

  canvas.width = canvEl.width;
  canvas.height = canvEl.height;

  this.ctx_map_buffer = canvasContext;
  this.map_buffer = canvas;
};

/**
 * This calculates the the tile that needs to be redrawn to
 * draw animations correctly.
 *
 * @param time delta time since the last call of this function
 */
cwt.client.triggerAnimation = function( time ){

  this.cAnimTime += time;
  if( this.cAnimTime >= this.DURATION_ANIM_STEP ){

    this.cAnimTime = 0;
    
    /*
    this.cAnimStep++;
    if( this.cAnimStep === 3 ) this.cAnimStep= 0;
    */
    
    // increase animations
    var keys = Object.keys( cwt.client.imageTypeMap );
    for( var i=0,e=keys.length ; i<e; i++ ){
      var type = cwt.client.imageTypeMap[ keys[i] ];

      type[7]++;
      if( type[7] >= type[3] ) type[7] = 0;
    }

    this.drawChanges = 0;

    // rebuild draw map
    var xe,ye;
    var map = cwt.model._map;

    ye = cwt.client.sy+cwt.client.sh-1;
    if( ye >= cwt.model._height ) ye = cwt.model._height-1;
    for(var y=cwt.client.sy; y<=ye; y++){

      xe = cwt.client.sx+cwt.client.sw-1;
      if( xe >= cwt.model._width ) xe = cwt.model._width-1;
      for(var x=cwt.client.sx; x<=xe; x++){

        var unit = cwt.model.unitByPos(x,y);
        var property = cwt.model.propertyByPos(x,y);
        if(
          unit !== null ||
          property !== null
            || cwt.client.focusTiles[x][y] === true
            || (
              ( x-this.sx-1 === this.cursorX ||
                x-this.sx === this.cursorX   ||
                x-this.sx+1 === this.cursorX    ) &&
              ( y-this.sy-1 === this.cursorY ||
                y-this.sy === this.cursorY   ||
                y-this.sy+1 === this.cursorY    )
            )
            ||
            (
              y>0 &&
                (
                  cwt.model._unitPosMap[x][y-1] !== null ||
                    cwt.client.drawnMap[x-cwt.client.sx][y-cwt.client.sy-1]
                  )
              )
          ){

          if( y > 0 && property !== null && cwt.client.imageTypeMap[ property.type ][6] ){
            cwt.client.drawnMap[x-cwt.client.sx][y-cwt.client.sy-1] = true;
            cwt.client.drawChanges++;
          }

          cwt.client.drawnMap[x-cwt.client.sx][y-cwt.client.sy] = true;
          cwt.client.drawChanges++;
        }
        else cwt.client.drawnMap[x-cwt.client.sx][y-cwt.client.sy] = false;
      }
    }
  }
};

/**
 * Draws the changes on the screen. This algorithm draws only the delta changes from the last drawing
 * step. Furthermore this function recognizes overlapping objects.
 *
 * @param animStep
 */
cwt.client.drawScreen = function(){

  var xe,ye;
  var pix;
  var canvas = this.ctx_map;
  var tp;
  var tx = this.tx;
  var ty = this.ty;
  var map = cwt.model._map;
  var imgTMap = cwt.client.imageTypeMap;
  var imgLMap = cwt.client.imageListMap;
  var selimgL;

  // iterate by row
  ye = this.sy+this.sh-1;
  if( ye >= cwt.model._height ) ye = cwt.model._height-1;
  for(var y=this.sy; y<=ye; y++){

    // iterate by column
    xe = this.sx+this.sw-1;
    if( xe >= cwt.model._width ) xe = cwt.model._width-1;
    for(var x=this.sx; x<=xe; x++){

      // draw only if the type is not drawn on that position
      if( this.drawnMap[x-this.sx][y-this.sy] === true ){

        tp= map[x][y];
        pix = imgTMap[ tp ];
        selimgL = imgLMap.GREEN;
        if( pix !== undefined ){

          // draw tile
          canvas.drawImage(
            selimgL[ pix[0] ],
            pix[4], pix[5],
            pix[1], pix[2],
            (x-this.sx)*tx, (y-this.sy)*ty - ty,
            tx, ty + ty
          );

          // draw property above tile
          var property = cwt.model.propertyByPos(x,y);
          if( property !== null ){

            var pix = imgTMap[ property.type ];
            selimgL = imgLMap.GREEN;
            if( property.owner !== 0 ) selimgL = imgLMap.RED;

            if( pix !== undefined ){
              canvas.drawImage(
                selimgL[ pix[0] ],
                pix[4] + ( pix[7]*pix[1]), pix[5],
                pix[1], pix[2],
                (x-this.sx)*tx, (y-this.sy)*ty - ty,
                tx, ty + ty
              );
            }
            else{
              canvas.fillStyle="rgb(0,255,0)";
              canvas.fillRect( (x-this.sx)*tx+4, (y-this.sy)*ty+4, tx-8, ty-8 );
            }
          }
          
          if( cwt.client.focusTiles[x][y] === true ){
            // canvas.globalAlpha = 0.5;
            pix = imgTMap[ "MOVE_CURSOR" ];
            canvas.drawImage(
              selimgL[ pix[0] ],
              pix[4] + ( pix[7]*pix[1] ), pix[5],
              pix[1], pix[2],
              (x-this.sx)*tx, (y-this.sy)*ty,
              tx, ty
            );
            // canvas.globalAlpha = 1;
          }

          // draw unit above tile
          var unit = cwt.model._unitPosMap[x][y];
          if( unit !== null ){

            var pix = imgTMap[ unit.type ];
            selimgL = imgLMap.GREEN;
            if( unit.owner !== 0 ) selimgL = imgLMap.RED;

            var scrX = (x-this.sx)*tx -16;
            var scrY = (y-this.sy)*ty -16;

            if( pix !== undefined ){
              canvas.drawImage(
                selimgL[ pix[0] ],
                pix[4] + ( pix[7]*pix[1]), pix[5],
                pix[1], pix[2],
                scrX, scrY,
                64, 64
              );
            }
            else{
              canvas.fillStyle="rgb(255,0,0)";
              canvas.fillRect( (x-this.sx)*tx+4, (y-this.sy)*ty+4, tx-8, ty-8 );
            }
          }
        }
        else{

          canvas.fillStyle="rgb(0,0,255)";
          canvas.fillRect( (x-this.sx)*tx, (y-this.sy)*ty, tx, ty );

          // draw property above tile
          var property = cwt.model.propertyByPos(x,y);
          if( property !== null ){

            var pix = imgTMap[ property.type ];
            selimgL = imgLMap.GREEN;
            if( property.owner !== 0 ) selimgL = imgLMap.RED;

            if( pix !== undefined ){
              canvas.drawImage(
                selimgL[ pix[0] ],
                pix[4] + ( pix[7]*pix[1]), pix[5],
                pix[1], pix[2],
                (x-this.sx)*tx, (y-this.sy)*ty - ty,
                tx, ty + ty
              );
            }
            else{
              canvas.fillStyle="rgb(0,255,0)";
              canvas.fillRect( (x-this.sx)*tx+4, (y-this.sy)*ty+4, tx-8, ty-8 );
            }
          }
          
          if( cwt.client.focusTiles[x][y] === true ){
            // canvas.globalAlpha = 0.5;
            pix = imgTMap[ "MOVE_CURSOR" ];
            canvas.drawImage(
              selimgL[ pix[0] ],
              pix[4] + ( pix[7]*pix[1] ), pix[5],
              pix[1], pix[2],
              (x-this.sx)*tx, (y-this.sy)*ty,
              tx, ty
            );
            // canvas.globalAlpha = 1;
          }

          // draw unit above tile
          var unit = cwt.model._unitPosMap[x][y];
          if( unit !== null ){

            var pix = imgTMap[ unit.type ];
            selimgL = imgLMap.GREEN;
            if( unit.owner !== 0 ) selimgL = imgLMap.RED;

            var scrX = (x-this.sx)*tx -16;
            var scrY = (y-this.sy)*ty -16;

            if( pix !== undefined ){
              canvas.drawImage(
                selimgL[ pix[0] ],
                pix[4] + ( pix[7]*pix[1]), pix[5],
                pix[1], pix[2],
                scrX, scrY,
                64, 64
              );
            }
            else{
              canvas.fillStyle="rgb(255,0,0)";
              canvas.fillRect( (x-this.sx)*tx+4, (y-this.sy)*ty+4, tx-8, ty-8 );
            }
          }
        }

        // set new drawn type
        this.drawnMap[x-this.sx][y-this.sy] = false;
      }
    }
  }

  var pix = imgTMap[ "CURSOR" ];
  selimgL = imgLMap.GREEN;
  canvas.drawImage(
    selimgL[ pix[0] ],
    pix[4] + ( pix[7]*pix[1] ), pix[5],
    pix[1], pix[2],
    this.cursorX*32 -10, this.cursorY*32 -10,
    64, 64
  );

  // clear counter
  this.drawChanges = 0;

  // this.ctx_map.drawImage( this.map_buffer, 0, 0 );
};