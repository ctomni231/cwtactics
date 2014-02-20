/**
 *
 * @namespace
 */
cwt.Capture = {

  /**
   * Returns true, when a unit can capture a property,
   * else false.
   */
  canCapture: function (unit) {
    return (unit.type.captures > 0);
  },

  /**
   *
   * @param property
   * @return {boolean}
   */
  canBeCaptured: function (property) {
    return (property.type.capturePoints > 0);
  },

  /**
   *
   */
  captureProperty: function (property,unit) {
    if (DEBUG) assert(unit);

    this.points -= cwt.Property.CAPTURE_STEP;
    cwt.ClientEvents.unitCaptures(this,unit);

    if (this.points <= 0) {
      this.owner = unit.owner;
      this.points = cwt.Property.CAPTURE_POINTS;
      cwt.ClientEvents.propertyCaptured(this,unit);
    }
  }
};