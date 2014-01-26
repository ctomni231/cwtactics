my.extendClass(cwt.Property, {

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
  siloCanBeFired: function ( unit ) {
    if(this.type.rocketsilo.fireable.indexOf(unit.type.ID) === -1) return false;
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

    /*
  // Silo regeneration.
  //
  model.event_on("silofire_invoked", function (x, y, tx, ty, owner) {
    var silo = model.property_posMap[x][y];
    var siloId = model.property_extractId(silo);
    var type = silo.type;

    model.events.dayEvent(
      5,
      "property_changeTypeById",
      siloId,
      model.data_propertyTypes.indexOf(type)
    );
  });
  */

});