//
//
model.event_on( "capture_check",function(  prid, uid ){
  if( !model.property_isCapturableBy( prid, uid ) ){
    return false;
  }
});

// Lets an unit captures a property. If the capture points of the property falls to
// zero then the owner of the property will be changed to the owner of the capturer.
//
model.event_on( "capture_invoked",function(  prid, cid ){
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

    model.events.modifyVisionAt( x, y, selectedUnit.owner, property.type.vision, 1 );

    // loose conditional property ?
    if( property.type.looseAfterCaptured === true ) {
      var pid = property.owner;
      model.events.player_deactivatePlayer( pid );
    }

    // change type after capture ?
    var changeType = property.type.changeAfterCaptured;
    if( typeof changeType !== "undefined" ) {
      model.events.property_changeType( prid, changeType );
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
});

//
//
model.event_on("property_createProperty", function( pid, x, y, type ){

  var props = model.property_data;
  for( var i = 0, e = props.length; i < e; i++ ) {

    if( props[i].owner === INACTIVE_ID && !props[i].type ){

      props[i].owner              = pid;
      props[i].type               = model.data_tileSheets[type];
      props[i].capturePoints      = 1;
      props[i].x                  = x;
      props[i].y                  = y;
      model.property_posMap[x][y] = props[i];
      return;
    }
  }

  assert(false);
});

// Resets the capture points of a property object
//
/*model.event_on("move_moveByCache",function( uid, x, y ){
  var prop = model.property_posMap[x][y];
  if( prop ) prop.capturePoints = 20;
});*/
model.event_on("clearUnitPosition",function(uid){
  var unit = model.unit_data[uid];
  var x = unit.x;
  var y = unit.y;
  if( x < 0 ) x = -x;
  if( y < 0 ) y = -y;
  
  var prop = model.property_posMap[x][y];
  if( prop ) prop.capturePoints = 20;
});


// Changes the type of a property object.
//
model.event_on("property_changeType", function( prid, type ){
  assert( model.property_isValidPropId(prid) );
  if( typeof type === "string" ){
    assert( model.data_propertyTypes.indexOf(type) !== -1 );
    type = model.data_tileSheets[type];
  } else {
    assert( model.data_propertyTypes.indexOf(type.ID) !== -1 );
  }

  model.property_data[prid].type = type;
});

// Changes the type of a property object.
//
model.event_on("property_changeTypeById", function( prid, typeId ){
  model.events.property_changeType( prid, model.data_propertyTypes[typeId] );
});
