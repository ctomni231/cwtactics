//
//
// @namespace
//
cwt.Factory = {

  //
  // Returns `true` when the given factory object (by its `prid`) is
  // a factory, else `false`.
  //
  // @param {cwt.Property} property
  // @return {boolean}
  //
  isFactory: function(property) {
    if (this.DEBUG) cwt.assert(property instanceof cwt.Property);

    return (property.type.builds !== void 0);
  },

  //
  // Returns `true` when the given factory object is a factory
  // and can produce something technically, else `false`.
  //
  // @param {cwt.Property} property
  // @return {boolean}
  //
  canProduce: function(property) {
    if (this.DEBUG) cwt.assert(property instanceof cwt.Property);

    // check_ manpower
    if (!property.owner || !property.owner.manpower) return false;

    // check_ unit limit
    var uLimit = cwt.Config.getValue("unitLimit");
    if (!uLimit) uLimit = 9999999;
    var count = model.unit_countUnits(playerId);
    if (count >= uLimit) return false;

    // slots free ?
    if (count >= MAX_UNITS_PER_PLAYER) return false;

    return true
  },

  //
  // Constructs a unit for a player. At least one slot
  // must be free to do this.
  //
  // @param {cwt.Property} factory
  // @param {String} type
  //
  buildUnit: function(factory, type) {
    if (this.DEBUG) cwt.assert(factory instanceof cwt.Property);
    if (this.DEBUG) cwt.assert(cwt.UnitSheet.isValidSheet(type));

    var sheet = cwt.UnitSheet.sheets[type];

    factory.owner.manpower--;
    factory.owner.gold -= sheet.cost;

    if (this.DEBUG) cwt.assert(factory.owner.gold >= 0);

    cwt.Map.searchProperty(factory, cwt.Lifecycle.createUnit, cwt.Lifecycle, type);
  },

  //
  // Generates the build menu for a given factory object (by its `prid`).
  //
  // @param {cwt.Property} factory
  // @param {cwt.Menu} menu
  // @param {boolean=} markDisabled
  // @return {boolean}
  //
  generateBuildMenu: function(factory, menu, markDisabled) {
    if (this.DEBUG) cwt.assert(factory instanceof cwt.Property);
    if (this.DEBUG) cwt.assert(menu instanceof cwt.Menu);
    if (this.DEBUG) cwt.assert(factory.owner);

    var unitTypes = cwt.UnitSheet.types;
    var bList = factory.type.builds;
    var gold = factory.owner.gold;

    for (var i = 0, e = unitTypes.length; i < e; i++) {
      var key = unitTypes[i];
      var type = cwt.UnitSheet.sheets[key];

      if (bList.indexOf(type.movetype) === -1) continue;

      // Is the tile blocked ?
      if (type.blocked) return false;

      if (type.cost <= gold || markDisabled) {
        menu.addEntry(key, (type.cost <= gold));
      }
    }
  }

};
