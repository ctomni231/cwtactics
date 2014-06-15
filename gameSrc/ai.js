"use strict";

// DumbBoy (DB) is the old forgotten AI from MiniWars. We will resurrected him for Custom Wars: Tactics.
// Our target is to build a first version of a dynamic AI that can change it's tasks at runtime
// in relation to the situation on the battlefield. DumbBoy won't be a next super gen AI. This
// is not our task ( we wouldn't have enough time to do this... to be true :P ). It should be more
// a concept of a clean designed AI that can be extended by different people. That's why DumbBoy gets
// a clean design instead of hacky code.
//
// **TASKS 0.10: DO SOMETHING ON THE BATTLEFIELD (v. 0.3.5)**
//
//  - DB builds objects on his properties
//  - Capturers try to capture properties or move near to them
//  - DB attacks with units in range
//
// **TASKS 0.25: DO SOMETHING MORE (v. 0.3.6)**
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
/*

controller.ai_spec = AI_VERSION;

// Some base scores.
//
controller.ai_SCORE = {
  LOW      : 100,
  NORMAL   : 200,
  HIGH     : 300,
  CRITICAL : 999
};

// Contains all check_/action logics for the DumbBoy ai.
//
controller.ai_CHECKS = [];

// The memory of the ai. Holds different aw2 of the game state for all ai controlled
// player instances.
//
controller.ai_data = util.list( MAX_PLAYER, function(){
  return {
    pid: cwt.INACTIVE
  };
});

//
//
controller.ai_loopHolder_ = {
  i    : -1,
  e    : -1,
  prop : -1,
  score : -1
};

//
//
controller.ai_scoreDataHolder_ = {
  source          : Object.create( controller.TaggedPosition ),
  target          : Object.create( controller.TaggedPosition ),
  targetselection : Object.create( controller.TaggedPosition ),
  selection       : util.selectionMap( MAX_SELECTION_RANGE * 4 + 1 ),
  move            : util.list(MAX_SELECTION_RANGE, cwt.INACTIVE),
  action          : {
    selectedSubEntry: ""
  },
  cacheInt        : 0
};

//
//
controller.ai_actionDataHolder_ = {
  source          : Object.create( controller.TaggedPosition ),
  target          : Object.create( controller.TaggedPosition ),
  targetselection : Object.create( controller.TaggedPosition ),
  selection       : util.selectionMap( MAX_SELECTION_RANGE * 4 + 1 ),
  used            : false,
  move            : util.list(MAX_SELECTION_RANGE, cwt.INACTIVE),
  check_index     : -1,
  endsAiTurn      : false,
  action          : {
    selectedSubEntry: ""
  },
  cacheInt        : 0
};

//
//
controller.ai_reset = function(){
  for( var i= 0, e=MAX_PLAYER; i<e; i++ ){
    controller.ai_data[i].pid = cwt.INACTIVE;
  }
};

//
//
controller.ai_active = null;

// Registers a AI action.
//
controller.ai_defineRoutine = function(impl){
  cwt.assert( util.isString(impl.key) );
  cwt.assert( !controller.ai_CHECKS.hasOwnProperty(impl.key) );
  cwt.assert( util.isFunction(impl.scoring) );
  cwt.assert( util.isFunction(impl.prepare) );

  controller.ai_CHECKS.push(impl);
};

// Returns a AI action object.
//
controller.ai_getRoutine = function(key){
  cwt.assert( util.isString(key) );

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
  cwt.assert( model.player_isValidPid(pid) );

  for (var i = 0; i < controller.ai_data.length; i++) {

    // if the slot is empty then occupy it
    if( controller.ai_data[i].pid === cwt.INACTIVE ){
        controller.ai_data[i].pid = pid;
        return;
    }
  }
};

// Registers a player id as ai controlled instance.
//
controller.ai_deregister = function(pid){
  for (var i = 0; i < controller.ai_data.length; i++) {

    // if the slot is empty then occupy it
    if( controller.ai_data[i].pid === pid ){
        controller.ai_data[i].pid = cwt.INACTIVE;
        return;
    }

  }

  cwt.assert(false,"player isn't ai controlled");
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

  // ++++++++++++++++++++++++++++++++++++++++
  // This state must be active at the start
  // of a AI turn. If not then something gone
  // wrong. At least no logic will be done
  // here. It only symbolizes a meta state to
  // say "Hey I'm ready for a new AI turn".
  //

  IDLE:{ tick: function(){
    util.log(controller.ai_spec,"- doing step in idle state");

    // no ai is selected now
    cwt.assert( !controller.ai_active );

    // select ai
    for( var i=controller.ai_data.length-1; i>=0; i-- ){
      if( controller.ai_data[i].pid === model.round_turnOwner ){
        controller.ai_active = controller.ai_data[i];
      }
    }

    // ai is selected now
    cwt.assert( controller.ai_active );

    return "SET_UP_AI_TURN";
  }},

  // ++++++++++++++++++++++++++++++++++++++++
  // Start turn actions. At the moment
  // nothing will be done here too. Later
  // this could be the place to make a first
  // analyse of the battlefield and the enemy
  // players. I think this will be a good
  // place to define the long term task of
  // the AI player based on the situation
  // on the battlefield.
  //

  SET_UP_AI_TURN:{ tick: function(){
    util.log(controller.ai_spec,"- setup turn");

    return "PHASE_PREPARE_SEARCH_TASKS";
  }},

  // ++++++++++++++++++++++++++++++++++++++++
  // Prepares the search tasks for units step.
  //

  PHASE_PREPARE_SEARCH_TASKS: { tick: function(){
    util.log(controller.ai_spec,"- prepare search unit tasks");

    var data  = controller.ai_loopHolder_;
    data.i    = model.unit_firstUnitId( model.round_turnOwner );
    data.e    = model.unit_lastUnitId(  model.round_turnOwner )+MAX_PROPERTIES+1; // units+properties
    data.prop = data.i+MAX_UNITS_PER_PLAYER;                                      // position of the first prop
    data.score = -1;

    return "PHASE_SEARCH_TASK";
  }},

  // ++++++++++++++++++++++++++++++++++++++++
  // Searches proper tasks for every unit
  // of the ai player.
  //

  PHASE_SEARCH_TASK: { tick: function(){
    util.log(controller.ai_spec,"- search task");

    var loopData   = controller.ai_loopHolder_;
    var scoreData  = controller.ai_scoreDataHolder_;
    var actionData = controller.ai_actionDataHolder_;

    while( true ){

      // clean score aw2
      scoreData.source.set(-1,-1);
      scoreData.target.set(-1,-1);
      scoreData.targetselection.set(-1,-1);
      scoreData.selection.setCenter(0,0,-1);
      scoreData.used = false;
      scoreData.selectedSubEntry = "";
      scoreData.cacheInt         = -1;

      // prepare aw2 object
      var dataTp = -1;
      if( loopData.i < loopData.e ){
        if( loopData.i < loopData.prop ){
          // unit check_

          //util.log(controller.ai_spec,"- ..for unit",loopData.i);

          var unit = model.unit_data[loopData.i];
          if( unit.owner !== cwt.INACTIVE && unit.loadedIn === cwt.INACTIVE && 
              model.actions_canAct(loopData.i)){
            dataTp = 0;
            scoreData.source.set( unit.x, unit.y );
            model.move_fillMoveMap( scoreData.source, scoreData.selection );
          }


        } else {
          // property check_

          //util.log(controller.ai_spec,"- ..for property",loopData.i);

          // grab property; convert relative id to absolute id
          var prop = model.property_data[loopData.i-loopData.prop];
          if( prop.owner === controller.ai_active.pid ){
            dataTp = 1;
            scoreData.source.set( prop.x, prop.y );
          }
        }

      } else {
        // map check_

        //util.log(controller.ai_spec,"- ..for map");
        dataTp = 2;
      }

      // do all checks
      var cScore  = -1;
      var nScore  = -1;
      var i       = 0;
      var e       = controller.ai_CHECKS.length;
      if( dataTp !== -1 ){
        while( i<e ){
          var check_ = controller.ai_CHECKS[i];
          i++;

          // meta check_
          if( dataTp !== 0 && check_.unitAction ) continue;
          if( dataTp !== 1 && check_.propAction ) continue;
          if( dataTp !== 2 && check_.mapAction ) continue;

          // call scoring
          nScore = check_.scoring(scoreData,loopData.score);

          // new object got better scores -> select it's action
          if( nScore > loopData.score ){
            actionData.source.grab(          scoreData.source)
            actionData.target.grab(          scoreData.target)
            actionData.targetselection.grab( scoreData.targetselection)
            actionData.selection.grab(       scoreData.selection);
            actionData.used             = true;
            actionData.check_index      = i-1;
            actionData.endsAiTurn       = (check_.endsAiTurn === true);
            actionData.cacheInt         = scoreData.cacheInt;
            actionData.move.grabValues(scoreData.move);
            loopData.score              = nScore;
            actionData.action.selectedSubEntry = scoreData.action.selectedSubEntry;
          }
        }
      }

      loopData.i++;

      // jump out of the loop when
      //  a) you find a valid action to do
      //  b) no object can handle ( just to be safe, should not happen )
      if( ( dataTp !== -1 && nScore !== -1 ) || (loopData.i > loopData.e) ) break;
    }

    return ( loopData.i <= loopData.e )? "PHASE_SEARCH_TASK" : "PHASE_FLUSH_TASK";
  }},

  // ++++++++++++++++++++++++++++++++++++++++
  // Flushes the current selected task, which
  // is the action with the highest priority.
  // The ai machine moves into the tear down
  // state when the flush state calls an
  // endAiTurn action or no valid action
  // could be found.
  //

  PHASE_FLUSH_TASK: { tick: function(){
    util.log(controller.ai_spec,"- flush most important command");

    var actionData = controller.ai_actionDataHolder_;
    if( actionData.used ){

      var action = controller.ai_CHECKS[ actionData.check_index ];
      if( this.DEBUG ) util.log("invoke action",action.key);

      // do actions
      action.prepare( actionData );

      // end turn with an end turn action
      return (actionData.endsAiTurn === true)? "TEAR_DOWN_AI_TURN" : "PHASE_PREPARE_SEARCH_TASKS";
    }

    throw Error("at least one action must explicit ending AI turn");
  }},

  // ++++++++++++++++++++++++++++++++++++++++
  // The ai turn ends here.
  //

  TEAR_DOWN_AI_TURN:{ tick: function(){
    util.log(controller.ai_spec,"- tear down turn");

    // release reference
    controller.ai_active = null;

    // end turn now
    controller.action_objects.nextTurn.invoke();

    return "IDLE";
  }}

  // ++++++++++++++++++++++++++++++++++++++++

});
controller.ai_machine.state = "IDLE";

  *//*
util.scoped(function(){

  var menu = {
    data:util.list(20,null),

    size:0,

    clear:function(){
      this.size = 0;
    },

    addEntry: function( el ){
      if( this.size === 20 ) throw Error("full");
      this.data[this.size] = el;
      this.size++;
    }
  };

  //
  //
  controller.ai_defineRoutine({
    key        : "buildUnits",
    propAction : true,

    scoring : function( data ){
      var prid = data.source.propertyId;

      if( data.source.unit ) return -1;

      // isn't a factory
      if( !model.factory_isFactory(prid)) return -1;

      // there aren't any unit slots left or the man power is zero
      if( !model.factory_canProduceSomething(prid,model.property_data[prid].owner) ){
        if( this.DEBUG ) util.log("cannot build capturers because no slots left or no man power left");
        return -1;
      }

      menu.clear();
      model.factoryGenerateBuildMenu(prid, menu);

      // stuff buildable ?
      if( menu.size === 0 ) return -1;

      // search capturers
      var gold = model.player_data[data.source.property.owner].gold;
      var rand = parseInt(Math.random()*menu.size*2,10);
      var oldRand = rand;
      while(true){
        for( var i=0, e=menu.size; i<e; i++ ){
          var type = model.data_unitSheets[menu.data[i]];
          if( type.cost <= gold ){
            rand--;
            if( rand < 0 ){
              data.action.selectedSubEntry = type.ID;
              return 20;
            }
          }
        }

        // not enough money for something...
        if( rand === oldRand ) return -1;

      }

      return -1;
    },

    prepare : function( data ){
      controller.action_objects.buildUnit.invoke(data);
    }
  });

});

  *//*
(function() {

  function setTarget(x, y, data) {
    data.target.set(x, y);
  }

  //
  //
  controller.ai_defineRoutine({
    key: "captureProperties",
    unitAction: true,

    scoring: function(data, cScore) {
      if (cScore >= 20) return -1;

      if (!data.source.unit.type.captures) return -1;

      var tid = model.player_data[data.source.unit.owner].team;
      var prop = null;
      var move = false;
      var cprop = model.property_posMap[data.source.x][data.source.y];
      if ( cprop && ( cprop.owner === cwt.INACTIVE || 
        model.player_data[cprop.owner].team !== tid ) &&
        model.property_isCapturableBy(model.property_extractId(cprop), data.source.unitId)) {

        prop = cprop;
        data.target.set(data.source.x,data.source.y);

      } else {
        var x, y, ye, xe;
        var tx, ty;
        var found = false;
        var dataL = data.selection.data;
        move = true;
        for (x = 0, xe = dataL.length; x < xe; x++) {
          for (y = 0, ye = dataL[x].length; y < ye; y++) {
            if (dataL[x][y] >= 0) {

              if( model.unit_posData[x][y] ) continue;

              cprop = model.property_posMap[x][y];
              if (cprop && ( cprop.owner === cwt.INACTIVE || 
                model.player_data[cprop.owner].team !== tid ) &&
                model.property_isCapturableBy(
                  model.property_extractId(cprop), data.source.unitId)) {

                prop = cprop;
                data.target.set(x,y);
                found = true;
                break;
              }
            }
          }
          if (found) break;
        }

        if (!found) return -1;
      }

      if (!prop) return -1;

      if( move ){
        model.move_generatePath(
          data.source.x, data.source.y,
          data.target.x, data.target.y,
          data.selection,
          data.move
        );
      } else data.move.resetValues(cwt.INACTIVE);

      return 20;
    },

    prepare: function(data) {

      var trapped = false;
      if (data.move[0] !== -1) {
        trapped = model.move_trapCheck(data.move, data.source, data.target);
        model.events.move_flushMoveData(data.move, data.source);
      }

      if (!trapped) {
        controller.commandStack_sharedInvokement(
          "capture_invoked",
          data.target.propertyId,
          data.source.unitId
        );
        controller.commandStack_sharedInvokement(
          "wait_invoked",
          data.source.unitId
        );
      } else {
        controller.commandStack_sharedInvokement(
          "trapwait_invoked",
          data.source.unitId
        );
      }
    }
  });
})();
 *//*
(function(){

  function setTarget( x,y, data ){
    data.targetselection.set(x,y);
  }

  //
  //
  controller.ai_defineRoutine({
    key        : "attackDirect",
    unitAction : true,

    scoring : function( data , cScore ){
      if( cScore >= 5 ) return -1;

      if( !data.source.unit.type.attack ) return -1;
      
      var x,y,ye,xe;
      var tx,ty;
      var found = false;
      var dataL = data.selection.data;
      for (x = 0, xe = dataL.length; x<xe; x++ ) {
        for (y = 0, ye = dataL[x].length; y<ye; y++ ) {
          if( dataL[x][y] >= 0 ){

            if( model.unit_posData[x][y]) continue;

            // check
            if( model.events.attack_check( data.source.unitId, x,y, true) ){
              tx = x;
              ty = y;
              found = true;
              break;
            }

          }
        };
        if( found ) break;
      };

      if(!found) return -1;

      // grab path
      model.move_generatePath( 
        data.source.x, data.source.y, 
        tx, ty, 
        data.selection, 
        data.move 
      );

      // attack map
      model.battle_calculateTargets( data.source.unitId, tx, ty, data.selection, false );
      data.selection.nextRandomPosition( setTarget, data, 1 );

      if( data.targetselection.unitId === -1 ) return -1;

      return 5;
    },

    prepare : function( data ){

      var trapped = false;
      if (data.move[0] !== -1) {
        trapped = model.move_trapCheck(data.move, data.source, data.target);
        model.events.move_flushMoveData(data.move, data.source);
      }

      if (!trapped){
        controller.commandStack_sharedInvokement(
          "attack_invoked",
          data.source.unitId,
          data.targetselection.unitId,
          Math.round(Math.random() * 100),
          Math.round(Math.random() * 100),
          0
        );
        controller.commandStack_sharedInvokement(
          "wait_invoked",
          data.source.unitId
        );
      } else {
        controller.commandStack_sharedInvokement(
          "trapwait_invoked",
          data.source.unitId
        );
      }
    }
  });
})();
  */
/*
controller.ai_defineRoutine({
  key        : "endTurn",
  mapAction  : true,
  endsAiTurn : true,

  // 1 as low score to be sure that end turn will be used at last by the AI
  scoring : function( data ){
    return 1;
  },

  prepare : function( data ){
    // end turn will be done by machine
  }
});
*//*
(function(){

  function setTarget( x,y, data ){
    data.targetselection.set(x,y);
  }

  //
  //
  controller.ai_defineRoutine({
    key        : "attackFromCurrentPos",
    unitAction : true,

    scoring : function( data , cScore ){
      if( cScore >= 10 ) return -1;

      if( !data.source.unit.type.attack ) return -1;

      if( !model.events.attack_check( 
        data.source.unitId, 
        data.source.x,
        data.source.y, 
        false
      )) return -1;

      // attack map
      model.battle_calculateTargets( 
        data.source.unitId, 
        data.source.x,
        data.source.y, 
        data.selection, 
        false 
      );

      data.selection.nextRandomPosition( setTarget, data, 1 );

      if( data.targetselection.unitId === -1 ) return -1;

      return 10;
    },

    prepare : function( data ){

      // attack
      controller.commandStack_sharedInvokement(
        "attack_invoked",
        data.source.unitId, 
        data.targetselection.unitId, 
        Math.round( Math.random()*100 ),
        Math.round( Math.random()*100 ),
        0
      );

      controller.commandStack_sharedInvokement(
        "wait_invoked",
        data.source.unitId
      );
    }
  });
})();
*//*
(function(){

  function setTarget( x,y, data ){
    data.target.set(x,y);
  }

  //
  //
  controller.ai_defineRoutine({
    key        : "moveRandom",
    unitAction : true,

    scoring : function( data , cScore ){
      if( cScore >= 1 ) return -1;

      var n = 0;
      while( true ){
        if( n >= 10 ) return -1;

        if( !data.selection.nextRandomPosition( setTarget, data, 0 ) ){
          n++;
          continue;  
        }

        if( !data.target.unit ) break;
        else n++;
      }
            
      model.move_generatePath( 
        data.source.x, data.source.y, 
        data.target.x, data.target.y, 
        data.selection, 
        data.move 
      );

      model.move_trapCheck(data.move,data.source,data.target);

      return 1;
    },

    prepare : function( data ){

      model.events.move_flushMoveData( 
        data.move, 
        data.source 
      );
      
      controller.commandStack_sharedInvokement(
        "wait_invoked",
        data.source.unitId
      );
    }
  });
})();
  */