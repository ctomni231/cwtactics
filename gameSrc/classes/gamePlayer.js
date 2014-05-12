/**
 * @class
 */
cwt.Player = my.Class(/** @lends cwt.Player.prototype */ {

  STATIC: /** @lends cwt.Player */ {

    /**
     * Maximum number of instances.
     *
     * @constant
     */
    MULTITON_INSTANCES: 4,

    /**
     * Number of maximum units per player.
     *
     * @constant
     */
    MAX_UNITS: 50,

    /**
     * @type {cwt.Player}
     */
    activeClientPlayer: null
  },

  constructor: function () {
    this.id = -1;

    this.team = cwt.INACTIVE;
    this.gold = 0;
    this.power = 0;
    this.activePower = cwt.INACTIVE;
    this.powerUsed = 0;
    this.manpower = Math.POSITIVE_INFINITY;
    this.coA = null;

    // use a variable for performance reasons
    this.numberOfUnits = 0;

    this.turnOwnerVisible = false;
    this.clientVisible = false;
    this.clientControlled = false;
  },

  /**
   *
   * @param level
   * @return {boolean}
   */
  isPowerActive: function (level) {
    return this.activePower === level;
  },

  /**
   * A player has loosed the game round due a specific reason. This
   * function removes all of his units and properties. Furthermore
   * the left teams will be checked. If only one team is left then
   * the end game event will be invoked.
   */
  deactivate: function () {

    // remove all units
    var i, e;
    i = model.unit_firstUnitId(pid);
    e = model.unit_lastUnitId(pid);
    for (; i < e; i++) {
      if (model.unit_data[i].owner !== cwt.INACTIVE) model.events.destroyUnit(i);
    }

    // remove all properties
    i = 0;
    e = model.property_data.length;
    for (; i < e; i++) {
      var prop = model.property_data[i];
      if (prop.owner === pid) {
        prop.owner = -1;

        // change type when the property is a
        // changing type property
        var changeType = prop.type.changeAfterCaptured;
        if (changeType) model.events.property_changeType(i, changeType);
      }
    }

    // mark player slot as remove by removing
    // its team reference
    model.player_data[pid].team = -1;

    // when no opposite teams are found then the game has ended
    if (!model.player_areEnemyTeamsLeft()) {
      controller.commandStack_localInvokement("player_noTeamsAreLeft");
    }
  }

});

// use index based multiton trait
my.extendClass(cwt.Player,{STATIC:cwt.IndexMultiton});

// register player ids (used to calculate
// the unit id's for example)
cwt.Player.getInstance(0).id = 0;
cwt.Player.getInstance(1).id = 1;
cwt.Player.getInstance(2).id = 2;
cwt.Player.getInstance(3).id = 3;