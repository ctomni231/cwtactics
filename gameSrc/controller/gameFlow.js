/**
 *
 * @namespace
 */
cwt.Gameflow = {

  /**
   * @type {cwt.GameState}
   */
  activeState: null,

  /**
   * True when the game is in an active game round, else false.
   *
   * @type {boolean}
   */
  inGameRound: false,

  /**
   * @type {Array.<cwt.GameState>}
   */
  states_: {},

  /**
   * State-Machine data object to share data between
   * states.
   */
  data: {},

  /**
   *
   * @param desc
   */
  addState: function (desc) {
    if (this.DEBUG) cwt.assert(!this.states_.hasOwnProperty(desc.id));

    this.states_[desc.id] = new cwt.GameState(
      desc.init ? desc.init : cwt.emptyFunction,
      desc.exit ? desc.exit : cwt.emptyFunction,
      desc.enter ? desc.enter : cwt.emptyFunction,
      desc.update ? desc.update : cwt.emptyFunction,
      desc.render ? desc.render : cwt.emptyFunction,
      this.data
    );
  },

  /**
   * Initializes the game state machine.
   */
  initialize: function () {
    var oldTime = new Date().getTime();

    function gameLoop() {

      // acquire next frame
      requestAnimationFrame(gameLoop);

      // calculate delta
      var now = new Date().getTime();
      var delta = now - oldTime;
      oldTime = now;

      // update machine
      cwt.Gameflow.update(delta);

      /*
       if (cwt.Gameflow.inGameRound) {
       cwt.Gameround.gameTimeElapsed += delta;
       cwt.Gameround.turnTimeElapsed += delta;

       // check turn time
       if (cwt.Gameround.turnTimeLimit > 0 && cwt.Gameround.turnTimeElapsed >= cwt.Gameround.turnTimeLimit) {
       controller.commandStack_sharedInvokement("nextTurn_invoked");
       }

       // check game time
       if (cwt.Gameround.gameTimeLimit > 0 && cwt.Gameround.gameTimeElapsed >= cwt.Gameround.gameTimeLimit) {
       controller.update_endGameRound();
       }

       // ai tick
       if (!controller.commandStack_hasData()) {
       if (controller.ai_active) controller.ai_machine.event("tick");
       } else controller.commandStack_invokeNext();
       }

       controller.updateInputCoolDown(delta);
       controller.updateGamePadControls(delta);

       var usedInput = controller.input_evalNextKey();

       // if the system is in the game loop, then update the game aw2
       if (controller.inGameLoop) {

       if (controller.update_inGameRound) {
       controller.gameLoop(delta, evenFrame, usedInput);
       } else controller.screenStateMachine.event("gameHasEnded"); // game ends --> stop game loop
       }

       if (controller.screenStateMachine.state === "MOBILE") {
       controller.screenStateMachine.event("decreaseTimer", delta);
       }
       */
    }

    // enter the loop
    requestAnimationFrame(gameLoop);
  },

  /**
   *
   * @param stateId
   */
  changeState: function (stateId) {
    if (this.activeState) {

      // exit old state
      this.activeState.exit();
    }

    // enter new state
    this.setState(stateId, true);
  },

  /**
   *
   * @param stateId
   */
  setState: function (stateId, fireEvent) {
    if (this.DEBUG) cwt.assert(this.states_.hasOwnProperty(stateId));

    this.activeState = this.states_[stateId];

    if (fireEvent !== false) {
      this.activeState.enter();
    }
  },

  /**
   *
   * @param delta
   */
  update: function (delta) {
    var inp = cwt.Input.popAction();
    this.activeState.update(delta, inp);
    this.activeState.render(delta);
  }
};

/*



// ### StateMachineData
// Action process aw2 memory object. It is used as aw2 holder to transport aw2 between
// the single states of the state machine of the game engine.
//
controller.stateMachine.data = {


  // ### StateMachineData.hereIsUnitRelationShip
  // Does a unit to unit relationcheck. Both arguments `posA` and `posB` are objects of the type
  // `controller.TaggedPosition`. An instance of `model.player_RELATION_MODES` will be returned.
  //
  thereIsUnitRelationShip: function (posA, posB) {
    // TODO check for undefined

    if (posA.unit && posA.unit === posB.unit) return model.player_RELATION_MODES.SAME_OBJECT;

    return model.player_getRelationship(
      (posA.unit !== null) ? posA.unit.owner : -1,
      (posB.unit !== null) ? posB.unit.owner : -1
    );
  },

  // Does a unit to property relation check. Both arguments `posA` and `posB` are objects of the
  // type `controller.TaggedPosition`. An instance of `model.player_RELATION_MODES` will be
  // returned.
  //
  thereIsUnitToPropertyRelationShip: function (posA, posB) {
    // TODO check for undefined

    return model.player_getRelationship(
      (posA.unit !== null    ) ? posA.unit.owner : -1,
      (posB.property !== null) ? posB.property.owner : null
    );
  }
};

* Holds some information about the current action menu.
 *
 * @namespace
cwt.gameFlowData.menu = {

   * Menu list that contains all menu entries. This implementation is a
   * cached list. The real size of the menu is marked by
   *  `controller.stateMachine.aw2.menuSize`.
   *
   * @example
   *   aw2 is [ entryA, entryB, entryC, null, null ]
   *   size is 3
  data: cwt.list(20, null),

  enabled: cwt.list(20, true),

   * Size of the menu.
  size: 0,

  // Adds an object to the menu.
  //
  addEntry: function (entry, enabled, extraData) {
    cwt.assert(this.size < this.data.length);

    this.data[this.size] = entry;

    if (typeof enabled === "undefined") enabled = true;
    this.enabled[this.size] = (enabled === true);

    // TODO: PREPARATION FOR EXTENDED MENUS - (0.3.6 - 0.4.0)
    //if( !extraData ) extraData      = null;
    //this.extraData[ this.size ]     = extraData;

    this.size++;
  },

   * Cleans the menu.
  clean: function () {
    this.size = 0;
  },

   * Prepares the menu for a given source and target position.
  generate: util.scoped(function () {
    var commandKeys;
    return function () {

      // lazy generate the command keys
      if (!commandKeys) commandKeys = Object.keys(controller.action_objects);

      // collect meta-aw2
      var checkMode;
      var result;
      var data = controller.stateMachine.data;
      var mapActable = false;
      var propertyActable = true;
      var property = data.source.property;
      var unitActable = true;
      var selectedUnit = data.source.unit;
      var st_mode = data.thereIsUnitRelationShip(data.source, data.target);
      var sst_mode = data.thereIsUnitRelationShip(data.source, data.targetselection);
      var pr_st_mode = data.thereIsUnitToPropertyRelationShip(data.source, data.target);
      var pr_sst_mode = data.thereIsUnitToPropertyRelationShip(data.source, data.targetselection);

      // check action types
      if (selectedUnit === null ||
        selectedUnit.owner !== model.round_turnOwner) unitActable = false;
      else if (!model.actions_canAct(data.source.unitId)) unitActable = false;
      if (selectedUnit !== null) propertyActable = false;
      if (property === null || property.owner !== model.round_turnOwner ||
        property.type.blocker) propertyActable = false;
      if (!unitActable && !propertyActable) mapActable = true;

      // check all meta-aw2 in relation to all available game actions
      for (var i = 0, e = commandKeys.length; i < e; i++) {
        var action = controller.action_objects[commandKeys[i]];

        // AI or remote player_data cannot be controlled by the a client
        if (!action.clientAction && (!model.client_isLocalPid(model.round_turnOwner) || !controller.ai_isHuman(model.round_turnOwner))) continue;

        // pre defined checkers
        if (action.unitAction) {
          if (!unitActable) continue;

          // relation to unit
          if (action.relation) {
            checkMode = null;

            if (action.relation[0] === "S" &&
              action.relation[1] === "T") checkMode = st_mode;
            else if (action.relation[0] === "S" &&
              action.relation[1] === "ST") checkMode = sst_mode;

            result = false;
            for (var si = 2, se = action.relation.length; si < se; si++) {
              if (action.relation[si] === checkMode) result = true;
            }

            if (!result) continue;
          }

          // relation to property
          if (action.relationToProp) {
            checkMode = null;

            if (action.relation[0] === "S" &&
              action.relationToProp[1] === "T") checkMode = pr_st_mode;
            else if (action.relation[0] === "S" &&
              action.relationToProp[1] === "ST") checkMode = pr_sst_mode;

            result = false;
            for (var si = 2, se = action.relationToProp.length; si < se; si++) {
              if (action.relationToProp[si] === checkMode) result = true;
            }

            if (!result) continue;
          }
        } else if (action.propertyAction && !propertyActable) continue;
        else if (action.mapAction === true && !mapActable) continue;
        else if (action.clientAction === true && !mapActable) continue;

        // if condition matches then add the entry to the menu list
        if (action.condition && action.condition(data) !== false) {
          data.menu.addEntry(commandKeys[i]);
        }
      }
    };
  }),

   * Adds unload targets for a transporter at a given position to the menu.
   *
   * @param uid
   * @param x
   * @param y
   * @param menu
  addUnloadTargetsToMenu: function( uid, x,y, menu ){
    var loader = model.unit_data[uid];
    var pid    = loader.owner;
    var i      = model.unit_firstUnitId( pid );
    var e      = model.unit_lastUnitId( pid );
    var unit;

    for( ;i<=e; i++ ){
      unit = model.unit_data[i];

      if( unit.owner !== cwt.INACTIVE && unit.loadedIn === uid ){
        var movetp = model.data_movetypeSheets[ unit.type.movetype ];

        if( model.move_canTypeMoveTo(movetp,x-1,y) ||
          model.move_canTypeMoveTo(movetp,x+1,y) ||
          model.move_canTypeMoveTo(movetp,x,y-1) ||
          model.move_canTypeMoveTo(movetp,x,y+1) ) menu.addEntry( i, true );
      }
    }
  }
};

cwt.gameFlowData.selection = util.scoped(function () {

  var sMap = util.selectionMap(MAX_SELECTION_RANGE * 4 + 1);

  // Extension to the selection map. This one prepares the selection
  // for the current aw2 model.
  //
  sMap.prepare = function () {
    var target = controller.stateMachine.data.target;
    var x = target.x;
    var y = target.y;

    this.setCenter(x, y, -1);

    var actObj = controller.stateMachine.data.action.object;
    actObj.prepareTargets(controller.stateMachine.data);

    // decide which selection mode will be used based on the given action object
    return (actObj.targetSelectionType === "A") ? "ACTION_SELECT_TARGET_A" :
      "ACTION_SELECT_TARGET_B";
  };

  //
  //
  sMap.rerenderNonInactive = function () {
    var e = this.data.length;
    var cx = this.centerX;
    var cy = this.centerY;

    // rerender aw2
    for (var x = 0; x < e; x++) {
      for (var y = 0; y < e; y++) {
        if (this.data[x + cx][y + cy] > cwt.INACTIVE) view.redraw_markPos(x + cx, y + cy);
      }
    }
  };

  return sMap;
});

cwt.gameFlowData.addUnloadTargetsToSelection = function (uid, x, y, loadId, selection) {
  var loader = model.unit_data[uid];
  var movetp = model.data_movetypeSheets[ model.unit_data[ loadId ].type.movetype ];

  if (model.move_canTypeMoveTo(movetp, x - 1, y)) selection.setValueAt(x - 1, y, 1);
  if (model.move_canTypeMoveTo(movetp, x + 1, y)) selection.setValueAt(x + 1, y, 1);
  if (model.move_canTypeMoveTo(movetp, x, y - 1)) selection.setValueAt(x, y - 1, 1);
  if (model.move_canTypeMoveTo(movetp, x, y + 1)) selection.setValueAt(x, y + 1, 1);
}

cwt.gameFlowData.selectionRange = cwt.INACTIVE;



 util.scoped(function(){

 var activeHock = null;
 var hasHocks = false;
 var savedDelta = 0;

 function tryToPopNextHook(){

 // CHECK HOOKS
 if( !view.hooksBuffer.isEmpty() ){
 hasHocks = true;
 var data = view.hooksBuffer.pop();
 var key = data[data.length-1];
 activeHock = view.animationHooks[ key ];
 activeHock.prepare.apply( activeHock, data );
 }
 else hasHocks = false;
 }


---------------------

controller.prepareGameLoop = function(){
  savedDelta = 0;
}

controller.gameLoop = function( delta, updateLogic, inputUsed ){

  savedDelta += delta; // SAVE DELTAS FOR UPDATE LOGIC ( --> TURN TIMER AND SO ON )

  var inMove = (controller.moveScreenX !== 0 || controller.moveScreenY !== 0);

  // IF SCREEN IS IN MOVEMENT THEN UPDATE THE MAP SHIFT
  if( inMove ) controller.solveMapShift();
  // ELSE UPDATE THE LOGIC
  else{

    // IF MESSAGE PANEL IS VISIBLE THEN BREAK PROCESS UNTIL
    // IT CAN BE HIDDEN
    if( view.hasInfoMessage() ){
      view.updateMessagePanelTime(delta);
    }
    else{
      if( updateLogic ){

        // only update game state when no hooks are in the hooks cache
        if( !hasHocks ){
          if( !inputUsed ){

            // UPDATE LOGIC
            controller.update_tickFrame( savedDelta );
            savedDelta = 0;

            // CHECK HOOKS
            tryToPopNextHook();
          }
        }
        // ELSE EVALUATE ACTIVE HOCK
        else{
          activeHock.update(delta);
          if( activeHock.isDone() ) tryToPopNextHook();
        }
      }
    }

    // UPDATE SPRITE ANIMATION
    view.updateSpriteAnimations( delta );
  }

  // RENDER SCREEN
  if( !updateLogic ){
    if( view.redraw_dataChanges > 0 ) view.renderMap( controller.screenScale );

    // RENDER ACTIVE HOCK AND POP NEXT ONE WHEN DONE
    if( hasHocks ){
      activeHock.render();
    }
    else{

      // UPDATE SELECTION CURSOR
      if( controller.stateMachine.state === "ACTION_SELECT_TILE" ){

        var r = view.selectionRange;
        var x = controller.mapCursorX;
        var y = controller.mapCursorY;
        var lX;
        var hX;
        var lY = y-r;
        var hY = y+r;
        if( lY < 0 ) lY = 0;
        if( hY >= model.map_height ) hY = model.map_height-1;
        for( ; lY<=hY; lY++ ){

          var disY = Math.abs( lY-y );
          lX = x-r+disY;
          hX = x+r-disY;
          if( lX < 0 ) lX = 0;
          if( hX >= model.map_width ) hX = model.map_width-1;
          for( ; lX<=hX; lX++ ){

            view.redraw_markPos(lX,lY);
          }
        }
      }
    }

  }

};

controller.inAnimationHookPhase = function(){
  return hasHocks;
};

});

 */