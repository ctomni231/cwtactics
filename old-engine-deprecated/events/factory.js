//
//
model.event_on("buildUnit_check", function( prid, pid ){
  if( !model.factory_isFactory( prid ) ) return false;
  if( pid === INACTIVE_ID              ) return false;
});


// Contructs a unit for a player. At least one slot must be free to do this.
//
model.event_on("buildUnit_invoked", function( x, y, type ){
  var prop = model.property_posMap[x][y];
  var cost = model.data_unitSheets[ type ].cost;
  var pl   = model.player_data[     prop.owner ];

  pl.gold -= cost;
  assert( pl.gold >= 0 );

  model.events.createUnit( model.unit_getFreeSlot(prop.owner), prop.owner, x, y, type );
});
