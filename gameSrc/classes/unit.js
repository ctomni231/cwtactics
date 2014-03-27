/**
 *
 * @class
 * @extends cwt.IndexMultiton
 */
cwt.Unit = my.Class(null, cwt.IndexMultiton, /** @lends cwt.Unit.prototype */ {

  STATIC: /** @lends cwt.Unit */ {

    /**
     * Maximum number of unit objects for the whole game.
     */
    MULTITON_INSTANCES: cwt.Player.MAX_UNITS * cwt.Player.MULTITON_INSTANCES,

    /**
     * Converts HP points to a health value.
     *
     * @return {number}
     *
     * @example
     *    6 HP -> 60 health
     *    3 HP -> 30 health
     */
    pointsToHealth: function (pt) {
      return (pt * 10);
    },

    /**
     * Converts and returns the HP points from the health
     * value of an unit.
     *
     * @example
     *   health ->  HP
     *     69   ->   7
     *     05   ->   1
     *     50   ->   6
     *     99   ->  10
     */
    healthToPoints: function (health) {
      return parseInt(health / 10, 10) + 1;
    },

    /**
     * Gets the rest of unit health.
     */
    healthToPointsRest: function (health) {
      return health - (parseInt(health / 10) + 1);
    },

    /**
     * Counts the number of units of a player.
     *
     * @param player
     * @return {number}
     */
    countUnitsOfPlayer: function (player) {
      var n = 0;
      for (var i = 0, e = cwt.Unit.MULTITON_INSTANCES; i < e; i++) {
        var unit = cwt.Unit.getInstance(i, false);
        if (unit && unit.owner === player) {
          n++;
        }
      }

      return n;
    }

  },

  constructor: function () {
    this.hp = 99;
    this.ammo = 0;
    this.fuel = 0;
    this.hidden = false;
    this.loadedIn = cwt.INACTIVE;

    this.type = null;
    this.canAct = false;

    /**
     * If the value is null then unit does not exists on the map.
     *
     * @type {cwt.Player}
     */
    this.owner = null;

    this.sprite = null;
  },

  initByType: function (type) {

  },

  /**
   * Damages a unit.
   */
  takeDamage: function (damage, minRest) {
    this.hp -= damage;

    if (minRest && this.hp <= minRest) {
      this.hp = minRest;
    }
  },

  /**
   * Heals an unit. If the unit health will be greater than the maximum
   * health value then the difference will be added as gold to the
   * owners gold depot.
   */
  heal: function (health, diffAsGold) {
    this.hp += health;
    if (this.hp > 99) {

      // pay difference of the result health and 100 as
      // gold ( in relation to the unit cost ) to the
      // unit owners gold depot
      if (diffAsGold === true) {
        var diff = this.hp - 99;
        this.owner.gold += parseInt((this.type.cost * diff) / 100, 10);
      }

      this.hp = 99;
    }
  },

  /**
   * @return {boolean} true when hp is greater than 0 else false
   */
  isAlive: function () {
    return this.hp > 0;
  }
});