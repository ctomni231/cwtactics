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
controller.ai_CHECKS = {};

// Like a copy from the state machine data to mock user action data. Every AI
// action should be checked against the real game command objects to prevent
// errors and an unfair AI.
//
controller.ai_actionHolder_ = {
  source          : null,
  target          : null,
  selectionTarget : null,
  moveSelection   : null,
  attackSelection : null,
  ai_data         : {
    step_i:-1,
    step_e:-1
  }
};

// Registers a AI action.
//
controller.ai_definedRoutine = function(impl){
  assert( util.isString(impl.key) );
  assert( util.isInt(impl.baseScore) );
  assert( controller.ai_CHECKS.hasOwnProperty(impl.key) );
  assert( util.isFunction(impl.scoring) );
  assert( util.isFunction(impl.prepare) );
  
  controller.ai_CHECKS[impl.key] = impl;
  delete impl.key;
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
//    NONE                        => IDLE
//
//    IDLE                        => SET_UP_AI_TURN
//
//    SET_UP_AI_TURN              => PHASE_PREPARE_SEARCH_TASKS
//
//    PHASE_PREPARE_SEARCH_TASKS  => PHASE_SEARCH_TASKS
//
//    PHASE_SEARCH_TASK           => PHASE_SEARCH_TASK              (when    actors left)
//                                   PHASE_FLUSH_TASK               (when no actors left)
//
//    PHASE_FLUSH_TASK            => PHASE_PREPARE_SEARCH_TASKS     (when normal action)
//                                => TEAR_DOWN_AI_TURN              (when endTurn action)
//
//    TEAR_DOWN_AI_TURN           => IDLE
//
controller.ai_machine = util.stateMachine({

  NONE: { tick: function() {
    util.log(controller.ai_spec,"- initializing",controller.ai_spec);
    
    return "IDLE";
  }},

  // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  // This state must be active at the start of a AI turn. If not then something gone
  // wrong. At least no logic will be done here. It only symbolizes a meta state to
  // say "Hey I'm ready for a new AI turn".
  //

  IDLE:{ tick: function(){
    util.log(controller.ai_spec,"- doing step in idle state");
    // TODO: setup meta data

    assert( !controller.ai_active );

    for( var i=controller.ai_data.length-1; i>=0; i-- ){
      if( controller.ai_data[i].pid === model.turnOwner ){
        controller.ai_active = controller.ai_data[i];
      }
    }

    assert( controller.ai_active );

    return "START_TURN";
  }},

  // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  // Start turn actions. At the moment nothing will be done here too. Later this could
  // be the place to make a first analyse of the battlefield and the enemy players.
  // I think this will be a good place to define the long term task of the AI player
  // based on the situation on the battlefield.
  //

  START_TURN:{ tick: function(){
    util.log("AI:: starting turn");

    return "PHASE_PREPARE_SEARCH_TASKS";
  }},

  // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  // Prepares the search step.
  //

  PHASE_PREPARE_SEARCH_TASKS: { tick: function(){
    util.log("AI:: searching tasks for objects");

    controller.ai_actionHolder_.ai_data.step_i = model.unit_firstUnitId( model.round_turnOwner );
    controller.ai_actionHolder_.ai_data.step_e = model.unit_lastUnitId( model.round_turnOwner );

    return "PHASE_SEARCH_TASK";
  }},

  // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  // Searches proper tasks for every actor of the AI player. This state only searces one
  // task for one unit per event `tick` and returns to itself when left actors has to
  // be checked after the event, else it returns to flush tasks.
  //

  PHASE_SEARCH_TASKS: { tick: function(){

    var type;
    var unit;
    var found;
    var prio    = controller.ai_active.prio;
    var data    = controller.ai_actionHolder_.ai_data;
    var i       = data.step_i;
    

    unit = model.units[i];
    if( unit && model.actions_canAct(i) ){
      util.log("AI:: searching task for unit",i);

      // TODO: generate move path here

      type = unit.type;

      // check situation and decide what to do
      var pi = prio.length-1;
      for( ; pi>=0 ; pi-- ){

        found = false;
        switch( prio[pi] ){

          // ++++++++++++++++++++++++++++++++++++++++++++++++
          // Check possible capture targets here. Capturing
          // units should always target neutral and enemy
          // properties, to capture them. This does not mean
          // that capturing units should only capture, but
          // they should be primary used by AI for that.
          //

          case controller.ai_CHECKS.CAPTURE :
            if( type.captures ){
              controller.ai_active.hlp.pid  = unit.owner;
              controller.ai_active.hlp.uid  = i;
              controller.ai_active.hlp.x    = -1;
              controller.ai_active.hlp.y    = -1;

              model.map_doInSelection(
                controller.ai_active.hlp.move,
                controller.ai_searchNeutralProp_,
                controller.ai_active.hlp
              );

              if( controller.ai_active.hlp.x !== -1 ){
                controller.ai_active.markedTask[i] = controller.ai_TARGETS.JOIN;
                found = true;
              }
            }

            break;

          // ++++++++++++++++++++++++++++++++++++++++++++++++

          case controller.ai_CHECKS.ATTACK :

            // if the unit can move and attack then do it
            if( model.battle_isDirectUnit(i) || model.battle_isBallisticUnit(i) ){

              // TODO: use attack selection here
              model.map_doInSelection(
                controller.ai_active.hlp.move,
                controller.ai_searchBatleTarget_,
                controller.ai_active.hlp
              );
            }
            // indirect
            else if( model.battle_isIndirectUnit(i) ){

            }
            // no battle unit
            else{

            }
            break;

          // ++++++++++++++++++++++++++++++++++++++++++++++++

          case controller.ai_CHECKS.MOVE_TO_ENEMY :
            break;

          // ++++++++++++++++++++++++++++++++++++++++++++++++

          case controller.ai_CHECKS.MOVE_TO_HQ :
            break;

          // ++++++++++++++++++++++++++++++++++++++++++++++++
          // If unit is damaged a lot, then try to repair it
          // by joining two units of the same type togehter.
          //

          case controller.ai_CHECKS.JOIN :
            if( unit.hp < 50 ){
              controller.ai_active.hlp.pid  = unit.owner;
              controller.ai_active.hlp.x    = -1;
              controller.ai_active.hlp.y    = -1;

              model.map_doInSelection(
                controller.ai_active.hlp.move,
                controller.ai_searchJoinTarget_,
                controller.ai_active.hlp
              );

              if( controller.ai_active.hlp.x !== -1 ){
                controller.ai_active.markedTask[i] = controller.ai_TARGETS.CAPTURE_NEXT_PROP;
                found = true;
              }
            }
            break;

          // ++++++++++++++++++++++++++++++++++++++++++++++++
          // If unit is damaged a lot, then try to repair it
          // by moving onto a property with healing ability.
          //

          case controller.ai_CHECKS.REPAIR :

            // when unit is low on health then try to reach the next repair property
            if( unit.hp < 50 ) found = true;

            break;

          // ++++++++++++++++++++++++++++++++++++++++++++++++

        }

        if( found ) break;
      }
    }

    data.step_i++;
    return ( data.step_i <= data.step_e )? "PHASE_SEARCH_TASK" : "PHASE_FLUSH_TASK";
  }},

  // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  // Flushes one task from the list. At the moment the first proper task will be choosen
  // and flushed.
  //

  PHASE_FLUSH_TASK: { tick: function(){
    util.log("AI:: flushing task into command stack");

    // flush a command from the tasks list
    var list = controller.ai_active.markedTasks;
    for( var i=MAX_UNITS_PER_PLAYER-1; i>=0; i-- ){
      if( list[i] !== controller.ai_TARGETS.NOTHING ){
        var action;

        // Do the action by mocking a user action object and checking
        // it against the game commands (try to be like a real player)
        //
        switch(list[i]){

          // +++++++++++++++++++++++++++++++++++++++++++++++++

          case controller.ai_TARGETS.ATTACK:
            break;

          // +++++++++++++++++++++++++++++++++++++++++++++++++

          case controller.ai_TARGETS.CAPTURE:
            break;

          // +++++++++++++++++++++++++++++++++++++++++++++++++

          case controller.ai_TARGETS.WAIT:
            controller.action_objects.wait;
            break;

          // +++++++++++++++++++++++++++++++++++++++++++++++++

          case controller.ai_TARGETS.JOIN:
            break;

          // +++++++++++++++++++++++++++++++++++++++++++++++++
        }

        // TODO: use action builder here
        assert( util.isUndefined(action.condition) || action.condition(controller.ai_actionHolder_) );
        action.invoke(controller.ai_actionHolder_);

        // clear slot
        list[i] = controller.ai_TARGETS.NOTHING;

        // decrease counter
        controller.ai_active.taskCount--;

        break;
      }
    }

    return "PHASE_CHECK_LEFT_TASKS";
  }},

  // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  // If further tasks are left in the stack then re-analyse the actions for all other
  // units. This is quite expensive!
  //
  // The extrem case means something like 50 units on the field. If the AI follows this
  // pattern it has to check 50 units first, act with one and recheck the others...
  //
  // We get the formular `(n*(n+1))/2 while n=50`. As long every frame has 16ms, this means
  // an extrem AI turn needs around 20400ms to calculate all actions. I think it's okay
  // but can be optimized.
  //
  // At the moment this algorithm is useless because the actions will be done by iteration
  // from unit 0 to 50 ( in relation to the player ). That means you could optimize this by
  // simply doing it with the costs of `n` instead of `(n(n+1))/2`.
  // Crecen`s intention of making an AI is more complex, that's why this algorithm is used.
  //
  // Why is this pattern better?
  // Because the AI does every action after re-analyse thesituation which results in better
  // anaylse->action situations. If we add priority to the calculated tasks then we get this
  // benefit. The AI calculates all possible tasks like before, but does the action with
  // the best resulting outcome first and recalculates then.
  //
  // In order to optimize that:
  //
  // Some actions like capture changes the situation on the battlefield in a differen't manner.
  // E.g. if you attack an unit and loose a lot of HP you may create a `join` situation. That
  // means `attack` creates a new game situation. Also if you kill an enemy unit you may nullify
  // the reason to move an indirect unit to (x,y). Something like build unit or capture changes
  // the battlefield but not other actions. Thats why this actions could be done as bulk process
  // without re-checking the others.
  //
  //    ==> At all test will show how long this system will need to do actions in an extrem case
  //        Maybe this `20s` window isn't dramatic (whith animations anyway :P)
  //

  PHASE_CHECK_LEFT_TASKS:{ tick: function(){
    util.log("AI:: checking left tasks");

    // when commands left, then re-analyse the actions for the other
    // units because the game situation has changed
    return ( controller.ai_active.taskCount > 0 )? "PHASE_PREPARE_SEARCH_TASKS" : "BUILD_OBJECTS";
  }},

  // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  // The AI should build things here. :P
  //

  BUILD_OBJECTS:{ tick: function(){
    util.log("AI:: producing units");

    // make stupid things
    for( var i=model.properties.length-1; i>=0; i-- ){
      if( model.properties[i].owner === model.turn_owner ){
        // controller.action_sharedInvoke("buildUnit",[i,"INFT"]);
      }
    };

    return "END_TURN";
  }},

  // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  // Turn end.
  //

  END_TURN:{ tick: function(){
    util.log("AI:: ending turn");

    // end the ai turn here, it's nothing more to do now
    controller.action_sharedInvoke("nextTurn",[]);

    // release reference
    controller.ai_active = null;

    return "IDLE";
  }}

  // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

});

// initializing AI state machine
controller.ai_machine.event("tick");

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Ai action objects. This objects works more or less like rules in a rule engine because of
// the scoring model. Every action can define a score based on the situation on the battlefield. 
// The ai does the action with the highest score first.
//

controller.ai_definedRoutine({
  key:"endTurn",
  mapAction:true,
  endsAiTurn:true,
  
  scoring:function( data ){
    // 1 as low score to be sure that end turn will be used at last by the AI
    return 1; 
  },
  
  prepare:function( data ){
  }
});

controller.ai_definedRoutine({
  key:"moveToNextProperty",
  unitAction:true,
  
  scoring:function( data ){
    return 2;
  },
  
  prepare:function( data ){
  }
});
