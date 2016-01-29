//
//
model.event_on( "supplyUnit_check",function(  uid, x,y ){
  if( !model.supply_hasSupplyTargetsNearby( uid, x, y ) ) return false;
});

// A supplier supplies all surrounding units that can be supplied by the supplier.
//
// @example
//
//  cross pattern
//
//      x
//    x o x
//      x
//
model.event_on( "supplyUnit_invoked",function(sid){
  var selectedUnit = model.unit_data[ sid ];

  assert( selectedUnit.type.supply );

  var x    = selectedUnit.x;
  var y    = selectedUnit.y;
  var pid  = selectedUnit.owner;
  var i    = model.unit_firstUnitId(pid);
  var e    = model.unit_lastUnitId(pid);

  var unitsSupplied = false;

  // check all
  for(; i < e; i++){
    if( !model.unit_isValidUnitId(i) ) continue;

    // supply when neighbor
    if(model.unit_getDistance(sid, i) === 1){
      model.events.supply_refillResources(i);
    }
  }
});

//
//
model.event_on("supply_refillResources",function(uid){
  assert( model.unit_isValidUnitId(uid) );

  var unit  = model.unit_data[uid];
  var type  = unit.type;
  unit.ammo = type.ammo;
  unit.fuel = type.fuel;
});

//
//
model.event_on( "nextTurn_unitCheck",function( uid ){
  var unit = model.unit_data[ uid ];
  if( model.events.supplyUnit_check(uid,unit.x,unit.y) ){
    model.events.supplyUnit_invoked(uid);
  }
});


// Drains fuel. When the unit does not have enough fuel then it
// will be removed from game and the event will be stopped.
//
model.event_on( "nextTurn_unitCheck",function( uid ){
  var unit = model.unit_data[uid];

  var v = unit.type.dailyFuelDrain;
  if( typeof v === "number" ){

    // hidden units may drain more fuel
    if( unit.hidden && unit.type.dailyFuelDrainHidden ){
      v = unit.type.dailyFuelDrainHidden;
    }

    v = parseInt( controller.scriptedValue( unit.owner, "fuelDrain", v )/100*
                  controller.scriptedValue( unit.owner, "fuelDrainRate", 100 ), 10);

    unit.fuel -= v;

    // if fuel is empty then destroy it
    if( unit.fuel <= 0 ){
      model.events.destroyUnit( uid );
      return false; // break event chain because unit will be removed
    }
  }
});

// Gives funds.
//
model.event_on( "nextTurn_propertyCheck",function( prid ){
  var prop = model.property_data[prid];
  if( typeof prop.type.funds !== "number" ) return;

  var x = prop.x;
  var y = prop.y;

  controller.prepareTags(x, y);
  var funds = controller.scriptedValue(prop.owner, "funds", prop.type.funds);
  model.player_data[prop.owner].gold += funds;
});

// Refill resources when a own or allied unit is on a resupply capable property.
//
model.event_on( "nextTurn_propertyCheck",function( prid ){
  var prop = model.property_data[i];
  if( prop.type.supply){

    var x = prop.x;
    var y = prop.y;
    var pid = prop.owner;

    var check = model.unit_thereIsAUnit;
    var mode = model.MODE_OWN;
    if(controller.configValue("supplyAlliedUnits") === 1) mode = model.MODE_TEAM;

    if(check(x, y, pid, mode)){
      var unitTp = model.unit_posData[x][y].type;
      if( prop.type.supply.indexOf(unitTp.ID) !== -1 ||
          prop.type.supply.indexOf(unitTp.movetype) !== -1 ){

        model.events.supply_refillResources(model.unit_posData[x][y]);
      }
    }
  }
});

// Repair when a own or allied unit is on a repair capable property
// and the unit does not have full health.
//
model.event_on( "nextTurn_propertyCheck",function( prid ){
  var prop = model.property_data[i];
  if( prop.type.repairs ){
    var x = prop.x;
    var y = prop.y;
    var pid = prop.owner;

    var check = model.unit_thereIsAUnit;
    var mode = model.MODE_OWN;
    if(controller.configValue("repairAlliedUnits") === 1)mode = model.MODE_TEAM;

    if(check(x, y, pid, mode)){
      var unitTp = model.unit_posData[x][y].type;
      var value;
      value = prop.type.repairs.get(unitTp.ID);
      if( !value ) value = prop.type.repairs.get(unitTp.movetype);

      // script it :P
      value = controller.scriptedValue(pid,"propertyHeal",value);

      if(value > 0){
        model.events.healUnit(
          model.unit_extractId(model.unit_posData[x][y]),
          model.unit_convertPointsToHealth(value),
          true
        );
      }
    }
  }
});
