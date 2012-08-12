// screen shift in tile positions
cwt.client.sx = 0;
cwt.client.sy = 0;

// screen metrics in tiles
cwt.client.sw = 0;
cwt.client.sh = 0;

// shift commands
cwt.client.msx = 0;
cwt.client.msy = 0;

cwt.client.drawChanges = 0;

cwt.client.solveMapShift = function(){
  var dir = -1;

  if( this.msx !== 0 ){
    if( this.msx < 0 ){ dir = 3; this.msx++; }
    else              { dir = 1; this.msx--; }
  } else if( this.msy !== 0 ){
    if( this.msy < 0 ){ dir = 0; this.msy++; }
    else              { dir = 2; this.msy--; }
  }

  if( dir !== -1 ) this.mapShift( dir, 1 );
};

cwt.client.betterMapShift = function( dir, len ){

       if( dir === 0 ) this.msy -= len;
  else if( dir === 1 ) this.msx += len;
  else if( dir === 2 ) this.msy += len;
  else if( dir === 3 ) this.msx -= len;
};

cwt.client.mapShift = function( dir, dis ){
  if( dis === undefined ) dis = 1;

  var sx = this.sx;
  var sy = this.sy;

  switch (dir) {
    case 0:
      this.sy -= dis;
      if( this.sy < 0 ){
        this.sy = 0;
      }
      break;

    case 1:
      this.sx += dis;
      if( this.sx >= cwt.model._width-this.sw ) this.sx = cwt.model._width-this.sw-1;
      if( this.sx < 0 ) this.sx = 0; // bugfix if map width is smaller than screen width
      break;

    case 2:
      this.sy += dis;
      if( this.sy >= cwt.model._height-this.sh ) this.sy = cwt.model._height-this.sh-1;
      if( this.sy < 0 ) this.sy = 0; // bugfix if map height is smaller than screen height
      break;

    case 3:
      this.sx -= dis;
      if( this.sx < 0 ) this.sx = 0;
      break;
  }

  this.drawChanges = 0;

  // rebuild draw map
  var xe,ye;
  var map = cwt.model._map;
  var shiftX = this.sx - sx;
  var shiftY = this.sy - sy;

  ye = this.sy+this.sh-1;
  if( ye >= cwt.model._height ) ye = cwt.model._height-1;
  for(var y=this.sy; y<=ye; y++){

    xe = this.sx+this.sw-1;
    if( xe >= cwt.model._width ) xe = cwt.model._width-1;
    for(var x=this.sx; x<=xe; x++){

      if( map[x][y] !== map[x-shiftX][y-shiftY]
        ||
          (
            cwt.model._unitPosMap[x][y] !== null ||
            cwt.model._unitPosMap[x-shiftX][y-shiftY] !== null
          )
        ||
          this.imageTypeMap[ map[x][y] ] !== undefined &&
          this.imageTypeMap[ map[x][y] ][6] === 1
        ||
        ( y<ye && this.imageTypeMap[ map[x][y+1] ] !== undefined
               && this.imageTypeMap[ map[x][y+1] ][6] === 1 )
        ||
        ( y<ye && this.imageTypeMap[ map[x-shiftX][y-shiftY+1] ] !== undefined
               && this.imageTypeMap[ map[x-shiftX][y-shiftY+1] ][6] === 1 )
      ){

        this.drawnMap[x-this.sx][y-this.sy] = true;
        this.drawChanges++;
      }
      else this.drawnMap[x-this.sx][y-this.sy] = false;

    }
  }

};