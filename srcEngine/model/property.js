controller.defineGameScriptable( "captureRate", 50, 9999 );
controller.defineGameScriptable( "funds", 1, 99999 );

// configs
controller.defineGameConfig( "captureLimit", 0, MAX_PROPERTIES, 0 );

// List of all available properties of a game round. If a property is not used it will be
// marked with an owner value {@link CWT_INACTIVE_ID}.
//
model.property_data = util.list( MAX_PROPERTIES + 1, function(){
  return {
    capturePoints: 20,
    owner: -1,
    x: 0,
    y: 0,
    type: null
  };
} );

// Holds all properties by their position.
//
model.property_posMap = util.matrix( MAX_MAP_WIDTH, MAX_MAP_HEIGHT, null );

// Returns true when the given property id is valid.
//
model.property_isValidPropId = function( prid ){
  return typeof prid === "number" && prid >= 0 && prid < MAX_PROPERTIES;
};

// Returns true if there is an unit with a given relationship on a tile at a given position (x,y).
//
model.property_thereIsAProperty = function( x,y,pid,mode ){
  assert( model.map_isValidPosition(x,y) );
  assert( model.player_isValidPid(pid) );

  var property = model.property_posMap[x][y];
  return property !== null && model.player_getRelationship(pid,property.owner) === mode;
};

// Returns a property object by its position or null.
//
model.property_getByPos = function( x, y ){
  assert( model.map_isValidPosition(x,y) );

  return model.property_posMap[x][y];
};

// Returns true if the tile at position x,y is a property, else false.
//
model.property_isPropertyAtTile = function( x, y ){
  assert( model.map_isValidPosition(x,y) );

  return model.property_getByPos( x, y ) !== null;
};

// Extracts the identical number from a property object.
//
model.property_extractId = function( property ){
  var index = model.property_data.indexOf( property );

  // check result index when -1 then the property object does not exists
  assert( index !== -1 );

  return index;
};

// Counts all properties owned by the player with the given player id.
//
model.property_countProperties = function( pid ){
  assert( model.player_isValidPid(pid) );

  var n = 0;

  var props = model.property_data;
  for( var i = 0, e = props.length; i < e; i++ ) {

    // count all properties that belongs to the selected pid
    if( props[i].owner === pid ) n++;
  }

  return n;
};

// Returns true if the property can be captured by the unit, else ( no capturable and/or
// no capturing unit ) false.
//
model.property_isCapturableBy = function( prid, captId ){
  assert( model.property_isValidPropId(prid) );
  assert( model.unit_isValidUnitId(captId) );

  return model.property_data[prid].type.capturePoints > 0 &&
          model.unit_data[captId].type.captures > 0;
};
