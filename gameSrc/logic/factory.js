//
// Module to control and use the production ability of factories.
//
cwt.Factory = {

  //
  // Returns **true** when the given **property** is a factory, else **false**.
  //
  isFactory: function (property) {
    if (this.DEBUG) cwt.assert(property instanceof cwt.PropertyClass);

    return (property.type.builds !== undefined);
  },

  //
  // Returns **true** when the given **property** is a factory and can produce something technically, else **false**.
  //
  canProduce: function (property) {
    if (this.DEBUG) cwt.assert(this.isFactory(property));

    // check left manpower
    if (!property.owner || !property.owner.manpower) return false;

    // check unit limit and left slots
    var count = property.owner.numberOfUnits;
    var uLimit = (cwt.Config.getValue("unitLimit") || 9999999);
    if (count >= uLimit || count >= cwt.MAX_UNITS) return false;

    return true;
  },

  //
  // Constructs a unit with **type** in a **factory** for the owner of the factory. The owner must have at least one
  // of his unit slots free to do this.
  //
  buildUnit: (function () {

    function buildIt(x, y, property, type) {
      cwt.Lifecycle.createUnit(x, y, property.owner, type);
    }

    return function (factory, type) {
      if (this.DEBUG) {
        cwt.assert(factory instanceof cwt.PropertyClass);
        cwt.assert(cwt.DataSheets.units.isValidSheet(type));
      }

      var sheet = cwt.DataSheets.units.sheets[type];

      factory.owner.manpower--;
      factory.owner.gold -= sheet.cost;

      if (this.DEBUG) {
        cwt.assert(factory.owner.gold >= 0);
        cwt.assert(factory.owner.manpower >= 0);
      }

      cwt.Model.searchProperty(factory, buildIt, null, type);
    };
  })(),

  //
  // Generates the build menu for a **factory** and puts the build able unit type ID's into a **menu**. If
  // **markDisabled** is enabled then the function will add types that temporary aren't produce able (e.g. due
  // lack of money) but marked as disabled.
  //
  generateBuildMenu: function (factory, menu, markDisabled) {
    if (this.DEBUG) {
      cwt.assert(factory instanceof cwt.PropertyClass);
      cwt.assert(menu instanceof cwt.Menu);
      cwt.assert(factory.owner);
    }

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
