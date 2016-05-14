controller.defineGameScriptable("vision",1,40);
controller.defineGameConfig("fogEnabled",0,1,1);

// Contains the fog data map. A value 0 means a tile is not visible. A value greater than 0 means
// it is visible for n units ( n = fog value of the tile ).
//
model.fog_turnOwnerData = util.matrix( MAX_MAP_WIDTH, MAX_MAP_HEIGHT, 0 );

// Same as `model.fog_turnOwnerData` but this map is the fog data for the player id that is
// visible on the local client.
//
model.fog_clientData = util.matrix( MAX_MAP_WIDTH, MAX_MAP_HEIGHT, 0 );

// This fog list contains the visible id's of all player instances that are visible for
// the active client instance.
//
model.fog_visibleClientPids = util.list( MAX_PLAYER, false );

// This fog list contains the visible id's of all player instances that are visible for the
// current turn owner.
//
model.fog_visibleTurnOwnerPids = util.list( MAX_PLAYER, false );

// Will be invoked when a player registers one player as local client player. Throws an error
// if an other player tries to connect a player instance that is already a local player instance.
//
model.fog_remoteConnectOfPlayer = function( pid ){
  assert( model.player_isValidPid(pid) );

  // FIXME
};
