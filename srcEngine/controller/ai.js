controller.registerInvokableCommand("nextAiStep");
controller.registerInvokableCommand("prepareAiTurn");

// ### Controller.activeAIs
// Holds the active AI objects.
//
controller.activeAIs = util.list( MAX_PLAYER, function(){
  return {
    memory:{},
    ai:null    
  };
});

// ### Controller.aiImpls
// Holds the different artificial intelligence implementations.
//
controller.aiImpls = {};

// ### Controller.registerAI
// Registers an artificial intelligence implementation.
//
controller.registerAI = function( impl ){
  
  // check implementation meta data
  if( !util.expectString( impl, "key", true ) || !util.expectString( controller.aiImpls, "key", true ) ) model.errorIllegalArguments("register AI","illegal AI key");
  if( !util.expectFunction( impl, "init", true )                                                       ) model.errorIllegalArguments("register AI","needs init function");
  if( !util.expectFunction( impl, "tick", true )                                                       ) model.errorIllegalArguments("register AI","needs tick function");
  
  controller.aiImpls[impl.name] = impl;  
};

// ### Controller.setAiPlayer
// Sets a AI player for a given player id `pid`.
//
controller.setAiPlayer = function( pid, key ){
  var impl = controller.aiImpls[key];
  if( impl ){
    
    controller.activeAIs[pid].ai = impl;
    return true;
  }
  else return false;
};

// ### Controller.isPlayerAiControlled
// Returns true if a player id is controlled by the AI.
//
controller.isPlayerAiControlled = function( pid ){
  return controller.activeAIs[pid].ai !== null;
};

// ### Controller.getAiForCurrentPlayer
// Grabs the AI object for the current turn owner. Throws an error if the current turn owner isn't controlled by the AI.
//
controller.getAiForCurrentPlayer = function(){
  var obj = controller.activeAIs[ model.turnOwner ];
  
  // If the turn owner has no AI then it's a game state breaker 
  if( !obj.ai ) model.errorCorruptDataModel("getAiForCurrentPlayer","current player is not controlled by the AI");
  
  return obj;
};

// ### Controller.prepareAiTurn
// Invokes the next AI step. Will be called as command but not shared with other clients.
//
model.prepareAiTurn = function(){
  var obj = controller.getAiForCurrentPlayer();
  
  // initialize AI turn logic
  obj.ai.init( obj.memory, model.turnOwner );
  
  // start it
  model.nextAiStep();
};

// ### Controller.nextAiStep
// Invokes the next AI step. Will be called as command but not shared with other clients.
//
model.nextAiStep = function(){
  var obj = controller.getAiForCurrentPlayer();
  
  // do AI logic
  if( obj.ai.tick( obj.memory, controller.aiActions ) !== false ){
    
    // remain in the AI loop
    controller.localInvokement("nextAiStep",[]); 
  }
};
