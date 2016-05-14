
// Deregisters all players.
//
model.event_on("client_deregisterPlayers",function(){
  model.client_instances.resetValues();
});

// Registers a player `pid` as local player.
//
model.event_on("client_registerPlayer", function( pid ){
  assert( model.player_isValidPid(pid) );

  model.client_instances[pid] = true;

  // set at least one player id
  if( model.client_lastPid === -1 ) model.client_lastPid = pid;

  return true;
});

// Registers a player `pid` as local player.
//
model.event_on("client_deregisterPlayer", function( pid ){
  assert( model.player_isValidPid(pid) );

  model.client_instances[pid] = false;
  return true;
});
