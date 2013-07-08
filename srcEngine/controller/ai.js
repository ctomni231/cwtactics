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

// Returns true if a player id is controlled by the
// AI.
//
controller.isPlayerAiControlled = function( pid ){
  return controller.activeAIs[pid].ai !== null;
};

// A set of AI helper functions.
//
controller.aiActions = {
  
  // Ends the current active turn turn.
  //
  endTurn:function(){
    
  },
  
  // Does an action as shared command.
  //
  // @param {String} key command name
  // @param {Array} args argument array
  //
  doAction: function( key, args ){
    
    // tick next AI step
    controller.doSharedCall( "nextAiStep" );
  }
};

// Invokes the next AI step. Will be called as command 
// but not shared with other clients.
//
model.nextAiStep = function(){
  var obj = controller.activeAIs[ model.turnOwner ];
  
  // If the turn owner has no AI then 
  // it's a game state breaker 
  if( !obj.ai ) model.criticalError( 
    constants.error.ILLEGAL_DATA, 
    constants.error.AI_STEP_ON_NON_AI_PLAYER
  );
  
  obj.ai.tick( obj.memory, controller.aiActions );
};