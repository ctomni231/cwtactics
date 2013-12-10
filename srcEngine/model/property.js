// commands
controller.action_registerCommands( "property_changeType" );
controller.action_registerCommands( "property_resetCapturePoints" );
controller.action_registerCommands( "property_capture" );

// events
controller.event_define( "property_changeType" );
controller.event_define( "property_resetCapturePoints" );
controller.event_define( "property_capture" );

// scriptables
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

// 
//
model.property_createProperty = function( pid, x, y, type ){

  var props = model.property_data;
  for( var i = 0, e = props.length; i < e; i++ ) {

    if( props[i].owner === INACTIVE_ID ){

      props[i].owner         = pid;
      props[i].type          = model.data_tileSheets[type];
      props[i].capturePoints = 1;
      props[i].x             = x;
      props[i].y             = y;
      model.property_posMap[x][y] = props[i]; 
      return;
    }
  }

  assert(false);
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

// Lets an unit captures a property. If the capture points of the property falls to 
// zero then the owner of the property will be changed to the owner of the capturer.
// 
model.property_capture = function( cid, prid ){
  if( DEBUG ) util.log( "unit",cid,"capturing property",cid );

  assert( model.property_isValidPropId(prid) );
  assert( model.unit_isValidUnitId(cid) );

  var selectedUnit  = model.unit_data[cid];
  var property      = model.property_data[prid];
  var points        = parseInt( selectedUnit.hp / 10, 10 ) + 1;

  // script it
  points = parseInt(
    points*controller.scriptedValue( selectedUnit.owner , "captureRate", 100 )/100,
  10);

  property.capturePoints -= points;
  if( property.capturePoints <= 0 ) {
    var x = property.x;
    var y = property.y;
    
    if( DEBUG ) util.log( "property", prid,"captured" );
    
    model.fog_modifyVisionAt( x, y, property.type.vision, 1 );
    
    // loose conditional property ?
    if( property.type.looseAfterCaptured === true ) {
      var pid = property.owner;
      model.player_deactivatePlayer( pid );
    }
    
    // change type after capture ?
    var changeType = property.type.changeAfterCaptured;
    if( typeof changeType !== "undefined" ) {
      model.property_changeType( prid, changeType );
    }
    
    // set new meta data
    property.capturePoints  = 20;
    property.owner          = selectedUnit.owner;
    
    // when capture limit is reached then 
    // the game round ends
    var capLimit = controller.configValue( "captureLimit" );
    if( capLimit !== 0 && model.countProperties() >= capLimit ) {
      controller.update_endGameRound();
    }
  }
  
  controller.events.property_capture( uid );
};

// Resets the capture points of a property object
//
model.property_resetCapturePoints = function( prid ){
  assert( model.property_isValidPropId(prid) );
  
  model.property_data[prid].capturePoints = 20;
  
  controller.events.property_resetCapturePoints( prid );
};

// Returns true if the property can be captured by the unit, else ( no capturable and/or 
// no capturing unit ) false.
//
model.property_isCapturableBy = function( prid, captId ){
  assert( model.property_isValidPropId(prid) );
  assert( model.unit_isValidUnitId(captId) );
  
  return model.property_data[prid].type.points > 0 && 
          model.unit_data[captId].type.captures > 0;
};

// Changes the type of a property object.
//
model.property_changeType = function( prid, type ){
  assert( model.property_isValidPropId(prid) );
  assert( model.data_propertyTypes.indexOf(type.ID) !== -1 );
  
  model.property_data[prid].type = type;
  
  controller.events.property_changeType( prid, type );
};