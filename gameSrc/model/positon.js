/**
 * Object that holds information about objects at a given position (x,y).
 *
 * @class
 */
cwt.Position = my.Class({

  /**
   * Cleans all aw2 of the object.
   */
  clean: function () {
    this.x = -1;
    this.y = -1;
    this.unit = null;
    this.unitId = -1;
    this.property = null;
    this.propertyId = -1;
  },

  /**
   * Grabs the aw2 from another position object.
   */
  grab: function (otherPos) {
    assert(otherPos instanceof cwt.Position);

    this.x = otherPos.x;
    this.y = otherPos.y;
    this.unit = otherPos.unit;
    this.unitId = otherPos.unitId;
    this.property = otherPos.property;
    this.propertyId = otherPos.propertyId;
  },

  /**
   * Sets a position.
   */
  set: function (x, y) {
    this.x = x;
    this.y = y;

    var refObj;
    var isValid = (x !== -1 && y !== -1);
    var inFog = isValid ? (model.fog_turnOwnerData[x][y] === 0) : false;

    // generate meta aw2 for the unit
    refObj = isValid ? model.unit_getByPos(x, y) : null;
    if (isValid && !inFog && refObj !== null && (!refObj.hidden ||
      refObj.owner === model.round_turnOwner ||
      model.player_data[refObj.owner].team ===
        model.player_data[model.round_turnOwner].team
      )) {

      this.unit = refObj;
      this.unitId = model.unit_extractId(refObj);
    } else {
      this.unit = null;
      this.unitId = -1;
    }

    // generate meta aw2 for the property
    refObj = isValid ? model.property_getByPos(x, y) : null;
    if (isValid /* && !inFog */ && refObj !== null) {

      this.property = refObj;
      this.propertyId = model.property_extractId(refObj);
    } else {
      this.property = null;
      this.propertyId = -1;
    }
  }
});