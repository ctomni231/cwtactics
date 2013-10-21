// # Property Module
//

// ### Meta Data

controller.registerInvokableCommand( "changePropertyType" );
controller.registerInvokableCommand( "resetCapturePoints" );
controller.registerInvokableCommand( "captureProperty" );

controller.defineEvent( "changePropertyType" );
controller.defineEvent( "resetCapturePoints" );
controller.defineEvent( "captureProperty" );

controller.defineGameScriptable( "captureRate", 50, 9999 );
controller.defineGameScriptable( "funds", 1, 99999 );

controller.defineGameConfig( "captureLimit", 0, MAX_PROPERTIES, 0 );

model.unitTypeParser.addHandler( function( sheet ){
  if( !util.expectNumber( sheet, "captures", false, true, 1, 10 ) ) return false;
} );

model.tileTypeParser.addHandler( function( sheet ){
  if( !util.expectNumber( sheet, "points", false, true, 1, 100 ) ) return false;
  if( !util.expectNumber( sheet, "funds", false, true, 10, 99999 ) ) return false;
} );

// ---

// ### Model

// List of all available properties of a game round. If a property is not 
// used it will be marked with an owner value {@link CWT_INACTIVE_ID}.
//
model.properties = util.list( MAX_PROPERTIES + 1, function(){
  return {
    capturePoints: 20,
    owner: -1,
    x: 0,
    y: 0,
    type: null
  };
} );

model.propertyPosMap = util.matrix( MAX_MAP_WIDTH, MAX_MAP_HEIGHT, null );

// Defines a persistence handler
controller.persistenceHandler(
  // load
  function( dom ){
    
    // reset all properties in the model
    for( var i = 0, e = model.properties.length; i < e; i++ ) model.properties[i].owner = INACTIVE_ID;
    
    // set properties of the given document 
    // model
    for( var i = 0, e = dom.prps.length; i < e; i++ ) {
      var data = dom.prps[i];
      
      // check data
      var fail = false;
      if( !fail && !util.expectNumber( data, 0, true, true, 0, MAX_PROPERTIES-1 ) ) fail = true;
      if( !fail && !util.expectNumber( data, 5, true, true, -1, MAX_PLAYER-1 ) ) fail = true;
      
      // TODO: check by map sizes
      if( !fail && !util.expectNumber( data, 1, true, true, 0, MAX_MAP_WIDTH-1 ) ) fail = true;
      if( !fail && !util.expectNumber( data, 2, true, true, 0, MAX_MAP_HEIGHT-1 ) ) fail = true;
      
      // must be a property with capture points
      if( !fail && !util.expectString( data, 3, true ) ) fail = true;
      if( model.tileTypes[data[3]].capturePoints ){
        
        // given points must be between 1 and max capturePoints of the type
        if( !fail && !util.expectNumber( data, 4, true, true, 1, model.tileTypes[data[3]].capturePoints ) ) fail = true;
      }
      
      // call error when data is illegal
      if( fail ) {
        model.criticalError( error.ILLEGAL_MAP_FORMAT, error.SAVEDATA_PLAYER_MISSMATCH );
      }
      
      var property = model.properties[ data[0] ];
      
      // inject data into object
      property.type = model.tileTypes[data[3]];
      property.capturePoints = data[4];
      property.owner = data[5];
      property.x = data[1];
      property.y = data[2];
      
      model.propertyPosMap[ data[1] ][ data[2] ] = property;
    }
  },
  
  // save
  function( dom ){
    var prop;
    
    dom.prps = [ ];
    for( var i = 0, e = model.properties.length; i < e; i++ ) {
      prop = model.properties[i];
      
      // persist it if the owner of the property is
      // not INACTIVE
      if( prop.owner !== INACTIVE_ID ) {
        dom.properties.push( [
          i,
          prop.x,
          prop.y,
          prop.type.ID,
          prop.capturePoints,
          prop.owner
        ] );
      }
    }
  }
);

// ---

// ### Logic

// Returns a property object by its position or 
// null.
//
// @param {Number} prid property id
model.getPropertyByPos = function( x, y ){
  /*var props = model.properties;
       var prop;
       
       for( var i = 0, e = props.length; i < e; i++ ) {
       prop = props[i];
       
       if( prop.x === x && prop.y === y ) return prop;
       }
       
       return null;*/
  return model.propertyPosMap[x][y];
};

// Matrix that has the same metrics as the game map. Every property will be 
// placed in the cell that represents its position. A property will be 
// accessed by model.propertyPosMap[x][y]. 
//
//model.propertyPosMap = util.matrix(
//  CWT_MAX_MAP_WIDTH,
//  CWT_MAX_MAP_HEIGHT,
//  null
//);

// Returns true if the tile at position x,y is a property, else false.
// 
// @param {Number} x x coordinate
// @param {Number} y y coordinate
//
model.isPropertyTile = function( x, y ){
  return model.getPropertyByPos( x, y ) !== null;
};

// Extracts the identical number from a property object.
//
// @param property
//
model.extractPropertyId = function( property ){
  var index = model.properties.indexOf( property );
  
  // check result index when -1 then 
  // the property object does not exists
  if( index === -1 ) model.criticalError(
    error.ILLEGAL_PARAMETERS,
    error.PROPERTY_NOT_FOUND
  );
  
  return index;
};

// Counts all properties owned by the player with the given player id.
//
// @param {Number} pid player id
//
model.countPropertiesOfPlayer = function( pid ){
  
  // player must be valid and alive
  if( !model.isValidPlayerId( pid ) ) model.criticalError( -1, -1 );
  
  var n = 0;
  
  var props = model.properties;
  for( var i = 0, e = props.length; i < e; i++ ) {
    
    // count all properties that belongs to the selected pid
    if( props[i].owner === pid ) n++;
  }
  
  return n;
};

// Lets an unit captures a property. If the capture points of the property falls to zero then the owner of the 
// property will be changed to the owner of the capturer.
// 
// @param {Number} cid id of the capturer
// @param {Number} prid id of the property 
//
model.captureProperty = function( cid, prid ){
  var selectedUnit = model.units[cid];
  var property = model.properties[prid];
  var points = parseInt( selectedUnit.hp / 10, 10 ) + 1;
  
  property.capturePoints -= points;
  if( property.capturePoints <= 0 ) {
    var x = property.x;
    var y = property.y;
    
    if( DEBUG ) util.log( "property", prid, "captured by", cid );
    
    model.modifyVisionAt( x, y, property.type.vision, 1 );
    
    // loose conditional property ?
    if( property.type.looseAfterCaptured === true ) {
      var pid = property.owner;
      model.playerLooses( pid );
    }
    
    // change type after capture ?
    var changeType = property.type.changeAfterCaptured;
    if( typeof changeType !== "undefined" ) {
      model.changePropertyType( prid, changeType );
    }
    
    // set new meta data
    property.capturePoints = 20;
    property.owner = selectedUnit.owner;
    
    // when capture limit is reached then 
    // the game round ends
    var capLimit = controller.configValue( "captureLimit" );
    if( capLimit !== 0 && model.countProperties() >= capLimit ) {
      controller.endGameRound();
    }
  }
  
  controller.events.captureProperty( uid );
};

// Resets the capture points of a property object
//
// prid {Number} property id
//
model.resetCapturePoints = function( prid ){
  model.properties[prid].capturePoints = 20;
  
  controller.events.resetCapturePoints( prid );
};

// Returns true if the property can be captured by the unit, else 
// ( no capturable and/or no capturing unit ) false.
//
// prid {Number} property id
// captId {Number} capturer unit id
//
model.propertyIsCapturableBy = function( prid, captId ){
  return model.properties[prid].type.points > 0 && 
    model.units[captId].type.captures > 0;
};

// Changes the type of a property object
//
// prid {Number} property id
// type {String} new type of the property
//
model.changePropertyType = function( prid, type ){
  
  // check tile type 
  // throw error when type does not exists
  if( !mode.tileTypes[type] ) {
    model.criticalError(
      error.ILLEGAL_PARAMETERS,
      error.UNKNOWN_OBJECT_TYPE
    );
  }
  
  model.properties[prid].type = type;
  
  controller.events.changedPropertyType( prid, type );
};
