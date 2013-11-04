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
 
// Specification of a property id.
//
model.property_specPropId = [util.expect.INT,util.expect.GE,0,util.expect.LE,MAX_PROPERTIES-1];

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
	util.expect( model.map_specPosX, x );
  util.expect( model.map_specPosY, y );
  util.expect( model.player_specPlayerId, pid );
	
	var property = model.property_posMap[x][y];
	return property !== null && model.player_getRelationship(pid,property.owner) === mode;
};

// Returns a property object by its position or null.
//
model.property_getByPos = function( x, y ){
	util.expect( model.map_specPosX, x );
  util.expect( model.map_specPosY, y );
  
  return model.property_posMap[x][y];
};

// Returns true if the tile at position x,y is a property, else false.
//
model.property_isPropertyAtTile = function( x, y ){
	util.expect( model.map_specPosX, x );
  util.expect( model.map_specPosY, y );
  
  return model.property_getByPos( x, y ) !== null;
};

// Extracts the identical number from a property object.
//
model.property_extractId = function( property ){
  var index = model.property_data.indexOf( property );
  
  // check result index when -1 then the property object does not exists
  util.expect( util.expect.isTrue, (index !== -1) );
  
  return index;
};

// Counts all properties owned by the player with the given player id.
//
model.property_countProperties = function( pid ){
  util.expect( model.player_specPlayerId, pid );
  
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
  
  util.expect( model.property_specPropId, prid );
  util.expect( model.specUnitId, cid );
  
  var selectedUnit  = model.unit_data[cid];
  var property      = model.property_data[prid];
  var points        = parseInt( selectedUnit.hp / 10, 10 ) + 1;
  
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
  util.expect( model.property_specPropId, prid );
  
  model.property_data[prid].capturePoints = 20;
  
  controller.events.property_resetCapturePoints( prid );
};

// Returns true if the property can be captured by the unit, else ( no capturable and/or 
// no capturing unit ) false.
//
model.property_isCapturableBy = function( prid, captId ){
  util.expect( model.property_specPropId, prid );
  util.expect( model.specUnitId, captId );
  
  return model.property_data[prid].type.points > 0 && 
          model.unit_data[captId].type.captures > 0;
};

// Specification of a tile type.
//
model.property_specTileType = [util.expect.STRING,util.expect.PROP_OF,model.tileTypes];

// Changes the type of a property object.
//
model.property_changeType = function( prid, type ){
  util.expect( model.property_specPropId, prid );
  util.expect( model.property_specTileType, type );
  
  model.property_data[prid].type = type;
  
  controller.events.changedPropertyType( prid, type );
};