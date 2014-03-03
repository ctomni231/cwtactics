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
    if (this.DEBUG) assert(!this.states_.hasOwnProperty(desc.id));

    this.states_[desc.id] = new cwt.GameState(
      desc.init ? desc.init : emptyFunction,
      desc.exit ? desc.exit : emptyFunction,
      desc.enter ? desc.enter : emptyFunction,
      desc.update ? desc.update : emptyFunction,
      desc.render ? desc.render : emptyFunction,
      this.data
    );
  },

  /**
   * Initializes the game state machine.
   */
  initialize: function () {
    var oldTime = new Date().getTime();

    function gameLoop() {

      // calculate delta
      var now = new Date().getTime();
      var delta = now - oldTime;
      oldTime = now;

      // update machine
      cwt.Gameflow.update(delta);

      /*
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

      // acquire next frame
      requestAnimationFrame(gameLoop);
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
    this.setState(stateId);
  },

  /**
   *
   * @param stateId
   */
  setState: function (stateId) {
    if (this.DEBUG) assert(this.states_.hasOwnProperty(stateId));

    this.activeState = this.states_[stateId];
    this.activeState.enter();
  },

  /**
   *
   * @param delta
   */
  update: function (delta) {

    // 1. update screen
    var next = this.activeState.update(delta, cwt.Input.popAction());

    // 2. render parent screen when given
    if (this.activeState.parent) {
      this.activeState.parent.render(delta);
    }

    // 3. render screen
    this.activeState.render(delta);

    // 4. change state when next state was returned by update
    if (next) this.changeState(next);
  }
};

/**
 *
 * @class
 */
cwt.GameState = my.Class({
  constructor: function (initFn, enterFn, exitFn, updateFn, renderFn, data ) {
    this.data = data;
    this.init = initFn;
    this.exit = exitFn;
    this.enter = enterFn;
    this.update = updateFn;
    this.render = renderFn;
  }
});

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
