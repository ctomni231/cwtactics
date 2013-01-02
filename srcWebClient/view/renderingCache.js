/**
 * SOME TILES THAT ARE KNOWN AS OVERLAYERS --> TODO this should be
 * set able via configs ( custom graphics )
 */
view.OVERLAYER = {
  MNTN:true,
  FRST:true
};

/**
 * Indicates that the view needs to be redrawn.
 * (in future the value will be true|false)
 */
view.drawScreenChanges = 0;

/**
 *
 */
view.drawScreen = util.matrix( CWT_MAX_MAP_WIDTH, CWT_MAX_MAP_HEIGHT, false );

/**
 * Marks a position for re-rendering.
 *
 * @param x
 * @param y
 */
view.markForRedraw = function( x,y ){
  if( x >= 0 && y >= 0 && x < model.mapWidth && y < model.mapHeight ){

    if( view.drawScreen[x][y] === true ) return;

    view.drawScreen[x][y] = true;
    view.drawScreenChanges++;

    // check bottom tile
    y++;
    if( y < model.mapHeight ){
      if( model.propertyPosMap[x][y] !== null ) view.markForRedraw(x,y);
      else if( view.OVERLAYER[model.map[x][y]] === true ){
        view.markForRedraw(x,y);
      }
    }
  }
  else util.logError("illegal arguments ",x,",",y," -> out of view bounds");
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
view.markForRedrawRange = function( x,y,r ){

  var lX;
  var hX;
  var lY = y-r;
  var hY = y+r;
  if( lY < 0 ) lY = 0;
  if( hY >= model.mapHeight ) hY = model.mapHeight-1;
  for( ; lY<=hY; lY++ ){

    var disY = Math.abs( lY-y );
    lX = x-r+disY;
    hX = x+r-disY;
    if( lX < 0 ) lX = 0;
    if( hX >= model.mapWidth ) hX = model.mapWidth-1;
    for( ; lX<=hX; lX++ ){

      view.markForRedraw(lX,lY);
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
view.markForRedrawWithNeighbours = function( x,y ){

  if( y>0 ) view.markForRedraw(x,y-1);
  if( x>0 ) view.markForRedraw(x-1,y);
            view.markForRedraw(x,y);
  if( y< model.mapHeight-1 ) view.markForRedraw(x,y+1);
  if( x< model.mapWidth-1 )  view.markForRedraw(x+1,y);
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
view.markForRedrawWithNeighboursRing = function( x,y ){
  var gW = model.mapWidth;
  var gH = model.mapHeight;

  // LEFT COLUMN
  if( x>0 ){
    if( y>0 )     view.markForRedraw(x-1,y-1);
    view.markForRedraw(x-1,y);
    if( y< gH-1 ) view.markForRedraw(x-1,y+1);
  }

  // MIDDLE COLUMN
  if( y>0 )       view.markForRedraw(x,y-1);
  view.markForRedraw(x,y);
  if( y< gH-1 )   view.markForRedraw(x,y+1);

  // RIGHT COLUMN
  if( x< gW-1 ){
    if( y>0 )     view.markForRedraw(x+1,y-1);
    view.markForRedraw(x+1,y);
    if( y< gH-1 ) view.markForRedraw(x+1,y+1);
  }
};

/**
 * Invokes a complete redraw of the view.
 */
view.completeRedraw = function(){

  view.drawScreenChanges = 1;
  for(var x=0,xe=model.mapWidth; x<xe; x++){
    for(var y=0,ye=model.mapHeight; y<ye; y++){
      view.drawScreen[x][y] = true;
    }
  }
};

view.markSelectionMapForRedraw = function( selectionMap ){
  var cx = selectionMap.getCenterX();
  var cy = selectionMap.getCenterY();
  var data = selectionMap.getDataMatrix();

  for( var x=0;x<data.length; x++ ){
    var sMap = data[x];
    for( var y=0;y<sMap.length; y++ ){
      if( sMap[y] !== -1 ) view.markForRedraw( cx+x, cy+y );
    }
  }
};