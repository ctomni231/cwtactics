// Man power data array that holds the amount times that an unit can be builded.
//
model.manpower_data = util.list( MAX_PLAYER, 999999 );

// Declines build wish when the manpower is le 0
model.event_on( "buildUnit_check", 
  function( wish, factoryId, playerId, type ){
    if( model.manpower_data[playerId] <= 0 ) wish.decline();
  }
);

// Decreases manpower when a factory builds an unit
model.event_on( "buildUnit_invoked",
  function( factoryId, playerId, type ){
    model.manpower_data[pid]--;
  }
);