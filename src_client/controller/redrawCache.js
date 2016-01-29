// Indicates that the view needs to be redrawn.
// (in future the value will be true|false)
//
view.redraw_dataChanges = 0;

// 
//
view.redraw_data = util.matrix( MAX_MAP_WIDTH, MAX_MAP_HEIGHT, false );

// 
//
view.redraw_MODE = {
  RECTANGLE : 0,
  CIRCLE    : 1
};

// 
// 
view.redraw_markPos = function( x,y, sizeX, sizeY, redrawMode ){

  // prepare size parameters
  if( typeof sizeX !== "number" ) sizeX = 0; else sizeX--;
  if( typeof sizeY !== "number" ) sizeY = 0; else sizeY--;
  if( typeof redrawMode === "undefined" ) redrawMode = view.redraw_MODE.RECTANGLE;

  var isCircleMode = (redrawMode === view.redraw_MODE.CIRCLE);

  var ox = x;
  var oy = y;
  if( isCircleMode ){
    x -= sizeX;
    y -= sizeY;
  }

  var xe = Math.min(x+sizeX, model.map_width -1);
  var ye = Math.min(y+sizeY, model.map_height-1);

  for( ; x<=xe; x++ ){
    y = oy;
    while( true ){

      // break when the current position is illegal
      if( x < 0 || y < 0 || x >= model.map_width || y >= model.map_height ) break;

      // skip if this tile was already checked
      if( view.redraw_data[x][y] ){
        y++;
        if( y <= ye ) continue;
        else          break;
      }

      if( !isCircleMode || (Math.abs(x-ox)+Math.abs(y-oy) <= sizeX) ){
        
        // mark tile for rerendering
        view.redraw_data[x][y] = true;
        view.redraw_dataChanges++;
      }

      // check special properties
      if( model.property_posMap[x][y] && model.property_posMap[x][y].type.ID === "PROP_INV" ){
        if( x === xe ){
          xe++;
          if( y > ye ) ye = y;
        } 
      }
    
      y++;

      // break when you go out of bounds
      if( y === model.map_height ) break;

      // continue when the bottom neighbour is a property
      if( model.property_posMap[x][y] !== null ){
        continue;
      }

      // continue when you still in the redraw rectangle
      if( y <= ye ) continue;

      // continue when the bottom neighbour is a overlapping tile
      if( view.overlayImages[ view.mapImages[x][y] ] === true ) continue;

      break;
    }
  }
};

// Invokes a complete redraw of the view.
//
view.redraw_markAll = function(){
  view.redraw_dataChanges = 1;
  for(var x=0,xe=model.map_width; x<xe; x++){
    for(var y=0,ye=model.map_height; y<ye; y++){
      view.redraw_data[x][y] = true;
    }
  }
};

// 
// 
view.redraw_markSelection = function( scope ){
  var cx = scope.selection.centerX;
  var cy = scope.selection.centerY;
  var data = scope.selection.data;

  view.redraw_markPos(cx,cy,data.length,data.length,view.redraw_MODE.RECTANGLE);
};

// Rerenders a tile and all 4 neightbours in a plus around it.
// 
//  @example
//    x
//  x o x
//    x
// 
view.redraw_markPosWithNeighbours = function( x,y ){
  view.redraw_markPos(x,y,2,0,view.redraw_MODE.CIRCLE);
};

// Rerenders a tile and all 8 neightbours around it.
// 
// @example
//  x x x
//  x o x
//  x x x
//  
view.redraw_markPosWithNeighboursRing = function( x,y ){
  view.redraw_markPos(x-1,y-1,3,3,view.redraw_MODE.RECTANGLE);
};