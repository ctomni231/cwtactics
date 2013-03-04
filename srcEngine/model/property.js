/**
 * List of all available properties of a game round. If a property is not 
 * used it will be marked with an owner value {@link CWT_INACTIVE_ID}.
 */
model.properties = util.list( CWT_MAX_PROPERTIES+1, function(){
  return {
    capturePoints: 20,
    owner: -1,
    type: null
  };
});

/**
 * Matrix that has the same metrics as the game map. Every property will be 
 * placed in the cell that represents its position. A property will be 
 * accessed by model.propertyPosMap[x][y].
 */
model.propertyPosMap = util.matrix(
  CWT_MAX_MAP_WIDTH,
  CWT_MAX_MAP_HEIGHT,
  null
);

/**
 * Returns true if the tile at position x,y is a property, else false.
 * 
 * @param {Number} x x coordinate
 * @param {Number} y y coordinate
 */
model.tileIsProperty = function( x,y ){
  var prop = model.propertyPosMap[x][y];
  return prop !== null;
};

/**
 * Extracts the identical number from a property object.
 *
 * @param property
 */
model.extractPropertyId = function( property ){
  if( property === null ){
    util.raiseError("property argument cannot be null");
  }

  var props = model.properties;
  for( var i=0,e=props.length; i<e; i++ ){
    if( props[i] === property ) return i;
  }

  util.raiseError("cannot find property",property );
};

/**
 * Counts all properties owned by the player with the given player id.
 *
 * @param {Number} pid player id
 */
model.countProperties = function( pid ){

  var n = 0;
  var props = model.properties;
  for( var i=0,e=props.length; i<e; i++ ){
    if( props[i].owner === pid ){
      n++;
    }
  }

  return n;
};