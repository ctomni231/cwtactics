// Declines wish if two units can join each other in the current situation.
// Transporters cannot join each other when they loaded units.
//
model.event_on( "joinUnits_check",function( juid, jtuid ){
  var joinSource = model.unit_data[juid];
  var joinTarget = model.unit_data[jtuid];

  // no merge of transporters with loads
  if( model.transport_hasLoads( juid ) ||
      model.transport_hasLoads( jtuid ) ||
      joinSource.type !== joinTarget.type ||
      joinTarget.hp >= 90
  ) return false;
});

// Joins two units together. If the combined health is greater than the maximum health then
// the difference will be payed to the owners resource depot.
//
model.event_on( "joinUnits_invoked",function( juid, jtuid ){
  var joinSource = model.unit_data[juid];
  var joinTarget = model.unit_data[jtuid];

  assert(joinTarget.type === joinSource.type);

  // health
  model.events.healUnit(jtuid, model.unit_convertPointsToHealth(
    model.unit_convertHealthToPoints( joinSource )),true);

  // ammo
  joinTarget.ammo += joinSource.ammo;
  if( joinTarget.ammo > joinTarget.type.ammo ) joinTarget.ammo = joinTarget.type.ammo;

  // fuel
  joinTarget.fuel += joinSource.fuel;
  if( joinTarget.fuel > joinTarget.type.fuel ) joinTarget.fuel = joinTarget.type.fuel;

  // TODO experience points

  // disband joining unit
  joinSource.owner = INACTIVE_ID;
});
