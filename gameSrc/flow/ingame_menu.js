cwt.Gameflow.addInGameState({
  id: "INGAME_MENU",

  // create game round data in global data scope
  init: function () {
    var gameData = this.globalData;

    /**
     * Selected game action.
     *
     * @memberOf cwt.Gameflow.globalData
     */
    gameData.action = {

      /**
       * Selected sub action object.
       */
      selectedEntry: null,

      /**
       * Selected sub action object.
       */
      selectedSubEntry: null,

      /**
       * Action object that represents the selected action.
       */
      object: null
    };

    /**
     * Game menu.
     *
     * @memberOf cwt.Gameflow.globalData
     */
    gameData.menu = {

      /**
       * @type {cwt.CircularBuffer.<String|null>}
       */
      entries_: new cwt.CircularBuffer(),

      /**
       * @type {cwt.CircularBuffer.<boolean|null>}
       */
      enabled_: new cwt.CircularBuffer(),

      selectedIndex: 0,

      /**
       *
       * @return {String}
       */
      getContent: function () {
        return this.entries_.get(this.selectedIndex);
      },

      getSize: function () {
        return this.enabled_.size;
      },

      /**
       *
       * @return {boolean}
       */
      isEnabled: function () {
        return this.enabled_.get(this.selectedIndex) === true;
      },

      clean: function () {
        this.enabled_.clear();
        this.entries_.clear();
        this.selectedIndex = 0;
      },

      generate: function () {
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
      }
    };
  },

  enter: function () {

    /** @borrows cwt.Gameflow.globalData as gameData */
    var gameData = this.globalData;

    gameData.menu.clean();
    gameData.menu.generate();

    // go back when no entries exists
    if (!gameData.menu.getSize()) {
      cwt.Gameflow.changeState("IDLE");
    }
  },

  ACTION: function () {

    /** @borrows cwt.Gameflow.globalData as gameData */
    var gameData = this.globalData;

    var actName = gameData.menu.getContent();
    var actObj = cwt.Action.getActionObject(actName);

    // select action in data
    gameData.action.selectedEntry = actName;
    gameData.action.object = actObj;

    // calculate next state from the given action object
    var next = null;
    if (actObj.prepareMenu !== null) {
      next = "INGAME_SUBMENU";
    } else if (actObj.isTargetValid !== null) {
      next = "INGAME_SELECT_TILE";
    } else if (actObj.prepareTargets !== null && actObj.targetSelectionType === "A") {
      // return this.data.selection.prepare();
      // TODO: prepare in the selection state
    } else {
      next = "INGAME_FLUSH_ACTION";
    }

    if (cwt.DEBUG) cwt.assert(next);
    cwt.Gameflow.changeState(next);
  },

  CANCEL: function () {
    cwt.Gameflow.changeState("INGAME_IDLE");
  }
});