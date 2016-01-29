// Declines build wish when the manpower is le 0
//
model.event_on( "buildUnit_check",function(  factoryId, playerId, type ){
  if( model.manpower_data[playerId] <= 0 ) return false;
});

// Decreases manpower when a factory builds an unit
//
model.event_on( "buildUnit_invoked",function( x, y, type ){
  model.manpower_data[model.property_posMap[x][y].owner]--;
});
