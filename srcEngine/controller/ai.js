// DumbBoy (DB) is the old forgotten AI from MiniWars. We will resurrected him for Custom Wars: Tactics. 
// Our target is to build a first version of a dynamic AI that can change it's tasks at runtime
// in relation to the situation on the battlefield. DumbBoy won't be a next super gen AI. This
// is not our task ( we wouldn't have enough time to do this... to be true :P ). It should be more
// a concept of a clean designed AI that can be extended by differen't people. That's why DumbBoy gets
// a modular and clean design instead of hacky code. 
//
// TASKS 0.25: DO SOMETHING ON THE BATTLEFIELD (v. 0.3.5)
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
// TASKS 0.5: BEING DYNAMIC AND LESS CALCULATE ABLE (v. 0.4)
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
// TASKS 0.75: ANALYSE YOUR ENEMIES (v. 0.5)
//
controller.ai_spec = "DumbBoy [0.25]";

// Sets the default priority in a priority list of a AI controlled player.
//
controller.ai_orderDefaultPrio = function(list){
  
  // first try to capture if you can 
  // because nothing is more important
  // than the amount of income
  list[5] = controller.ai_CHECKS.CAPTURE;
  
  // try to attack enemy targets
  list[4] = controller.ai_CHECKS.ATTACK;
  
  // if above not fits but a unit is damaged then it 
  // should be repaired by join or repair
  list[3] = controller.ai_CHECKS.JOIN;
  list[2] = controller.ai_CHECKS.REPAIR;
  
  // fallback actions when no special actions matches are trying 
  // to move near the enemy or the enemy HQ 
  // (TODO: could be merged to one check)
  list[1] = controller.ai_CHECKS.MOVE_TO_ENEMY;
  list[0] = controller.ai_CHECKS.MOVE_TO_HQ;
  
  return list;
};

// The memory of the ai. Holds different data of the game state for all ai controlled 
// player instances.
//
controller.ai_data = util.list( MAX_PLAYER-1, function(){
  return {
    
    // The id of the controlled player.
    //
    pid         : INACTIVE_ID,
    
    // Controls the priority of the checks. Every AI player can independtly handle
    // it's own priority list. This list reorderable in relation to the situation 
    // on the battlefield. Needed for version 0.2 of dumbBoy to change it's handling
    // dynamically at runtime.
    //
    prio        : controller.ai_orderDefaultPrio([0,0,0,0,0,0]),
    
    // Data transfer object for several checks during a AI turn.
    // TODO: can be transfered to a single object in the module
    //
    hlp         : { 
      pid:-1,
      move: null,
      uid:-1,
      x:-1,
      y:-1
    },
    
    // number of tasks in the list
    //
    taskCount   : 0,
    
    // task list for the unit objects
    //
    markedTasks : util.list( MAX_UNITS_PER_PLAYER )
  };
});

// Check modes of the AI. Every mode realizes a specialized check for a situation. Every
// situation can cause different actions for units.
//
controller.ai_CHECKS  = {
  CAPTURE       : 0,
  ATTACK        : 1,
  MOVE_TO_ENEMY : 2,
  MOVE_TO_HQ    : 3,
  REPAIR        : 4,
  JOIN          : 5
};

// Target actions for the AI. These ones are the result of the checks above. Every unit can 
// have one of this tasks.
//
controller.ai_TARGETS = {
  NOTHING             : 0,
  DEFEND_SELF         : 1,
  ATTACK_ENEMY_HQ     : 2,
  CAPTURE_NEXT_PROP   : 3,
  JOIN                : 4
};

// Link to the current active player instance.
//
controller.ai_active = null;

// Searches for neutral or enemy properties in range and marks them if found.
//
controller.ai_searchNeutralProp_ = function( x,y, data ){
  // TODO search best property
  
  var prop = model.property_posMap[x][y];
  if( prop && prop.owner !== data.pid ){
    
    data.x = x;
    data.y = y;
    
    // stop here
    return false;
  }
};

// Searches for a good join target.
//
controller.ai_searchJoinTarget_ = function( x,y, data ){
  // check all and search best target
  
  var sunit = model.units[data.uid];
  var unit = model.unit_posMap[x][y];
  if( unit && unit.type === sunit.type && unit.owner === data.pid ){
    if( unit.hp <= 50 ||            // other unit is damaged a lot too
       (unit.hp+sunit.hp < 124) ){  // both together drops max. 25 health to cash (TODO: if cash is low join more)
         
      data.x = x;
      data.y = y;
      
      // stop here
      return false;
    }
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
        switch(){
          
          // +++++++++++++++++++++++++++++++++++++++++++++++++
          
          case controller.ai_TARGETS.JOIN:
            break;
            
          // +++++++++++++++++++++++++++++++++++++++++++++++++  
        }
        
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
