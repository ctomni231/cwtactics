// DumbBoy (DB) is the old forgotten AI from MiniWars. We will resurrected him for Custom Wars: Tactics. 
// Our target is to build a first version of a dynamic AI that can change it's tasks at runtime
// in relation to the situation on the battlefield. DumbBoy won't be a next super gen AI. This
// is not our task ( we wouldn't have enough time to do this... to be true :P ). It should be more
// a concept of a clean designed AI that can be extended by different people. That's why DumbBoy gets
// a clean design instead of hacky code. 
//
// **TASKS 0.25: DO SOMETHING ON THE BATTLEFIELD (v. 0.3.5)**
//
//  - DB builds objects on his properties
//  - When neutral properties are left on the map then DB will
//    build at least one capturer unit
//  - DB tries to fulfill a percentage (AIR,VS,TANKS etc.)
//  - Damaged units (<=5HP) may move back to properties for repair
//  - Units move to the enemy players
//  - Capturers try to capture properties or move near to them
//  - DB attacks with units in range
//  - DB tries to position indirect units
//  - *Actions:* Wait,Move,Capture,End_Turn,Build_Unit,Attack,Join
//
// **TASKS 0.5: BEING DYNAMIC AND LESS CALCULATE ABLE (v. 0.4)**
//
//  - DB should define long term tasks for himself to organize his actions 
//    to fulfill this tasks (AGGRESIVE,DEFENSIVE,MONEY,PRESSING,SPAMMING)
//  - DB can ignore long term tasks to handle difficult situations dynamical
//  - Long term tasks changes during game play (maybe re-analyse it every 5 days)
//  - DB should analyse the objects that a player owns and uses to
//    counter play it (without cheating through the fog)
//  - DB uses CO powers and mechanic
//  - *Actions:* Activate_Power,Fire_Cannon,Fire_Laser,At/Detach Commander,Transfer XYZ,
//
// **TASKS 0.75: ANALYSE YOUR ENEMIES (v. 0.5)**
//
//  - DB should use transports to reach far away properties
//  - *Actions:* Hide/Unhide,Supply,Load/Unload,Suicide_Bomb
//
controller.ai_spec = "DumbBoy [0.25]";

// Some base scores.
//
controller.ai_SCORE = {
  LOW      : 100,
  NORMAL   : 200,
  HIGH     : 300,
  CRITICAL : 999
};

// Contains all check/action logics for the DumbBoy ai.
//
controller.ai_CHECKS = [];

// The memory of the ai. Holds different data of the game state for all ai controlled
// player instances.
//
controller.ai_data = util.list( MAX_PLAYER-1, function(){
  return {
    pid: INACTIVE_ID
  };
});

//
//
controller.ai_loopHolder_ = {
  i    : -1,
  e    : -1,
  prop : -1
};

// 
//
controller.ai_scoreDataHolder_ = {
  source          : null,
  target          : null,
  selectionTarget : null,
  moveSelection   : null,
  attackSelection : null
};

// 
//
controller.ai_actionDataHolder_ = {
  source          : null,
  target          : null,
  selectionTarget : null,
  moveSelection   : null,
  attackSelection : null
};

// Registers a AI action.
//
controller.ai_definedRoutine = function(impl){
  assert( util.isString(impl.key) );
  assert( controller.ai_CHECKS.hasOwnProperty(impl.key) );
  assert( util.isFunction(impl.scoring) );
  assert( util.isFunction(impl.prepare) );
  
  controller.ai_CHECKS.push(impl);
};

// Returns a AI action object.
//
controller.ai_definedRoutine = function(key){
  assert( util.isString(key) );
  
  var i = 0;
  var e = controller.ai_CHECKS.length;
  while( i<e ){
    if( controller.ai_CHECKS[i].key === key ) return controller.ai_CHECKS[i];
    i++;
  }
  
  return null;
};

// Registers a player id as ai controlled instance.
//
controller.ai_register = function(pid){
  assert( model.player_isValidPid(pid) );

  for (var i = 0; i < controller.ai_data.length; i++) {
    
    // if the slot is empty then occupy it
    if( controller.ai_data[i].pid === INACTIVE_ID ){
        controller.ai_data[i].pid = pid;
    }
  }
};

// Returns `true` when the given player id is not controlled by the AI, else `false`.
//
controller.ai_isHuman = function(pid){

  // search in all slots
  for( var i=controller.ai_data.length-1; i>=0; i-- ){
    if( controller.ai_data[i].pid === pid ) return false;
  }

  // no slot is used by the pid -> human
  return true;
};

// The state machine of the ai, contains the whole decision making process.
//
//    NONE                             => IDLE
//
//    IDLE                             => SET_UP_AI_TURN
//
//    SET_UP_AI_TURN                   => PHASE_PREPARE_SEARCH_TASKS
//
//    PHASE_PREPARE_SEARCH_TASKS       => PHASE_SEARCH_TASKS
//
//    PHASE_SEARCH_TASK                => PHASE_SEARCH_TASK              (when    actors left)
//                                     => PHASE_FLUSH_TASK               (when no actors left)
//
//    PHASE_FLUSH_TASK                 => PHASE_PREPARE_SEARCH_TASKS     (when normal action)
//                                     => TEAR_DOWN_AI_TURN              (when endTurn action)
//
//    TEAR_DOWN_AI_TURN                => IDLE
//
controller.ai_machine = util.stateMachine({

  // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  // This state must be active at the start of a AI turn. If not then something gone
  // wrong. At least no logic will be done here. It only symbolizes a meta state to
  // say "Hey I'm ready for a new AI turn".
  //

  IDLE:{ tick: function(){
    util.log(controller.ai_spec,"- doing step in idle state");
    
    // no ai is selected now
    assert( !controller.ai_active );
    
    // select ai
    for( var i=controller.ai_data.length-1; i>=0; i-- ){
      if( controller.ai_data[i].pid === model.turnOwner ){
        controller.ai_active = controller.ai_data[i];
      }
    }
    
    // ai is selected now
    assert( controller.ai_active );
    
    return "SET_UP_AI_TURN";
  }},

  // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  // Start turn actions. At the moment nothing will be done here too. Later this could
  // be the place to make a first analyse of the battlefield and the enemy players.
  // I think this will be a good place to define the long term task of the AI player
  // based on the situation on the battlefield.
  //

  SET_UP_AI_TURN:{ tick: function(){
    util.log(controller.ai_spec,"- setup turn");

    return "PHASE_PREPARE_SEARCH_UNIT_TASKS";
  }},

  // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  // Prepares the search tasks for units step.
  //

  PHASE_PREPARE_SEARCH_TASKS: { tick: function(){
    util.log(controller.ai_spec,"- prepare search unit tasks");

    var data  = controller.ai_loopHolder_;
    data.i    = model.unit_firstUnitId( model.round_turnOwner );
    data.e    = model.unit_lastUnitId(  model.round_turnOwner )+MAX_PROPERTIES; // units+properties
    data.prop = MAX_UNITS_PER_PLAYER;                                           // position of the first prop

    return "PHASE_SEARCH_TASK";
  }},

  // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  // Searches proper tasks for every unit of the ai player.
  //

  PHASE_SEARCH_TASK: { tick: function(){
    util.log(controller.ai_spec,"- search task");
    
    var loopData   = controller.ai_loopHolder_;
    var scoreData  = controller.ai_scoreDataHolder_;
    var actionData = controller.ai_actionDataHolder_;

    // clean action data
    actionData.source          = null;
    actionData.target          = null;
    actionData.selectionTarget = null;
    actionData.moveSelection   = null;
    actionData.attackSelection = null;

    // prepare data object
    if( loopData.i <= loopData.e ){
      
      if( loopData.i < loopData.prop ){
        
        // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
        // unit check  
        //
    
        util.log(controller.ai_spec,"- ..for unit",loopData.i);
        
        
        
      } else {
        
        // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
        // property check
        //
        
        util.log(controller.ai_spec,"- ..for property",loopData.i);
        
        
        
      }
    } else {
      
      // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
      // map check
      //
      
      util.log(controller.ai_spec,"- ..for map");
      
    }
    
    // do all checks
    var cScore = -1;
    var nScore = -1;
    var i = 0;
    var e = controller.ai_CHECKS.length;
    while( i<e ){
      
      // call scoring
      nScore = controller.ai_CHECKS[i].scoring(scoreData);
      
      // new object got better scores -> select it's action
      if( nScore > cScore ){

        actionData.source          = scoreData.source;
        actionData.target          = scoreData.target;
        actionData.selectionTarget = scoreData.selectionTarget;
        actionData.moveSelection   = scoreData.moveSelection;
        actionData.attackSelection = scoreData.attackSelection;
      }
      
      i++;
    }
    
    loopData.i++;
    return ( loopData.i <= loopData.e+1 )? "PHASE_SEARCH_TASK" : "PHASE_FLUSH_TASK";
  }},

  // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  // Flushes the current selected task, which is the action with the highest priority.
  // The ai machine moves into the tear down state when the flush state calls an 
  // endAiTurn action or no valid action could be found.
  //

  PHASE_FLUSH_TASK: { tick: function(){
    util.log(controller.ai_spec,"- flush most important command");

    return "PHASE_CHECK_LEFT_TASKS";
  }},

  // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  // The ai turn ends here. 
  //

  TEAR_DOWN_AI_TURN:{ tick: function(){
    util.log(controller.ai_spec,"- tear down turn");
    
    // release reference
    controller.ai_active = null;

    return "IDLE";
  }}

  // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

});
controller.ai_machine.state = "IDLE";

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Ai action objects. This objects works more or less like rules in a rule engine because of
// the scoring model. Every action can define a score based on the situation on the battlefield. 
// The ai does the action with the highest score first.
//

controller.ai_definedRoutine({
  key        : "endTurn",
  mapAction  : true,
  endsAiTurn : true,

  // 1 as low score to be sure that end turn will be used at last by the AI
  scoring : function( data ){
    if( data.unit || data.property ) return -1;
    return 1;
  },

  prepare : function( data ){
    controller.action_objects.nextTurn.invoke(data);
  }
});