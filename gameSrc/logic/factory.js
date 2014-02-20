/**
 *
 * @namespace
 */
cwt.Factory = {

  /**
   * Returns `true` when the given factory object (by its `prid`) is
   * a factory, else `false`.
   */
  isFactory: function (property) {
    if (DEBUG) assert(property instanceof cwt.Property);

    return property.type.builds;
  },

  /**
   * Returns `true` when the given factory object is a factory
   * and can produce something technically, else `false`.
   */
  canProduce: function (property) {
    if (DEBUG) assert(property instanceof cwt.Property);

    // check manpower
    if (!property.owner || !property.owner.manpower) return false;

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
   * Constructs a unit for a player. At least one slot
   * must be free to do this.
   */
  buildUnit: function (factory,type) {
    if (DEBUG) assert(factory instanceof cwt.Property);
    if (DEBUG) assert(cwt.PropertySheet.isValidSheet(type));

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
  }

};