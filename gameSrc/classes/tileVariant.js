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
   * Returns the variant number in relation to a given set of neighbour types.
   *
   * @param {string} typeN
   * @param {string} typeE
   * @param {string} typeS
   * @param {string} typeW
   * @param {string?} typeNE
   * @param {string?} typeSE
   * @param {string?} typeSW
   * @param {string?} typeNW
   */
  getVariant: function (typeN, typeE,  typeS, typeW, typeNE, typeSE, typeSW, typeNW) {

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
        if (cConn[2] !== "" && cConn[2] !== typeE) continue;
        if (cConn[3] !== "" && cConn[3] !== typeS) continue;
        if (cConn[4] !== "" && cConn[4] !== typeW) continue;
        if (cConn[5] !== "" && cConn[5] !== typeNE) continue;
        if (cConn[6] !== "" && cConn[6] !== typeSE) continue;
        if (cConn[7] !== "" && cConn[7] !== typeSW) continue;
        if (cConn[8] !== "" && cConn[8] !== typeNW) continue;
      }

      return cConn[0];
    }
  }
})
