// Declines build event when the unit limit is reached.
//
model.event_on( "buildUnit_check", function(  factoryId, playerId, type ){
  var uLimit = controller.configValue("unitLimit");
  var count  = model.unit_countUnits(playerId);
  if( !uLimit ) uLimit = 9999999;

  if( count >= uLimit               ) return false;
  if( count >= MAX_UNITS_PER_PLAYER ) return false;
});

// Inflicts damage to an unit.
//
model.event_on("damageUnit",function( uid, damage, minRest ){
  var unit = model.unit_data[uid];
  assert( unit );

  unit.hp -= damage;

  if( minRest && unit.hp <= minRest ){
    unit.hp = minRest;
  }
  else{
    if( unit.hp <= 0 ) model.events.destroyUnit(uid);
  }
});

// Heals an unit. If the unit health will be greater than the maximum health value then
// the difference will be added as gold to the owners gold depot.
//
model.event_on("healUnit",function( uid, health, diffAsGold ){
  var unit = model.unit_data[uid];
  assert( unit );

  unit.hp += health;
  if( unit.hp > 99 ){

    // pay difference of the result health and 100 as
    // gold ( in realtion to the unit cost ) to the
    // unit owners gold depot
    if( diffAsGold === true ){
      var diff = unit.hp - 99;
      model.player_data[ unit.owner ].gold += parseInt( (unit.type.cost*diff)/100, 10 );
    }

    unit.hp = 99;
  }
});

// Registers a new unit object in the stock of a player. The unit
// will be created and placed into the tile at position (x,y).
//
model.event_firstOn("createUnit", function( slotId, pid, x, y, type ){
  assert( model.unit_data[slotId].owner === INACTIVE_ID );

  var typeSheet   = model.data_unitSheets[type];
  var unit        = model.unit_data[slotId];
  unit.hp         = 99;
  unit.owner      = pid;
  unit.type       = typeSheet;
  unit.ammo       = typeSheet.ammo;
  unit.fuel       = typeSheet.fuel;
  unit.loadedIn   = -1;
});


// Deregisters an unit object from the stock of a player. The tile, where the unit is placed on,
// will be freed from any position information.
//
model.event_firstOn("destroyUnitSilent", function( uid ){
  var unit = model.unit_data[uid];
  
  model.events.clearUnitPosition(uid);
  
  // mark slot as unused
  unit.owner = INACTIVE_ID;

  // end game when the player does not have any unit left
  if( controller.configValue("noUnitsLeftLoose") === 1 &&
      model.unit_countUnits( unit.owner ) === 0 ){

    controller.update_endGameRound();
  }
});

// Deregisters an unit object from the stock of a player. The tile, where the unit is placed on,
// will be freed from any position information.
//
model.event_on("destroyUnit", function( uid ){
  model.events.destroyUnitSilent(uid);
});
