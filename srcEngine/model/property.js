/**
 *
 */
model.properties = util.list( CWT_MAX_PROPERTIES+1, function(){
  return {
    capturePoints: 20,
    owner: -1
  }
});

/**
 *
 */
model.propertyPosMap = util.matrix(
  CWT_MAX_MAP_WIDTH,
  CWT_MAX_MAP_HEIGHT,
  null
);

/**
 *
 * @param x
 * @param y
 */
model.tileIsProperty = function( x,y ){
  var prop = model.propertyPosMap[x][y];
  return prop !== undefined;
};

/**
 * Extracts the identical number from a property object.
 *
 * @param unit
 */
model.extractPropertyId = function( property ){
  if( property === null ){
    throw Error("property argument cannot be null");
  }

  var props = model.properties;
  for( var i=0,e=props.length; i<e; i++ ){
    if( props[i] === property ) return i;
  }

  throw Error("cannot find property",property );
};

/**
 *
 * @param pid
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