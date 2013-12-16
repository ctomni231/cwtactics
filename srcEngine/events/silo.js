//
//
model.event_on( "silofire_check", function( prid,uid ){
  if( !model.bombs_isSilo( prid,uid ) ) return false;
});

//
//
model.event_on( "silofire_validPos", function( x,y ){
  if(!model.map_isValidPosition(x,y) ) return false;
});

// fires a rocket to a given position (x,y) and inflicts damage to all units in a range around
// the position.
//
model.event_on( "silofire_invoked", function( x,y, tx, ty, owner){
  var silo    = model.property_posMap[x][y];
  var siloId  = model.property_extractId(silo);
  var type    = silo.type;
  var range   = type.rocketsilo.range;
  var damage  = model.unit_convertPointsToHealth(type.rocketsilo.damage);

  model.events.property_changeType(siloId, model.data_tileSheets[type.changeTo]);
  model.events.rocketFly( x,y, tx, ty);
  model.events.explode_invoked(tx, ty, range, damage, owner);
});

// Silo regeneration.
//
model.event_on( "silofire_invoked", function( x,y, tx, ty, owner){
  var silo    = model.property_posMap[x][y];
  var siloId  = model.property_extractId(silo);
  var type    = silo.type;

  model.events.dayEvent(
    5,
    "property_changeTypeById",
    siloId,
    model.data_propertyTypes.indexOf(type)
  );
});
