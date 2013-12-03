// Contains all player instances that will be controlled by the local client including AI 
// instances.
// 
model.client_instances = util.list( MAX_PLAYER, false );

// The `pid` of the last active local player.
//
model.client_lastPid = INACTIVE_ID;

// Deregisters all players.
//
model.client_deregisterPlayers = function(){
  for( var i= 0, e=MAX_PLAYER; i<e; i++ ){
    model.client_instances[i] = false;
  }
};

// Registers a player `pid` as local player.
//
model.client_registerPlayer = function( pid ){
  assert( model.player_isValidPid(pid) );
  
  model.client_instances[pid] = true;
  
  // set at least one player id
  if( model.client_lastPid === -1 ) model.client_lastPid = pid;
  
  return true;
};

// Registers a player `pid` as local player.
//
model.client_deregisterPlayer = function( pid ){
  assert( model.player_isValidPid(pid) );
  
  model.client_instances[pid] = false;
  return true;
};

// Returns `true` when the given `pid` is controlled by the active client.
//
model.client_isLocalPid = function( pid ){
  assert( model.player_isValidPid(pid) );
  
  return model.client_instances[pid] === true;
};