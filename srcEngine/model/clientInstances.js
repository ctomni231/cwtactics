
// Contains all player instances that will be controlled
// by the local client including AI instances
model.clientInstances = util.list( MAX_PLAYER, false );

model.lastActiveClientPid = -1;

// Define persistence handler for 
// recognize game initializing event
controller.persistenceHandler(
  
  // load
  function(){
    model.lastActiveClientPid = -1;
  },
  
  // save
  function(){}
)

// Registers a player id as local player
//
model.registerClientPlayer = function( pid ){
  if( !model.isValidPlayerId(pid) ) return false;
  
  model.clientInstances[pid] = true;
  
  // set at least one player id
  if( model.lastActiveClientPid === -1 ) model.lastActiveClientPid = pid;
  
  return true;
};

// Registers a player id as local player
//
model.deregisterClientPlayer = function( pid ){
  if( !model.isValidPlayerId(pid) ) return false;
  
  model.clientInstances[pid] = false;
  return true;
};

model.isClientPlayer = function( pid ){
  return model.clientInstances[pid] === true;
};
