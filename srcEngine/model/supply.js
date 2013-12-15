controller.defineGameScriptable("propertyHeal",1,10);
controller.defineGameConfig(    "autoSupplyAtTurnStart", 0, 1, 1);

// Returns true if a given unit id represents a supplier unit.
//
model.supply_isSupplyUnit = function( uid ){
  assert( model.unit_isValidUnitId(uid) );

  return model.unit_data[uid].type.supply;
};

// Returns true if a given unit id has possible supply targets nearby.
//
model.supply_hasSupplyTargetsNearby = function( uid, x, y ){
  assert( model.unit_isValidUnitId(uid) );
  assert( model.map_isValidPosition(x,y) );

  if( !model.supply_isSupplyUnit( uid ) ) return false;

  var supplier = model.unit_data[uid];
  //if( x > 0 )

  return false;
};
