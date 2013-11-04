// commands
controller.action_registerCommands("manpower_decreaseManpower");

// events
controller.event_define("manpower_decreaseManpower");

// Man power data array that holds the amount times that an unit can be builded
model.manpower_data = util.list( MAX_PLAYER, 999999 );

// Returns true if a player has left man power else false.
//
model.manpower_hasLeftManpower = function( pid ){
  assert( model.player_isValidPid(pid) );
  
  return model.manpower_data[pid] > 0;
};

// Decreases the amount of man power.
//
model.manpower_decreaseManpower = function( pid ){
  assert( model.player_isValidPid(pid) );

  model.manpower_data[pid]--;
  
  // Invoke model event
  controller.events.manpower_decreaseManpower(pid);
};