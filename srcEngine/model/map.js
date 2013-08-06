// # Map Module
//

// ### Meta Data

controller.registerInvokableCommand("doInRange");

// ---

// ### Model

// Map table that holds all known tiles.
//
model.map = util.matrix( constants.MAX_MAP_WIDTH, constants.MAX_MAP_HEIGHT, null );

// Returns the current active map height.
//
model.mapHeight = -1;

// Returns the current active map width.
//
model.mapWidth = -1;

// Define persistence handler
controller.persistenceHandler(
  
  // load
  function( dom ){
    
    model.mapWidth = dom.mapWidth;
    model.mapHeight = dom.mapHeight;
    
    for( var x=0,xe=model.mapWidth; x<xe; x++ ){
      for( var y=0,ye=model.mapHeight; y<ye; y++ ){
        model.unitPosMap[x][y] = null;
        model.propertyPosMap[x][y] = null;
        model.map[x][y] = model.tileTypes[ data.typeMap[ data.map[x][y] ] ];
      }
    }
  },
  
  // save
  function( dom ){
  
    dom.mapWidth = model.mapWidth;
    dom.mapHeight = model.mapHeight;
    
    dom.map = [];
    var mostIdsMap = {};
    var mostIdsMapCurIndex = 0;
    for( var x=0,xe=model.mapWidth; x<xe; x++ ){
      
      dom.map[x] = [];
      for( var y=0,ye=model.mapHeight; y<ye; y++ ){
        
        var type = dom.map[x][y].ID;
        
        if( !mostIdsMap.hasOwnProperty(type) ){
          mostIdsMap[type] = mostIdsMapCurIndex;
          mostIdsMapCurIndex++;
        }
        
        dom.map[x][y] = mostIdsMap[type];
      }
    }
    
    dom.typeMap = [];
    var typeKeys = Object.keys( mostIdsMap );
    for( var i=0,e=typeKeys.length; i<e; i++ ){
      dom.typeMap[ mostIdsMap[typeKeys[i]] ] = typeKeys[i];
    }
  }
);


// Returns the distance of two positions.
// 
// @param {Number} sx x coordinate of the source position
// @param {Number} sy y coordinate of the source position
// @param {Number} tx x coordinate of the target position
// @param {Number} ty y coordinate of the target position
//
model.distance = function( sx,sy,tx,ty ){
  var dx = Math.abs(sx-tx);
  var dy = Math.abs(sy-ty);
  return dx+dy;
};

// Returns true if the given position (x,y) is valid on the current active map, else false.
// 
// @param {Number} x
// @param {Number} y
//
model.isValidPosition = function( x,y ){
  return ( 
    x >= 0 && 
    y >= 0 && 
    x < model.mapWidth && 
    y < model.mapHeight 
  );
};

// Invokes a callback on all tiles in a given 
// range at a position (x,y)
//
// @param {Number} x x coordinate
// @param {Number} y y coordinate
// @param {Number} range range of the search field
// @param {Function} cb callback function
// @param {Any} arg argument that will be passed into the callback call
//
model.doInRange = function( x,y, range, cb, arg ){
  
  var lX;
  var hX;
  var lY = y-range;
  var hY = y+range;
  if( lY < 0 ) lY = 0;
  if( hY >= model.mapHeight ) hY = model.mapHeight-1;
  for( ; lY<=hY; lY++ ){
    
    var disY = Math.abs( lY-y );
    lX = x-range+disY;
    hX = x+range-disY;
    if( lX < 0 ) lX = 0;
    if( hX >= model.mapWidth ) hX = model.mapWidth-1;
    for( ; lX<=hX; lX++ ){
      
      // invoke the callback on all 
      // tiles in range
      cb( lX,lY, arg, Math.abs(lX-x)+disY );
      
    }
  }
};