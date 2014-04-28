/**
 *
 * @type {{}}
 */
cwt.FlowData = {

  /**
   * Controls the type of click confirm.
   */
  fastClickMode: false,

  /** Position object ( instance of `cwt.Position` ) with
   * rich information about the selected position by an
   * action and some relations.
   */
  source: new cwt.Position(),

  /**
   * Position object ( instance of `cwt.Position` ) with
   * rich information about the selected position by an
   * action and some relations.
   */
  target: new cwt.Position(),

  /**
   * Position object ( instance of `cwt.Position` ) with
   * rich information about the selected position by an
   * action and some relations.
   */
  targetselection: new cwt.Position(),

  /**
   * Holds some information about the current selected action with the selected sub data.
   */
  action: {

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
  },

  /**
   * Holds some information about the current action menu.
   *
   * @namespace
   */
  menu: {

    /**
     * Menu list that contains all menu entries. This implementation is a
     * cached list. The real size of the menu is marked by
     *  `controller.stateMachine.aw2.menuSize`.
     *
     * @example
     *   aw2 is [ entryA, entryB, entryC, null, null ]
     *   size is 3
     */
    data: new cwt.List(20, null),

    enabled: new cwt.List(20, true),

    /** Size of the menu. */
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

    /** Cleans the menu. */
    clean: function () {
      this.size = 0;
    },

    /** Prepares the menu for a given source and target position. */
    generate: (function () {
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
    })(),

    /**
     * Adds unload targets for a transporter at a given position to the menu.
     *
     * @param uid
     * @param x
     * @param y
     * @param menu
     */
    addUnloadTargetsToMenu: function (uid, x, y, menu) {
      var loader = model.unit_data[uid];
      var pid = loader.owner;
      var i = model.unit_firstUnitId(pid);
      var e = model.unit_lastUnitId(pid);
      var unit;

      for (; i <= e; i++) {
        unit = model.unit_data[i];

        if (unit.owner !== cwt.INACTIVE && unit.loadedIn === uid) {
          var movetp = model.data_movetypeSheets[ unit.type.movetype ];

          if (model.move_canTypeMoveTo(movetp, x - 1, y) ||
            model.move_canTypeMoveTo(movetp, x + 1, y) ||
            model.move_canTypeMoveTo(movetp, x, y - 1) ||
            model.move_canTypeMoveTo(movetp, x, y + 1)) menu.addEntry(i, true);
        }
      }
    }
  },

  selection: (function () {

    var sMap = new cwt.SelectionMap(cwt.MAX_MOVE_LENGTH * 4 + 1);

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
  })(),

  addUnloadTargetsToSelection: function (uid, x, y, loadId, selection) {
    var loader = model.unit_data[uid];
    var movetp = model.data_movetypeSheets[ model.unit_data[ loadId ].type.movetype ];

    if (model.move_canTypeMoveTo(movetp, x - 1, y)) selection.setValueAt(x - 1, y, 1);
    if (model.move_canTypeMoveTo(movetp, x + 1, y)) selection.setValueAt(x + 1, y, 1);
    if (model.move_canTypeMoveTo(movetp, x, y - 1)) selection.setValueAt(x, y - 1, 1);
    if (model.move_canTypeMoveTo(movetp, x, y + 1)) selection.setValueAt(x, y + 1, 1);
  },

  selectionRange: cwt.INACTIVE

};