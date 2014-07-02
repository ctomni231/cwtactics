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