// commands
controller.action_registerCommands("supply_suppliesNeighbours");
controller.action_registerCommands("supply_tryUnitSuppliesNeighbours");
controller.action_registerCommands("supply_refillResources");
controller.action_registerCommands("supply_propertyRepairs");
controller.action_registerCommands("supply_propertySupply");
controller.action_registerCommands("supply_giveFunds");

// events
controller.event_define("supply_suppliesNeighbours");
controller.event_define("supply_refillResources");
controller.event_define("supply_propertyRepairs");
controller.event_define("supply_propertySupply");
controller.event_define("supply_giveFunds");

// configs
controller.defineGameConfig("autoSupplyAtTurnStart", 0, 1, 1);

// Player gets funds from all properties.
// 
model.supply_giveFunds = function(prid){
  assert( model.property_isValidPropId(prid) );

	var prop = model.property_data[prid];
  assert( prop.owner !== INACTIVE_ID );
	
	var x = prop.x;
  var y = prop.y;
		
	controller.prepareTags(x, y);
	var funds = controller.scriptedValue(prop.owner, "funds", prop.type.funds);
	
	if(typeof funds === "number"){
		model.player_data[prop.owner].gold += funds;
		
		controller.events.supply_giveFunds( prid, x, y );
	}
};

// Player gets resupply from all properties.
// 
model.supply_propertySupply = function(i){
  assert( model.property_isValidPropId(i) );

	var prop = model.property_data[i];
  assert( prop.owner !== INACTIVE_ID );
  
	if(prop.owner === pid && prop.type.supply){
    
		var x = prop.x;
		var y = prop.y;
    var pid = prop.owner;
		
		// CHECK TEAM REPAIR OR OWN SIDE REPAIR ONLY
		var check = model.unit_thereIsAUnit;
		var mode = model.MODE_OWN;
		if(controller.configValue("supplyAlliedUnits") === 1)mode = model.MODE_TEAM;
		
		if(check(x, y, pid, mode)){
			var unitTp = model.unit_posData[x][y].type;
			if(controller.objectInList(prop.type.supply, unitTp.ID, unitTp.movetype)){
				model.supply_refillResources(model.unit_posData[x][y]);
				
				controller.events.supply_propertySupply( i, x,y );
			}
		}
	}
};

// Player properties repairs if possible.
//
model.supply_propertyRepairs = function(i){
  assert( model.property_isValidPropId(i) );

	var prop = model.property_data[i];
  assert( prop.owner !== INACTIVE_ID );
		
	if(prop.type.repairs){
		var x = prop.x;
		var y = prop.y;
    var pid = prop.owner;
		
		var check = model.unit_thereIsAUnit;
		var mode = model.MODE_OWN;
		if(controller.configValue("repairAlliedUnits") === 1)mode = model.MODE_TEAM;
		
		if(check(x, y, pid, mode)){
			var unitTp = model.unit_posData[x][y].type;
			var value = controller.objectInMap(prop.type.repairs, unitTp.ID, unitTp.movetype);
			
			if(value > 0){
				model.unit_heal(model.unit_extractId(model.unit_posData[x][y]), 
					model.unit_convertPointsToHealth(value), true);
				
				controller.events.supply_propertyRepairs( i, x,y );
			}
		}
	}
};

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

// Tries to supply surrounding units with a unit.
//
model.supply_tryUnitSuppliesNeighbours = function(sid){
	if( model.supply_isSupplyUnit(sid) ) model.supply_suppliesNeighbours(sid);
};

// A supplier supplies all surrounding units that can 
// be supplied by the supplier.
// 
// @example
//  cross pattern
//      x
//    x o x
//      x
// 
model.supply_suppliesNeighbours = function(sid){
  assert( model.unit_isValidUnitId(sid) );

	var selectedUnit = model.unit_data[ sid ];
	
  assert( typeof selectedUnit.type.supply !== "undefined" );
	
	var x    = selectedUnit.x;
	var y    = selectedUnit.y;
	var pid  = selectedUnit.owner;
	var i    = model.unit_firstUnitId(pid);
	var e    = model.unit_lastUnitId(pid);
	
	var unitsSupplied = false;
	
	// check all
	for(; i < e; i++){
		
		// supply when neighbor
		if(model.unit_getDistance(sid, i) === 1){
			
			if( !unitsSupplied ){
				
				controller.events.supply_suppliesNeighbours( sid, x,y, i );
			}
			unitsSupplied = true;
			
			model.supply_refillResources(i);
		}
		
	}
};

// Refills the resources of an unit.
// 
model.supply_refillResources = function(uid){
  assert( model.unit_isValidUnitId(uid) );
  
	var unit 	= model.unit_data[uid];
	var type 	= unit.type;
	unit.ammo = type.ammo;
	unit.fuel = type.fuel;
	
	controller.events.supply_refillResources( uid );
};
