//
// Returns **true** when a **unit** can capture a properties, else **false**.
//
exports.canCapture = function (unit) {
  return (unit.type.captures > 0);
};

// Returns **true** when a **property** can be captured, else **false**.
//
exports.canBeCaptured = function (property) {
  return (property.type.capturePoints > 0);
};

//
// The **unit** captures the **property**. When the capture points of the **property** falls down to zero, then
// the owner of the **property** changes to the owner of the capturing **unit** and **true** will be returned. If the
// capture points does not fall down to zero then **false** will be returned.
//
exports.captureProperty = function (property, unit) {
  if (this.DEBUG) cwt.assert(unit);

  this.points -= cwt.PropertyClass.CAPTURE_STEP;
  if (this.points <= 0) {
    this.owner = unit.owner;
    this.points = cwt.PropertyClass.CAPTURE_POINTS;
    // TODO: if max points are static then the configurable points from the property sheets can be removed

    // was captured
    return true;
  }

  // was not captured
  return false;
};