/**
 * @class
 * @extends cwt.IndexMultiton
 */
cwt.Property = my.Class(null,cwt.IndexMultiton,/** @lends cwt.Property.prototype */ {

  STATIC: /** @lends cwt.Property */ {

    /**
     * Number of maximum properties.
     */
    MULTITON_INSTANCES: 200,

    CAPTURE_POINTS: 20,

    CAPTURE_STEP: 10,

    /**
     *
     */
    countProperties: function (player) {
      var n = 0;

      for (var i = 0, e = this.MULTITON_INSTANCES; i < e; i++) {
        var prop = cwt.Property.getInstance(i, true);
        if (prop && prop.owner === player) n++;
      }

      return n;
    },


    $onSaveGame: function (data) {
      dom.prps = [];
      for (var i = 0, e = model.property_data.length; i < e; i++) {
        prop = model.property_data[i];

        // persist it if the owner of the property is not INACTIVE
        if (prop.owner !== cwt.INACTIVE) {
          dom.prps.push([
            i,
            prop.x,
            prop.y,
            prop.type.ID,
            prop.capturePoints,
            prop.owner
          ]);
        }
      }
    },

    $onLoadGame: function (data) {

      // reset all
      for (var i = 0, e = model.property_data.length; i < e; i++) {
        model.property_data[i].owner = cwt.INACTIVE;
        model.property_data[i].type = null;
      }

      for (var i = 0, e = dom.prps.length; i < e; i++) {
        data = dom.prps[i];

        cwt.assert(util.intRange(data[0], 0, MAX_PROPERTIES - 1)); // id
        cwt.assert(util.intRange(data[1], 0, MAX_MAP_WIDTH - 1)); // x
        cwt.assert(util.intRange(data[2], 0, MAX_MAP_HEIGHT - 1)); // y
        cwt.assert(
          (util.isString(data[3]) && !util.isUndefined(model.data_tileSheets[data[3]].capturePoints)) ||
            typeof model.data_tileSheets[data[3]].cannon !== "undefined" ||
            typeof model.data_tileSheets[data[3]].laser !== "undefined" ||
            typeof model.data_tileSheets[data[3]].rocketsilo !== "undefined"
        );
        cwt.assert((util.intRange(data[4], 1, // capture points
          model.data_tileSheets[data[3]].capturePoints)) ||
          (util.intRange(data[4], -99, -1)) ||
          typeof model.data_tileSheets[data[3]].rocketsilo !== "undefined"
        );
        cwt.assert(util.intRange(data[5], -1, MAX_PLAYER - 1)); // owner

        // copy aw2 into model
        property = model.property_data[data[0]];
        property.type = model.data_tileSheets[data[3]];
        property.capturePoints = 20;
        property.owner = data[5];
        property.x = data[1];
        property.y = data[2];
        model.property_posMap[data[1]][data[2]] = property;
      }

      for (var i = 0, e = data.prps.length; i < e; i++) {
        var data = data.prps[i];
        this.getInstance([data[0]]).capturePoints = data[4];
      }


      /*
       (function () {

       function placeCannonMetaData(x, y) {
       var prop = model.property_posMap[x][y];
       var cannon = prop.type.cannon;
       var size = prop.type.bigProperty;

       cwt.assert(x - size.x >= 0);
       cwt.assert(y - size.y >= 0);

       var ax = x - size.actor[0];
       var ay = y - size.actor[1];
       var ox = x;
       var oy = y;
       for (var xe = x - size.x; x > xe; x--) {

       y = oy;
       for (var ye = y - size.y; y > ye; y--) {

       // place blocker
       if (x !== ox || y !== oy) {
       if (this.DEBUG) util.log("creating invisible property at", x, ",", y);
       model.events.property_createProperty(prop.owner, x, y, "PROP_INV");
       }

       // place actor
       if (x === ax && y === ay) {
       if (this.DEBUG) util.log("creating cannon unit at", x, ",", y);
       model.events.createUnit(model.unit_getFreeSlot(prop.owner), prop.owner,
       x, y, "CANNON_UNIT_INV");
       }

       }
       }
       }

       // // Places the necessary meta units for bigger properties.
       //
       model.event_on("gameround_start", function () {
       for (var x = 0, xe = model.map_width; x < xe; x++) {
       for (var y = 0, ye = model.map_height; y < ye; y++) {

       var prop = model.property_posMap[x][y];
       if (prop) {

       if (prop.type.bigProperty && prop.type.cannon) {
       placeCannonMetaData(x, y);
       } else if (prop.type.cannon) {
       if (this.DEBUG) util.log("creating cannon unit at", x, ",", y);
       model.events.createUnit(model.unit_getFreeSlot(prop.owner), prop.owner,
       x, y, "CANNON_UNIT_INV");
       } else if (prop.type.laser) {
       if (this.DEBUG) util.log("creating laser unit at", x, ",", y);
       model.events.createUnit(model.unit_getFreeSlot(prop.owner), prop.owner,
       x, y, "LASER_UNIT_INV");
       }

       }
       }
       }
       });

       })();
       */
    }

  },

  constructor: function () {
    this.points = 20;

    /**
     * @type {cwt.Player}
     */
    this.owner = null;

    this.type = null;
  },

  /**
   * Returns true, when the given property is neutral, else false.
   */
  isNeutral: function () {
    return this.owner === null;
  }

});