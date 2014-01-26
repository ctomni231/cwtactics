my.extendClass(cwt.Property, {
  
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
});