/**
 * Default controller state. The action is in a clean state and no data is
 * set here.
 *
 * constant
 */
controller.STATE_IDLE = 0;

/**
 * Controller state that waits for a move path selection by the client.
 *
 * @constant
 */
controller.STATE_SELECT_MOVE_PATH = 1;

/**
 * Controller state that waits for an menu entry selection by the client.
 *
 * @constant
 */
controller.STATE_SELECT_ACTION = 2;

/**
 * Controller state that waits for a position selection for an action target
 * by the client.
 *
 * @constant
 */
controller.STATE_SELECT_ACTION_TARGET = 3;

/**
 * Controller state that waits for a menu entry selection by the client.
 *
 * @constant
 */
controller.STATE_SELECT_SUBMENU_ACTION = 4;

/**
 * Controller state that waits for a position selection for an action target
 * by the client. This state accepts a tile on the map ( not in the selction
 * screen ).
 *
 * @constant
 */
controller.STATE_SELECT_ACTION_FREE_TARGET = 5;

// CURRENT STATE OF THE ACTION LAYER
controller.currentState = controller.STATE_IDLE;


// ---------------------------------------------------------------------------

// MESSAGE BUFFER VARS

/** @private */
controller._bufferReadIndex = 0;

/** @private */
controller._bufferWriteIndex = 0;

/** @private */
controller._bufferData = util.list(CWT_MAX_BUFFER_SIZE, null);

/**
 * Pushes a message into the message bugger.
 *
 * @param msg message content as js object
 * @private
 */
controller._pushMsgToBuffer = function (msg) {
  if (controller._bufferData[ controller._bufferWriteIndex ] !== null) {
    util.logError("message buffer is full");
    return;
  }

  if (util.DEBUG) {
    util.logInfo("adding message (", util.objectToJSON(msg), ") to buffer");
  }

  // WRITE MSG AND INCREASE COUNTER
  controller._bufferData[ controller._bufferWriteIndex ] = msg;
  controller._bufferWriteIndex++;
  if (controller._bufferWriteIndex === CWT_MAX_BUFFER_SIZE) {
    controller._bufferWriteIndex = 0;
  }
};

/**
 * Returns true if the buffer is not empty else false.
 *
 * @private
 */
controller._isMsgInBuffer = function () {
  return ( controller._bufferData[ controller._bufferReadIndex ] !== null );
};

/**
 * Pops a message from the message buffer and returns its content.
 *
 * @return message content
 * @private
 */
controller._popMsgFromBuffer = function () {
  if (controller._bufferData[ controller._bufferReadIndex ] === null) {
    util.logError("message buffer is empty");
  }
  var msg = controller._bufferData[ controller._bufferReadIndex ];

  // INCREASE COUNTER AND FREE SPACE
  controller._bufferData[ controller._bufferReadIndex ] = null;
  controller._bufferReadIndex++;
  if (controller._bufferReadIndex === CWT_MAX_BUFFER_SIZE) {
    controller._bufferReadIndex = 0;
  }

  return msg;
};


// ---------------------------------------------------------------------------

// SELECTION API VARS
controller.selectionTargets = util.matrix(
  CWT_MAX_SELECTION_RANGE * 2 + 1, CWT_MAX_SELECTION_RANGE * 2 + 1, -1);

/** @private */
controller._selectionScreenY = -1;

/** @private */
controller._selectionScreenX = -1;

/**
 * Clears the selection map for a new selection process.
 *
 * @param centerX
 * @param centerY
 */
controller._clearSelection = function (centerX, centerY) {

  var e = CWT_MAX_SELECTION_RANGE * 2 + 1;
  for (var x = 0; x < e; x++) {
    for (var y = 0; y < e; y++) {
      controller.selectionTargets[x][y] = -1;
    }
  }

  // right bounds are not important
  centerX = Math.max(0, centerX - CWT_MAX_SELECTION_RANGE);
  centerY = Math.max(0, centerY - CWT_MAX_SELECTION_RANGE);

  controller._selectionScreenX = centerX;
  controller._selectionScreenY = centerY;
};

/**
 * Gets the value of a selection position.
 *
 * @param x
 * @param y
 */
controller.valueOfSelectionPos = function (x, y) {
  var sx = x - controller._selectionScreenX;
  var sy = y - controller._selectionScreenY;
  var maxLen = 2 * CWT_MAX_SELECTION_RANGE + 1;

  if (sx < 0 || sy < 0 || sx >= maxLen || sy >= maxLen) {
    return -1;
  }
  else return controller.selectionTargets[sx][sy];
};

/**
 * Sets the value of a selection position.
 *
 * @param x
 * @param y
 * @param value (default=1)
 */
controller.setValueOfSelectionPos = function (x, y, value) {
  var sx = x - controller._selectionScreenX;
  var sy = y - controller._selectionScreenY;
  var len = CWT_MAX_SELECTION_RANGE * 2 + 1;
  if (value === undefined) value = 1;

  if (sx < 0 || sx >= len || sy < 0 || sy >= len) {
    util.logError("position (", x, ",", y, ") is out of move map bounds");
  }
  else controller.selectionTargets[sx][sy] = value;
};


// ---------------------------------------------------------------------------

/**
 * Menu list. The menu will be filled by the possible action objects in the
 * actions module.
 */
controller.actionList = [];

/**
 * Sub menu list. The sub menu will be filled by the selected action object.
 * Not like the action list, the sub action list entries are dynamical.
 */
controller.subActionList = [];

/**
 * X coordinate of the position where the action object was selected.
 */
controller.selectedSourceX = -1;

/**
 * Y coordinate of the position where the action object was selected.
 */
controller.selectedSourceY = -1;

/**
 * X coordinate of the position where the action menu was triggered.
 */
controller.selectedTargetX = -1;

/**
 * Y coordinate of the position where the action menu was triggered.
 */
controller.selectedTargetY = -1;

/**
 * X coordinate of the position of the target tile for the selected action
 * or sub menu action.
 */
controller.selectedActionTargetX = -1;

/**
 * Y coordinate of the position of the target tile for the selected action
 * or sub menu action.
 */
controller.selectedActionTargetY = -1;

/**
 * Selected move path. The move path is filled with the move codes from the
 * game module.
 */
controller.selectedMovePath = null;

/**
 * Selected object for the current active action.
 */
controller.selectedObject = -1;

/**
 * Current selected action from the menu.
 */
controller.selectedAction = null;

/**
 * Current selected action from the sub menu.
 */
controller.selectedSubMenuAction = null;

/**
 * Returns the shortest path from the selected position to a given position.
 * The used algorithm is a-star.
 *
 * @param tx
 * @param ty
 */
controller.returnPath = function (tx, ty) {
  var stx = controller.selectedSourceX;
  var sty = controller.selectedSourceY;

  if (util.DEBUG) util.logInfo(
    "searching path from (", stx, ",", sty, ") to (", tx, ",", ty, ")"
  );

  // var graph = new Graph( nodes );
  var graph = new Graph(controller.selectionTargets);

  var start = graph.nodes[stx - controller._selectionScreenX][sty -
    controller._selectionScreenY];

  var end = graph.nodes[tx - controller._selectionScreenX][ty -
    controller._selectionScreenY];

  var path = astar.search(graph.nodes, start, end);

  if (util.DEBUG) util.logInfo("calculated way is", path);

  var codesPath = [];
  var cx = stx - controller._selectionScreenX;
  var cy = sty - controller._selectionScreenY;
  var cNode;

  for (var i = 0, e = path.length; i < e; i++) {
    cNode = path[i];

    var dir;
    if (cNode.x > cx) dir = 1;
    if (cNode.x < cx) dir = 3;
    if (cNode.y > cy) dir = 2;
    if (cNode.y < cy) dir = 0;

    if (dir === undefined) throw Error();

    codesPath.push(dir);

    cx = cNode.x;
    cy = cNode.y;
  }

  return codesPath;
};

/**
 * Generates the action list for the current selected tile ( or object if
 * tile is a property or occupied by an unit ).
 *
 * @private
 */
controller._generateActionList = function () {
  var list = controller.actionList;

  var actions = Object.keys( window.actions );
  var property = game.propertyByPos(
    controller.selectedTargetX, controller.selectedTargetY);

  var unit = game.unitByPos(
    controller.selectedTargetX, controller.selectedTargetY);

  var selectedUnit = (controller.selectedObject === -1)? 
                      null: game.unitById(controller.selectedObject);
                      
  var rStP = game.relationshipBetween(selectedUnit, property);
  var rStU = game.relationshipBetween(selectedUnit, unit);

  for (var i = 0, e = actions.length; i < e; i++) {
    var key = actions[i];

    // x,y,rStP,rStU,selected,property,unit
    if ( window.actions[key].condition(
      controller.selectedTargetX, controller.selectedTargetY,
      rStP, rStU,
      selectedUnit,
      property, unit)
      ) {
      list.push(key);
    }
  }
};

/**
 * Flushes the current saved user action data into action command objects.
 *
 * @private
 */
controller._flushAction = function () {
  // TODO --> SHARE CALL

  var property = game.propertyByPos(
    controller.selectedTargetX, controller.selectedTargetY);

  var unit = game.unitByPos(
    controller.selectedTargetX, controller.selectedTargetY);

  // DO MOVE
  if (controller.selectedMovePath !== null &&
    controller.selectedMovePath.length > 0) {

    controller._pushMsgToBuffer({
      k:"move",
      a:[
        controller.selectedObject,
        controller.selectedSourceX, controller.selectedSourceY,
        controller.selectedMovePath
      ]
    });
  }

  // DO ACTION
  controller._pushMsgToBuffer({
    k:controller.selectedAction,
    a:[
      controller.selectedTargetX, controller.selectedTargetY,
      controller.selectedObject,
      ( property === null ) ? -1 : game.extractPropertyId(property),
      ( unit === null ) ? -1 : game.extractUnitId(unit),
      controller.selectedActionTargetX, controller.selectedActionTargetY,
      controller.selectedSubMenuAction
    ]
  });

  controller.reset();
};

/**
 * Resets all action data and returns the controller to the idle state.
 */
controller.reset = function () {
  if (util.DEBUG) util.logInfo("reset action API to clean state");

  controller.currentState = controller.STATE_IDLE;
  controller.selectedSourceX = -1;
  controller.selectedSourceY = -1;
  controller.selectedTargetX = -1;
  controller.selectedTargetY = -1;
  controller.selectedActionTargetX = -1;
  controller.selectedActionTargetY = -1;
  controller.selectedObject = -1;
  controller.selectedMovePath = null;
  controller.selectedAction = null;
  controller.selectedSubMenuAction = null;

  controller.subActionList.splice(0);
  controller.actionList.splice(0);
};

/**
 * Selects a tile by a position. If the tile is a property or occupied by
 * an own unit, the move path selection state will be chosen and the
 * selected object will be set as selected data.
 *
 * @param x
 * @param y
 */
controller.tickTile = function (x, y) {

  var pid = game.getTurnOwner();
  switch (controller.currentState) {

    // -----------------------------------------------------
    case controller.STATE_IDLE :
      controller.selectedSourceX = x;
      controller.selectedSourceY = y;

      var selected = -1;
      var state = controller.STATE_SELECT_ACTION;

      var unit = game.unitByPos(x, y);
      if (unit !== null && unit.owner === pid &&
        game.canAct(game.extractUnitId(unit))) {

        controller.selectedObject = game.extractUnitId(unit);
        controller.currentState = controller.STATE_SELECT_MOVE_PATH;
        controller._clearSelection(x, y);
        game.prepareMovepathSelection( controller.selectedObject,
          controller.valueOfSelectionPos, controller.setValueOfSelectionPos );
      }
      else {

        controller.selectedTargetX = x;
        controller.selectedTargetY = y;
        controller.currentState = controller.STATE_SELECT_ACTION;
        controller._generateActionList();
      }

      break;

    // -----------------------------------------------------
    case controller.STATE_SELECT_ACTION_TARGET :
      controller.selectedActionTargetX = x;
      controller.selectedActionTargetY = y;
      controller._flushAction();
      break;

    // -----------------------------------------------------
    case controller.STATE_SELECT_ACTION_FREE_TARGET :
      controller.selectedActionTargetX = x;
      controller.selectedActionTargetY = y;
      controller._flushAction();
      break;

    // -----------------------------------------------------
    case controller.STATE_SELECT_MOVE_PATH :
      if (util.DEBUG) {
        util.logInfo("target pos selected, generating path by a star");
      }

      controller.selectedTargetX = x;
      controller.selectedTargetY = y;

      // MOVE BY POS MEANS A PATH MUST BE GENERATED
      if (controller.selectedMovePath === null) {
        controller.selectedMovePath = controller.returnPath(x, y);
      }

      controller._generateActionList();
      controller.currentState = controller.STATE_SELECT_ACTION;

      if (util.DEBUG) {
        util.logInfo(
          "got path", controller.selectedMovePath,
          "with target pos (", x, ",", y, ")"
        );
      }
      break;

    // -----------------------------------------------------
    default:
      util.logError("cannot select tile in current active state");
  }
};

/**
 * Sets a move path.
 *
 * @param movepath
 */
controller.tickPath = function (movepath) {
  if (util.DEBUG) {
    util.logInfo("path selected, calculating target position");
  }

  if (controller.currentState !== controller.STATE_SELECT_MOVE_PATH) {
    util.logError("cannot set path because action API is not in move state");
  }

  var tx = controller.selectedSourceX;
  var ty = controller.selectedSourceY;

  for (var i = 0, e = movepath.length; i < e; i++) {
    switch (movepath[i]) {

      case game.MOVE_CODE_DOWN :
        ty++;
        break;
      case game.MOVE_CODE_RIGHT :
        tx++;
        break;
      case game.MOVE_CODE_UP :
        ty--;
        break;
      case game.MOVE_CODE_LEFT :
        tx--;
        break;

      default:
        util.logError("unknown move code", controller.selectedMovePath[i]);
        throw Error();
    }
  }

  // SET TARGET BY PATH
  controller.selectedMovePath = movepath;
  controller.selectedTargetX = tx;
  controller.selectedTargetY = ty;

  if (util.DEBUG) {
    util.logInfo("got path", movepath, "with target pos (", tx, ",", ty, ")");
  }
};

/**
 * Selects an action key.
 *
 * @param actionKey
 */
controller.selectEntry = function (actionKey) {
  var state = controller.currentState;
  var actionState = ( state === controller.STATE_SELECT_ACTION );
  var subActionState = ( state === controller.STATE_SELECT_SUBMENU_ACTION );
  var selected = controller.selectedObject;

  if (actionState) {
    controller.selectedAction = actionKey;

    // BUILD SUB MENU BY ACTION CALL
    if (actions[actionKey].hasSubMenu === true) {
      controller.currentState = controller.STATE_SELECT_SUBMENU_ACTION;
      actions[actionKey].prepareSubMenu(
        controller.subActionList,
        (selected !== -1) ? game.unitById(selected) : null,
        controller.selectedTargetX, controller.selectedTargetY
      );
    }
    // SELECT TARGET BY ACTION
    else if (actions[actionKey].targetSelection === true) {

      if( actions[actionKey].freeTarget === true ){
        controller.currentState = controller.STATE_SELECT_ACTION_FREE_TARGET;
      }
      else{

        controller.currentState = controller.STATE_SELECT_ACTION_TARGET;
        controller._clearSelection(
          controller.selectedTargetX, controller.selectedTargetY);

        actions[actionKey].prepareTargets(
          (selected !== -1) ? game.unitById(selected) : null,
          controller.selectedTargetX, controller.selectedTargetY,
          controller.selectedSubMenuAction
        );
      }
    }
    // DO ACTION BY ENTRY SELECTION
    else controller._flushAction();
  }
  else if (subActionState) {
    controller.selectedSubMenuAction = actionKey;

    if (actions[ controller.selectedAction ].targetSelection === true) {
      if( actions[ controller.selectedAction ].freeTarget === true ){
        controller.currentState = controller.STATE_SELECT_ACTION_FREE_TARGET;
      }
      else{

        controller.currentState = controller.STATE_SELECT_ACTION_TARGET;
        controller._clearSelection(
          controller.selectedTargetX, controller.selectedTargetY);

        actions[ controller.selectedAction ].prepareTargets(
          (selected !== -1) ? game.unitById(selected) : null,
          controller.selectedTargetX, controller.selectedTargetY,
          controller.selectedSubMenuAction
        );
      }
    }
    // DO ACTION AFTER SUB ENTRY SELECTION
    else controller._flushAction();
  }
};


/**
 * Is a message object available?
 */
controller.hasNextAction = function () {
  return controller._isMsgInBuffer();
};

/**
 * Pops and evaluates the next available action object from the user action
 * stack.
 *
 * @return action key if an action was in the stack, else null
 */
controller.evaluateNextAction = function () {
  // TODO move out as event

  // NO ACTION AVAILABLE --> NO ACTION EVALUATED
  if (!controller.hasNextAction()) return null;

  var msg = controller._popMsgFromBuffer();

  if (msg.k === "move") {

    // DO MOVE
    game.moveUnitFromAtoB.apply(null, msg.a);
    return msg;
  }
  else {

    // DO ACTION
    actions[ msg.k ].action.apply(null, msg.a);
    return msg;
  }
};
