var cwtwc = {

  ctx_map: null,

  // still todo ( --> should be loaded via mod )
  terrain: new Image(),
  terrainMap: {
    "PLAIN": [0,0,0], // x,y and overlapping
    "FOREST": [32,0,1],
    "MOUNTAIN": [64,0,1]
  },

  imgMap: {},

  registerImage: function( key, img, w, h, tiles, sx, sy, overlay ){
    this.imgMap[ key ] = [ img, w, h, tiles, sx, sy, overlay ];
  },

  drawnMap: [],
  drawChanges: 0,

  tx: 32,
  ty: 32,

  animStep: 0,

  sx:0,
  sy:0,

  sw: 0,
  sh: 0,

  initialize: function(){
    cwtwc.ctx_map = document.getElementById("cwt_maplayer").getContext("2d");

    // get size
    cwtwc.sw = parseInt( document.getElementById("cwt_maplayer").width / cwtwc.tx , 10 );
    cwtwc.sh = parseInt( document.getElementById("cwt_maplayer").height / cwtwc.ty , 10 );

    for( var i=0; i<cwtwc.sw; i++ ) cwtwc.drawnMap[i] = [];
    for(var x=0; x<cwtwc.sw; x++){
      for(var y=0; y<cwtwc.sh; y++){ cwtwc.drawnMap[x][y] = true; }}

    //cwtwc.terrain.crossOrigin = '';
    //cwtwc.terrain.src = "img/terrains.png";
    cwtwc.terrain.src = "data:image/png;base64,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";
  },

  drawScreen: function(){
    console.log("DRAW");

    var xe,ye;
    var pix;
    var tp;
    var tx = cwtwc.tx;
    var ty = cwtwc.ty;
    var map = cwt.map._map;
    ye = cwtwc.sy+cwtwc.sh-1;
    if( ye >= cwt.map._height ) ye = cwt.map._height-1;
    for(var y=cwtwc.sy; y<=ye; y++){

      xe = cwtwc.sx+cwtwc.sw-1;
      if( xe >= cwt.map._width ) xe = cwt.map._width-1;
      for(var x=cwtwc.sx; x<=xe; x++){

        tp= map[x][y];
        pix = cwtwc.terrainMap[ tp ];

        // draw only if the type is not drawn on that position
        if(
          cwtwc.drawnMap[x-cwtwc.sx][y-cwtwc.sy] === true
        /*if( cwtwc.drawnMap[x-cwtwc.sx][y-cwtwc.sy] !== tp ||
            pix[2] === 1   ||
            ( y<ye && cwtwc.terrainMap[ cwtwc.drawnMap[x-cwtwc.sx][y-cwtwc.sy+1] ][2] === 1 )*/
        ){

          if( pix !== undefined ){
            cwtwc.ctx_map.drawImage(
              cwtwc.terrain,
              pix[0], pix[1],
              32,64,
              (x-cwtwc.sx)*tx, (y-cwtwc.sy)*ty - ty,
              tx, ty + ty
            );
          }
          else{
            cwtwc.ctx_map.fillStyle="rgb(0,0,255)";
            cwtwc.ctx_map.fillRect( (x-cwtwc.sx)*tx, (y-cwtwc.sy)*ty, tx, ty );
          }

          var unit = cwt.model.unitByPos(x,y);
          if( unit !== null ){
            if( cwtwc.imgMap[type] !== undefined ){

              var imgM = cwtwc.imgMap[type];
              cwtwc.ctx_map.drawImage(
                imgM[0],
                imgM[4] + (this.aStep*imgM[1]), imgM[5],
                imgM[1], imgM[2],
                (x-cwtwc.sx)*tx -16, (y-cwtwc.sy)*ty - 16,
                64, 64
              );
            }
            else{
              cwtwc.ctx_map.fillStyle="rgb(255,0,0)";
              cwtwc.ctx_map.fillRect( (x-cwtwc.sx)*tx+4, (y-cwtwc.sy)*ty+4, tx-8, ty-8 );
            }
            var type = unit.type;
          }

          // set new drawn type
          cwtwc.drawnMap[x-cwtwc.sx][y-cwtwc.sy] = false;
        }
      }
    }

    // clear counter
    cwt.drawChanges = 0;
  },

  mapShift: function( dir, dis ){
    if( dis === undefined ) dis = 1;

    var sx = cwtwc.sx,
        sy = cwtwc.sy;

    switch (dir) {
      case 0:
        cwtwc.sy -= dis;
        if( cwtwc.sy < 0 ) cwtwc.sy = 0;
        break;

      case 1:
        cwtwc.sx += dis;
        if( cwtwc.sx >= cwt.map._width-cwtwc.sw ) cwtwc.sx = cwt.map._width-cwtwc.sw-1;
        if( cwtwc.sx < 0 ) cwtwc.sx = 0; // bugfix if map width is smaller than screen width
        break;

      case 2:
        cwtwc.sy += dis;
        if( cwtwc.sy >= cwt.map._height-cwtwc.sh ) cwtwc.sy = cwt.map._height-cwtwc.sh-1;
        if( cwtwc.sy < 0 ) cwtwc.sy = 0; // bugfix if map height is smaller than screen height
        break;

      case 3:
        cwtwc.sx -= dis;
        if( cwtwc.sx < 0 ) cwtwc.sx = 0;
        break;
    }

    cwt.drawChanges = 0;

    // rebuild draw map
    var xe,ye;
    var map = cwt.map._map;
    var shiftX = cwtwc.sx - sx;
    var shiftY = cwtwc.sy - sy;

    ye = cwtwc.sy+cwtwc.sh-1;
    if( ye >= cwt.map._height ) ye = cwt.map._height-1;
    for(var y=cwtwc.sy; y<=ye; y++){

      xe = cwtwc.sx+cwtwc.sw-1;
      if( xe >= cwt.map._width ) xe = cwt.map._width-1;
      for(var x=cwtwc.sx; x<=xe; x++){

        if( map[x][y] !== map[x-shiftX][y-shiftY] ||
            (
              cwt.model.unitByPos(x,y) !== null ||
              cwt.model.unitByPos(x-shiftX,y-shiftY) !== null
            ) ||
            (
              cwtwc.terrainMap[ map[x][y] ] !== undefined &&
              cwtwc.terrainMap[ map[x][y] ][2] === 1
            ) || (
              y<ye && cwtwc.terrainMap[ map[x][y+1] ] !== undefined
                   && cwtwc.terrainMap[ map[x][y+1] ][2] === 1
            ) || (
              y<ye && cwtwc.terrainMap[ map[x-shiftX][y-shiftY+1] ] !== undefined
                   && cwtwc.terrainMap[ map[x-shiftX][y-shiftY+1] ][2] === 1
            )
          ){
          cwtwc.drawnMap[x-cwtwc.sx][y-cwtwc.sy] = true;
          cwt.drawChanges++;
        }
        else cwtwc.drawnMap[x-cwtwc.sx][y-cwtwc.sy] = false;
      }
    }
    // END OF - rebuild draw map
  },

  aTime: 0,
  aStep: 1,
  aTimePerStep: 250,

  triggerAnimation: function( time ){
    this.aTime += time;
    if( this.aTime >= this.aTimePerStep ){

      // TODO --> iterate over the unit ids idiot!!! XD
      this.aTime = 0;
      this.aStep++;
      if( this.aStep === 3 ) this.aStep= 0;

      cwt.drawChanges = 0;
      // rebuild draw map
      var xe,ye;
      var map = cwt.map._map;

      ye = cwtwc.sy+cwtwc.sh-1;
      if( ye >= cwt.map._height ) ye = cwt.map._height-1;
      for(var y=cwtwc.sy; y<=ye; y++){

        xe = cwtwc.sx+cwtwc.sw-1;
        if( xe >= cwt.map._width ) xe = cwt.map._width-1;
        for(var x=cwtwc.sx; x<=xe; x++){

          var unit = cwt.model.unitByPos(x,y);
          if(
            unit !== null ||
            ( y>0 && cwt.model.unitByPos(x,y-1) !== null )

            // TODO recognize if overlapping tiles are in a column
          ){

            if( cwt.DEBUG ) console.log("redrawing tile ("+x+","+y+")cause of an unit");
            cwtwc.drawnMap[x-cwtwc.sx][y-cwtwc.sy] = true;
            cwt.drawChanges++;
          }
          else cwtwc.drawnMap[x-cwtwc.sx][y-cwtwc.sy] = false;
        }
      }
      // END OF - rebuild draw map
    }
  },

  doStep: function(){

    // evaluate next command
    if( !cwt.message.isEmpty() ){ cwt.message.evalNext(); }

    // update screen
    if( cwt.drawChanges > 0 ) this.drawScreen();

    // calculate time and wait the delta
    // TODO
  }

};