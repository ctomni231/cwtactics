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

      addEntry: function (content, enabled) {
        this.entries_.push(content);
        this.enabled_.push(enabled);
      },

      commandKeys_: null,

      checkRelation_: function (action,relationList,sMode,stMode) {
        var checkMode;

        switch (relationList[1]) {
          case "T" :
            checkMode = sMode;
            break;

          case "ST" :
            checkMode = stMode;
            break;

          default :
            checkMode = null;
        }

        for (var si = 2, se = action.relationToProp.length; si < se; si++) {
          if (action.relationToProp[si] === checkMode) {
            return true;
          }
        }

        return false;
      },

      /**
       * Generates the action menu based on the given position data.
       */
      generate: function () {
        if (!this.commandKeys) {
          this.commandKeys = cwt.Action.getRegisteredNames();
        }

        var st_mode;
        var sst_mode;
        var pr_st_mode;
        var pr_sst_mode;
        var sPos = gameData.source;
        var tPos = gameData.target;
        var tsPos = gameData.targetselection;
        var ChkU = cwt.Relationship.CHECK_UNIT;
        var ChkP = cwt.Relationship.CHECK_PROPERTY;
        var sProp = sPos.property;
        var sUnit = sPos.unit;
        var unitActable = (!(!sUnit || sUnit.owner !== cwt.Gameround.turnOwner || !sUnit.canAct));
        var propertyActable = (!(sUnit || !sProp || sProp.owner !== cwt.Gameround.turnOwner || sProp.type.blocker));
        var mapActable = (!unitActable && !propertyActable);

        // check_ all game action objects and fill menu
        for (var i = 0, e = this.commandKeys.length; i < e; i++) {
          var action = cwt.Action.getActionObject(this.commandKeys[i]);

          switch (action.type) {

            case cwt.Action.CLIENT_ACTION:
              // TODO: ai check
              if (!mapActable || cwt.Player.activeClientPlayer !== cwt.Gameround.turnOwner) {
                continue;
              }
              break;

            case cwt.Action.PROPERTY_ACTION:
              if (!propertyActable) {
                continue;
              }
              break;

            case cwt.Action.MAP_ACTION:
              if (!mapActable) {
                continue;
              }
              break;

            case cwt.Action.UNIT_ACTION:
              if (!unitActable) {
                continue;
              }

              // extract relationships
              if (st_mode === void 0) {
                st_mode = cwt.Relationship.getRelationShipTo(sPos, tPos, ChkU, ChkU);
                sst_mode = cwt.Relationship.getRelationShipTo(sPos, tsPos, ChkU, ChkU);
                pr_st_mode = cwt.Relationship.getRelationShipTo(sPos, tPos, ChkU, ChkP);
                pr_sst_mode = cwt.Relationship.getRelationShipTo(sPos, tsPos, ChkU, ChkP);
              }

              // relation to unit
              if (action.relation) {
                if (!this.checkRelation_(action,action.relation,st_mode,sst_mode)) {
                  continue;
                }
              }

              // relation to property
              if (action.relationToProp) {
                if (!this.checkRelation_(action,action.relationToProp,pr_st_mode,pr_sst_mode)) {
                  continue;
                }
              }
              break;
          }

          // if condition matches then add the entry to the menu list
          if (action.condition && action.condition(gameData) !== false) {
            gameData.menu.addEntry(this.commandKeys[i], true)
          }
        }
      }
    };
  },

  enter: function (gameData) {
    gameData.menu.clean();
    gameData.menu.generate();

    // go back when no entries exists
    if (!gameData.menu.getSize()) {
      cwt.Gameflow.changeState("INGAME_IDLE");
    }
  },

  UP: function (gameData) {
    if (gameData.menu.selectedIndex > 0) {
      gameData.menu.selectedIndex--;
    }
  },

  DOWN: function (gameData) {
    if (gameData.menu.selectedIndex < gameData.menu.getSize() - 1) {
      gameData.menu.selectedIndex++;
    }
  },

  ACTION: function (gameData) {
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
      next = "INGAME_SELECT_TILE_TYPE_A";
    } else {
      next = "INGAME_FLUSH_ACTION";
    }

    if (cwt.DEBUG) cwt.assert(next);
    cwt.Gameflow.changeState(next);
  },

  CANCEL: function (gameData) {
    var unit = gameData.source.unit;
    var next = null;

    if (unit && unit.owner.activeClientPlayer) {
      // unit was selected and it is controlled by the active player, so it means that this unit
      // is the acting unit -> go back to INGAME_MOVEPATH state without erasing the existing move data

      gameData.preventMovePathGeneration = true;
      next = "INGAME_MOVEPATH";

    } else {
      next = "INGAME_IDLE";
    }

    if (cwt.DEBUG) cwt.assert(next);
    cwt.Gameflow.changeState(next);
  }
});