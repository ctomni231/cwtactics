/**
 * @class
 */
cwt.Property = my.Class({

  STATIC: {

    /**
     *
     */
    countProperties: function (player) {
      var n = 0;

      var props = model.property_data;
      for (var i = 0, e = props.length; i < e; i++) {

        // count all properties that belongs to the selected pid
        if (props[i].owner === pid) n++;
      }

      return n;
    }

  },

  constructor: function (type) {
    this.x = 0;
    this.y = 0;
    this.points = 20;
    this.owner = null;
    this.type = cwt.TileSheet.sheets[type];
  },

  /**
   * Returns true, when the given property is neutral, else false.
   */
  isNeutral: function () {
    return this.owner === null;
  },

  /**
   * Returns true, when a unit can capture a property,
   * else false.
   */
  canBeCapturedBy: function (unit) {
    return this.type.capturePoints > 0 && unit.type.captures > 0;
  },

  /**
   *
   */
  captureProperty: function (unit) {
    this.capture(unit);
  },

  /**
   * Returns true if a property id is a rocket silo. A rocket silo
   * has the ability to fire a rocket to a position with an impact.
   */
  isRocketSilo: function () {
    if (!this.type.rocketsilo) return false;
    if (arguments.length === 2) {
      var fuidType = model.unit_data[uid].type.ID;
      if (type.rocketsilo.fireable.indexOf(fuidType) === -1) {
        return false;
      }
    }

    return true;
  },

  /**
   * Returns true if a property id is a rocket silo. A rocket silo
   * has the ability to fire a rocket to a position with an impact.
   */
  siloCanBeFired: function (unit) {
    if (this.type.rocketsilo.fireable.indexOf(unit.type.ID) === -1) return false;
    return true;
  },

  /**
   *
   */
  rocketCanBeFiredTo: function (x, y) {
    if (!model.map_isValidPosition(x, y)) return false;
  },

  /**
   * fires a rocket to a given position (x,y) and inflicts damage to
   * all units in a range around the position.
   */
  fireSilo: function (x, y, tx, ty, owner) {
    var silo = model.property_posMap[x][y];
    var siloId = model.property_extractId(silo);
    var type = silo.type;
    var range = type.rocketsilo.range;
    var damage = model.unit_convertPointsToHealth(type.rocketsilo.damage);

    model.events.property_changeType(siloId, model.data_tileSheets[type.changeTo]);
    model.events.rocketFly(x, y, tx, ty);
    model.events.explode_invoked(tx, ty, range, damage, owner);
  },

  /**
   *
   */
  canBeTransfered: function () {
    if (model.property_data[prid].type.notTransferable) return false;
  },

  /**
   *
   */
  getTransferTargets: function (menu) {
    for (var i = 0, e = MAX_PLAYER; i < e; i++) {
      if (i !== pid && model.player_data[i].team !== INACTIVE_ID) {
        menu.addEntry(i, true);
      }
    }
  },

  /**
   *
   */
  transferToPlayer: function (player) {
    var prop = model.property_data[sprid];
    prop.owner = tplid;

    var x;
    var y;
    var xe = model.map_width;
    var ye = model.map_height;

    for (x = 0; x < xe; x++) {
      for (y = 0; y < ye; y++) {
        if (model.property_posMap[x][y] === prop) {
          // TODO fog?
        }
      }
    }
  },

  /**
   * Returns `true` when the given factory object (by its `prid`) is
   * a factory, else `false`.
   */
  isFactory: function () {
    return this.type.builds;
  },

  /**
   * Returns `true` when the given factory object (by its `prid`) is a factory
   * and can produce something technically, else `false`.
   */
  canProduce: function () {
    // check manpower
    if (!this.owner || !this.owner.manpower) return false;

    // check unit limit
    var uLimit = cwt.Config.getValue("unitLimit");
    if (!uLimit) uLimit = 9999999;
    var count = model.unit_countUnits(playerId);
    if (count >= uLimit) return false;

    // slots free ?
    if (count >= MAX_UNITS_PER_PLAYER) return false;

    return true
  },

  /**
   * Contructs a unit for a player. At least one slot
   * must be free to do this.
   */
  buildUnit: function (type) {

    // decrease manpower
    factory.owner.manpower--;

    var prop = model.property_posMap[x][y];
    var cost = model.data_unitSheets[type].cost;
    var pl = model.player_data[prop.owner];

    pl.gold -= cost;
    assert(pl.gold >= 0);

    model.events.createUnit(model.unit_getFreeSlot(prop.owner), prop.owner, x, y, type);
  },

  /**
   * Generates the build menu for a given factory object (by its `prid`).
   */
  generateBuildMenu: function (prid, menu, markDisabled) {
    assert(model.property_isValidPropId(prid));
    assert(model.factory_isFactory(prid));

    var property = model.property_data[prid];

    // the factory must be owner by someone
    assert(model.player_isValidPid(property.owner));

    var availGold = model.player_data[property.owner].gold;
    var unitTypes = model.data_unitTypes;
    var bList = property.type.builds;

    for (var i = 0, e = unitTypes.length; i < e; i++) {
      var key = unitTypes[i];
      var type = model.data_unitSheets[key];

      if (bList.indexOf(type.movetype) === -1) continue;

      // Is the tile blocked ?
      if( type.blocked ) return false;

      if (type.cost <= availGold || markDisabled) {
        menu.addEntry(key, (type.cost <= availGold));
      }
    }
  },

  /**
   * Gives funds.
   */
  raiseFunds: function () {
    if (typeof this.type.funds !== "number") return;
    this.owner.gold += this.type.funds;

    cwt.ClientEvents.goldChange(this.owner,this.type.funds);
  }

});