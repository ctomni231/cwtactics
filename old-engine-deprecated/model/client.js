// Contains all player instances that will be controlled by the local client including AI
// instances.
//
model.client_instances = util.list( MAX_PLAYER, false );

// The `pid` of the last active local player.
//
model.client_lastPid = INACTIVE_ID;

// Returns `true` when the given `pid` is controlled by the active client.
//
model.client_isLocalPid = function( pid ){
  assert( model.player_isValidPid(pid) );

  return model.client_instances[pid] === true;
};
