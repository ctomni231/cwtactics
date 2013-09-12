controller.registerInvokableCommand("nextAiStep");

controller.activeAIs = util.list( constants.MAX_PLAYER, function(){
  return {
    memory:null,
    ai:null    
  };
});

// Holds the different artificial intelligence implementations.
//
controller.aiImpls = {};

// Registers an artificial intelligence implementation.
//
// @param {Object} impl implementation object
//
controller.registerAI = function( impl ){
  
  // Identical key needs to be defined
  if( !util.expectString( impl, "key", true ) ||
      !util.expectString( controller.aiImpls, "key", true ) ) model.criticalError( 
    constants.error.ILLEGAL_PARAMETERS, constants.error.GAME_STATE_BREAK
  );
  
  // Initializer function must be defined
  if( !util.expectFunction( impl, "init", true ) ) model.criticalError( 
    constants.error.ILLEGAL_PARAMETERS, constants.error.GAME_STATE_BREAK
  );
  
  // Tick function must be defined
  if( !util.expectFunction( impl, "tick", true ) ) model.criticalError( 
    constants.error.ILLEGAL_PARAMETERS, constants.error.GAME_STATE_BREAK
  );
  
  controller.aiImpls[impl.key] = impl;  
};

// Returns true if a player id is controlled by the AI.
//
controller.isPlayerAiControlled = function( pid ){
  return controller.activeAIs[pid].ai !== null;
};

// Grabs the AI object for the current turn owner. Throws an error
// if the current turn owner isn't controlled by the AI.
//
controller.getAiForCurrentPlayer = function(){
  var obj = controller.activeAIs[ model.turnOwner ];
  
  // If the turn owner has no AI then it's a game state breaker 
  if( !obj.ai ) model.criticalError( 
    constants.error.ILLEGAL_DATA, constants.error.AI_STEP_ON_NON_AI_PLAYER 
  );
  
  return obj;
};

// Invokes the next AI step. Will be called as command 
// but not shared with other clients.
//
model.prepareAiTurn = function(){
  var obj = controller.getAiForCurrentPlayer();
  
  // initialize AI turn logic
  obj.ai.init( obj.memory, model.turnOwner );
  
  // start it
  model.nextAiStep();
};

// Invokes the next AI step. Will be called as command 
// but not shared with other clients.
//
model.nextAiStep = function(){
  var obj = controller.getAiForCurrentPlayer();
  
  // do AI logic
  if( obj.ai.tick( obj.memory, controller.aiActions ) !== false ){
    
    // remain in the AI loop
    controller.localInvokement("nextAiStep",[]); 
  }
};