// # Supply Module
//

// ### Meta Data

controller.registerInvokableCommand("unitSuppliesNeighbours");
controller.registerInvokableCommand("tryUnitSuppliesNeighbours");
controller.registerInvokableCommand("refillResources");
controller.registerInvokableCommand("propertyRepairs");
controller.registerInvokableCommand("propertySupply");
controller.registerInvokableCommand("doPropertyGiveFunds");

controller.defineEvent("unitSuppliesNeighbours");
controller.defineEvent("refillResources");
controller.defineEvent("propertyRepairs");
controller.defineEvent("propertySupply");
controller.defineEvent("doPropertyGiveFunds");

controller.defineGameConfig("autoSupplyAtTurnStart", 0, 1, 1);

model.unitTypeParser.addHandler(function(sheet){
  var sub, key, keys, list, i, e;

  if(util.expectArray(sheet, "supply", false) === util.expectMode.DEFINED){

    list = sheet.supply;
    for(i = 0, e = list.length; i < e; i++){
      if(!util.expectString(list, i, true))return false;
    }
  }

  if(util.expectObject(sheet, "repairs", false) === util.expectMode.DEFINED){
    sub = sheet.repairs;
    keys = Object.keys(sub);

    for(i = 0, e = keys.length; i < e; i++){
      key = keys[i];

      // hard repair values between 1 and 9 
      if(!util.expectNumber(sub, key, true, true, 1, 9))return false;
    }
  }
});

model.tileTypeParser.addHandler(function(sheet){
  if( util.expectObject(sheet, "repairs", false) === util.expectMode.DEFINED){
    
    var sub = sheet.repairs;
    var keys = Object.keys(sub);
    for( var i2 = 0, e2 = keys.length; i2 < e2; i2++){
      var key = keys[i2];

      // hard repair values between 1 and 9 ( 10 is impossible because no unit can have 0 HP )
      if( !util.expectNumber(sub, key, true, true, 1, 9) ) return false;
    }
  }
});

// ---

// ### Logic

// Player gets funds from all properties.
// 
// @param {Number} prid id of the player
// 
model.doPropertyGiveFunds = function(prid){
  var prop = props[i];

  // check parameters
  if(prop.owner === constants.INACTIVE_ID){
    model.criticalError(
      constants.error.ILLEGAL_PARAMETERS,
      constants.error.UNKNOWN_PLAYER_ID
      );
  }

  controller.prepareTags(prop.x, prop.y);
  var funds = controller.scriptedValue(prop.owner, "funds", prop.type.funds);

  if(typeof funds === "number"){
    model.players[prop].gold += funds;
    
    controller.events.doPropertyGiveFunds( i, x,y );
  }
};

// Player gets resupply from all properties.
// 
// @param {Number} i id of the property
// 
model.propertySupply = function(i){
  var prop = props[i];
  if(prop.owner === pid && prop.type.supply){
    var x = prop.x;
    var y = prop.y;

    // CHECK TEAM REPAIR OR OWN SIDE REPAIR ONLY
    var check = model.thereIsUnitCheck;
    var mode = model.MODE_OWN;
    if(controller.configValue("supplyAlliedUnits") === 1)mode = model.MODE_TEAM;

    if(check(x, y, pid, mode)){
      var unitTp = model.unitPosMap[x][y].type;
      if(controller.objectInList(prop.type.supply, unitTp.ID, unitTp.movetype)){
        model.refillResources(model.unitPosMap[x][y]);
        
        controller.events.propertySupply( i, x,y );
      }
    }
  }
};

// Player properties repairs if possible.
//
// @param {Number} i id of the property
// 
model.propertyRepairs = function(i){
  var prop = props[i];

  // check parameters
  if(prop.owner === constants.INACTIVE_ID){
    model.criticalError(
      constants.error.ILLEGAL_PARAMETERS,
      constants.error.UNKNOWN_PLAYER_ID
      );
  }

  if(prop.type.repairs){
    var x = prop.x;
    var y = prop.y;

    var check = model.thereIsUnitCheck;
    var mode = model.MODE_OWN;
    if(controller.configValue("repairAlliedUnits") === 1)mode = model.MODE_TEAM;

    if(check(x, y, pid, mode)){
      var unitTp = model.unitPosMap[x][y].type;
      var value = controller.objectInMap(prop.type.repairs, unitTp.ID, unitTp.movetype);

      if(value > 0){
        model.healUnit(model.extractUnitId(model.unitPosMap[x][y]), model.ptToHp(value), true);
        
        controller.events.propertyRepairs( i, x,y );
      }
    }
  }
};

model.tryUnitSuppliesNeighbours = function(sid){
  if(!selectedUnit.type.supply)return;
  model.unitSuppliesNeighbours(sid);
};

// A supplier supplies all surrounding units that can 
// be supplied by the supplier.
// 
// @param {Number} sid supplier id
// 
// @example
//  cross pattern
//      x
//    x o x
//      x
// 
model.unitSuppliesNeighbours = function(sid){
  var selectedUnit = model.units[ sid ];

  // unit must be a supply unit
  if(!selectedUnit.type.supply)model.criticalError(
      constants.error.ILLEGAL_PARAMETERS, constants.error.SUPPLY_UNIT_EXPECTED
      );

  var x = selectedUnit.x;
  var y = selectedUnit.y;
  var pid = selectedUnit.owner;
  var i = model.getFirstUnitSlotId(pid);
  var e = model.getLastUnitSlotId(pid);

  var unitsSupplied = false;
  
  // check all
  for(; i < e; i++){

    // supply when neighbor
    if(model.unitDistance(sid, i) === 1){
      
      if( !unitsSupplied ){
        
        controller.events.unitSuppliesNeighbours( sid, x,y, i );
      }
      unitsSupplied = true;
      
      model.refillResources(i);
    }
    
  }
};

// Refills the resources of an unit.
// 
// @param {Number|Unit} uid id of the unit or the unit object itself
// 
model.refillResources = function(uid){
  var unit = model.units[uid];
  var type = unit.type;
  unit.ammo = type.ammo;
  unit.fuel = type.fuel;
  
  controller.events.refillResources( uid );
};
