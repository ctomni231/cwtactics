var constants = require("./constants");
var assert = require("./functions").assert;
var model = require("./model");

//
//
// @class
//
exports.TileVariantInfoObject = my.Class({

  constructor: function (desc, connection) {
    this.desc = desc;
    this.connection = connection;
  },

  //
  //
  // @param type
  // @return {string}
  //
  grabShortKey: function (type) {
    if (type && this.desc[type]) return this.desc[type];
    else return "";
  },

  //
  // Returns the variant number in relation to a given set of neighbour types.
  //
  // @param {string} typeN
  // @param {string} typeE
  // @param {string} typeS
  // @param {string} typeW
  // @param {string?} typeNE
  // @param {string?} typeSE
  // @param {string?} typeSW
  // @param {string?} typeNW
  //
  getVariant: function (typeN, typeE, typeS, typeW, typeNE, typeSE, typeSW, typeNW) {

    // grab shorts
    typeN = this.grabShortKey(typeN);
    typeNE = this.grabShortKey(typeNE);
    typeE = this.grabShortKey(typeE);
    typeSE = this.grabShortKey(typeSE);
    typeS = this.grabShortKey(typeS);
    typeSW = this.grabShortKey(typeSW);
    typeW = this.grabShortKey(typeW);
    typeNW = this.grabShortKey(typeNW);

    // search variant
    for (var i = 0, e = this.connection.length; i < e; i++) {
      var cConn = this.connection[i];
      if (cConn.length === 5) {

        // check_ plus
        if (cConn[1] !== "" && cConn[1] !== typeN) continue;
        if (cConn[2] !== "" && cConn[2] !== typeE) continue;
        if (cConn[3] !== "" && cConn[3] !== typeS) continue;
        if (cConn[4] !== "" && cConn[4] !== typeW) continue;

      } else {

        // check_ cross
        if (cConn[1] !== "" && cConn[1] !== typeN) continue;
        if (cConn[2] !== "" && cConn[2] !== typeNE) continue;
        if (cConn[3] !== "" && cConn[3] !== typeE) continue;
        if (cConn[4] !== "" && cConn[4] !== typeSE) continue;
        if (cConn[5] !== "" && cConn[5] !== typeS) continue;
        if (cConn[6] !== "" && cConn[6] !== typeSW) continue;
        if (cConn[7] !== "" && cConn[7] !== typeW) continue;
        if (cConn[8] !== "" && cConn[8] !== typeNW) continue;
      }

      return cConn[0];
    }
  }
});

//
//
//
var types = {};

//
//
// @param type
// @param desc
// @param connection
//
exports.registerVariantInfo = function (type, desc, connection) {
  if (constants.DEBUG) assert(!this.types.hasOwnProperty(type));
  this.types[type] = new exports.TileVariantInfoObject(desc, connection);
};

//
//
//
exports.updateTileSprites = function () {
  var x;
  var y;
  var xe = model.mapWidth;
  var ye = model.mapHeight;
  var mapData = model.mapData;

  for (x = 0; x < xe; x++) {
    for (y = 0; y < ye; y++) {

      var tile = mapData[x][y];

      // tile has variants
      if (types[tile.type.ID]) {
        tile.variant = types[tile.type.ID].getVariant(

          // N
          (y > 0) ? mapData[x][y - 1].type.ID : "",

          // E
          (x < model.mapWidth - 1) ? mapData[x + 1][y].type.ID : "",

          // S
          (y < model.mapHeight - 1) ? mapData[x][y + 1].type.ID : "",

          // W
          (x > 0) ? mapData[x - 1][y].type.ID : "",

          // NE
          (y > 0 && x < model.mapWidth - 1) ? mapData[x + 1][y - 1].type.ID : "",

          // SE
          (y < model.mapHeight - 1 && x < model.mapWidth - 1) ? mapData[x + 1][y + 1].type.ID : "",

          // SW
          (y < model.mapHeight - 1 && x > 0) ? mapData[x - 1][y + 1].type.ID : "",

          // NW
          (y > 0 && x > 0) ? mapData[x - 1][y - 1].type.ID : ""
        );
      } else {
        tile.variant = 0;
      }
    }
  }
};