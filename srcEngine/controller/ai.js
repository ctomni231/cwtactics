// DumbBoy (DB) is the old forgotten AI from MiniWars. We will resurrected him for Custom Wars: Tactics. 
// Our target is to build a first version of a dynamic AI that can change it's tasks at runtime
// in relation to the situation on the battlefield. DumbBoy won't be a next super gen AI. This
// is not our task ( we wouldn't have enough time to do this... to be true :P ). It should be more
// a concept of a clean designed AI that can be extended by differen't people. That's why DumbBoy gets
// a modular and clean design instead of hacky code. 
//
// TASKS 0.1: (v. 0.3.5)
//  - DB builds objects on his properties
//  - When neutral properties are left on the map then DB will
//    build at least one capturer unit
//  - DB tries to fulfill a percentage (AIR,VS,TANKS etc.)
//  - Damaged units (<4HP) may move back to properties for repair
//  - Units move to the enemy players
//  - Capturers try to capture properties or move near to them
//  - DB attacks with units in range
//  - DB tries to position indirect units
//
// TASKS 0.2: (v. 0.4)
//  - DB should define long term tasks for himself to 
//    organize his actions to fulfill this tasks
//  - DB can ignore long term tasks to handle difficult 
//    situations dynamical
//  - Long term tasks changes during game play
//  - DB should analyse the objects that a player owns and uses to
//    counter play it (without cheating through the fog)
//  - DB should use transports to reach far away properties
//  - DB uses CO powers
//
controller.ai_spec = "DumbBoy [0.1]";

// The memory of the ai. Holds different data of the game state for all ai controlled 
// player instances.
//
controller.ai_data = util.list( MAX_PLAYER-1, function(){
  return {
    pid         : INACTIVE_ID,
    prio        : [
      controller.ai_CHECKS.MOVE_TO_HQ,
      controller.ai_CHECKS.MOVE_TO_ENEMY,
      controller.ai_CHECKS.REPAIR,
      controller.ai_CHECKS.ATTACK,
      controller.ai_CHECKS.CAPTURE
    ],
    hlp         : { 
      pid:-1,
      uid:-1,
      x:-1,y:-1
    },
    taskCount   : 0,
    markedTasks : util.list( MAX_UNITS_PER_PLAYER )
  };
});

// Steps for the ai.
//
controller.ai_CHECKS  = {
  CAPTURE       : 0,
  ATTACK        : 1,
  MOVE_TO_ENEMY : 2,
  MOVE_TO_HQ    : 3,
  REPAIR        : 4
};

// Targets for the ai.
//
controller.ai_TARGETS = {
  NOTHING             : 0,
  DEFEND_SELF         : 1,
  ATTACK_ENEMY_HQ     : 2,
  CAPTURE_NEXT_PROP   : 3
};

// Link to the current active player instance.
//
controller.ai_active = null;

controller.ai_searchNeutralProp_ = function( x,y, data ){
  if( data.uid)
  var prop = model.property_posMap[x][y];
  if( prop && prop.owner !== data.pid ){
    
  }
};

// The state machine of the ai, contains the whole decision making process.
//
//    START               => IDLE
//    IDLE                => START_TURN
//    START_TURN          => PHASE_SEARCH_TASKS
//    PHASE_SEARCH_TASKS  => PHASE_CHECK_TASKS
//    PHASE_CHECK_TASKS   => PHASE_FLUSH_TASK
//    PHASE_FLUSH_TASK    => PHASE_SEARCH_TASKS (when actors are left)
//                           BUILD_OBJECTS      (when no actors are left)
//    BUILD_OBJECTS       => END_TURN
//    END_TURN            => IDLE
//
controller.ai_machine = util.stateMachine({

  // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

  IDLE:{ tick: function(){
    // TODO: setup meta data

    return "START_TURN";
  }},

  // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

  START_TURN:{ tick: function(){
    return "END_TURN";
  }},

  // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

  PHASE_SEARCH_TASKS: { tick: function(){
    var type;
    var unit;
    var found;
    var prio = controller.ai_active.prio;

    // check all actable objects
    var i = model.unit_firstUnitId( model.round_turnOwner )
    var e = model.unit_lastUnitId( model.round_turnOwner );
    for( ; i<=e; i++ ){

      unit = model.units[i];
      if( !unit ) continue;

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
              controller.ai_active.hlp.x    = -1;
              controller.ai_active.hlp.y    = -1;
              
              model.map_doInRange(unit.x,unit.y,2,controller.ai_active.hlp);
              
              if( controller.ai_active.hlp.x !== -1 ){
                controller.ai_active.markedTask[i] = controller.ai_TARGETS.CAPTURE_NEXT_PROP;
                found = true;
              }
            }
            break;

          // ++++++++++++++++++++++++++++++++++++++++++++++++

          case controller.ai_CHECKS.ATTACK :
            break;

          // ++++++++++++++++++++++++++++++++++++++++++++++++

          case controller.ai_CHECKS.MOVE_TO_ENEMY :
            break;

          // ++++++++++++++++++++++++++++++++++++++++++++++++

          case controller.ai_CHECKS.MOVE_TO_HQ :
            break;

          // ++++++++++++++++++++++++++++++++++++++++++++++++

          case controller.ai_CHECKS.REPAIR :
            break;

          // ++++++++++++++++++++++++++++++++++++++++++++++++

        }

        if( found ) break;
      }
    }
  }},

  // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

  PHASE_CHECK_TASKS: { tick: function(){
    return "PHASE_FLUSH_TASK";
  }},

  // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

  PHASE_FLUSH_TASK: { tick: function(){

    // TODO: priority ?
    // flush a command from the tasks list
    var list = controller.ai_active.markedTasks;
    for( var i=MAX_UNITS_PER_PLAYER-1; i>=0; i-- ){
      if( list[i] !== controller.ai_TARGETS.NOTHING ){
        
        // do it
        
        // decrease counter
        controller.ai_active.taskCount--;
        
        break;
      }
    }
    
    // are commands left ?
    return ( controller.ai_active.taskCount > 0 )? "PHASE_FLUSH_TASK" : "BUILD_OBJECTS";
  }},

  // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

  BUILD_OBJECTS:{ tick: function(){

    // make stupid things
    for( var i=model.properties.length-1; i>=0; i-- ){
      if( model.properties[i].owner === model.turn_owner ){
        controller.action_sharedInvoke("buildUnit",[i,"INFT"]);
      }
    };

    return "END_TURN";
  }},

  // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

  END_TURN:{ tick: function(){

    // end the ai turn here, it's nothing more to do now
    controller.action_sharedInvoke("nextTurn",[]);

    return "IDLE";
  }}

  // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

});

// Returns `true` when the given player id is not controlled by the AI, else `false`.
//
controller.ai_isHuman = function(pid){

  // search in all slots
  for( var i=controller.ai_data.lenght-1; i>=0; i-- ){
    if( controller.ai_data[i].pid === pid ) return false;
  }

  // no slot is used by the pid -> human
  return true;
};
