/**
 *
 * @class
 */
cwt.TileVariantInfo = my.Class(/** @lends cwt.TileVariantInfo.prototype */ {

  constructor: function (desc, connection) {
    this.desc = desc;
    this.connection = connection;
  },

  /**
   *
   * @param type
   * @return {string}
   */
  grabShortKey: function (type) {
    if (type && this.desc[type]) return this.desc[type];
    else return "";
  },

  /**
   *
   * @param {string} typeN
   * @param {string} typeNE
   * @param {string} typeE
   * @param {string} typeSE
   * @param {string} typeS
   * @param {string} typeSW
   * @param {string} typeW
   * @param {string} typeNW
   */
  getVariant: function (typeN, typeNE, typeE, typeSE, typeS, typeSW, typeW, typeNW) {

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

        // check plus
        if (cConn[1] !== "" && cConn[1] !== typeN) continue;
        if (cConn[2] !== "" && cConn[2] !== typeE) continue;
        if (cConn[3] !== "" && cConn[3] !== typeS) continue;
        if (cConn[4] !== "" && cConn[4] !== typeW) continue;

      } else {
        // check cross
        if (cConn[1] !== "" && cConn[1] !== typeN) continue;
        if (cConn[2] !== "" && cConn[2] !== typeNE) continue;
        if (cConn[3] !== "" && cConn[3] !== typeE) continue;
        if (cConn[4] !== "" && cConn[4] !== typeSE) continue;
        if (cConn[5] !== "" && cConn[5] !== typeS) continue;
        if (cConn[6] !== "" && cConn[6] !== typeSW) continue;
        if (cConn[7] !== "" && cConn[7] !== typeW) continue;
        if (cConn[8] !== "" && cConn[8] !== typeNW) continue;
      }
    }
  }
})