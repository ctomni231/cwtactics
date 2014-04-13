cwt.TileVariants = {

  /**
   *
   */
  types: {},

  /**
   *
   * @param type
   * @param desc
   * @param connection
   */
  registerVariantInfo: function (type, desc, connection) {
    if (cwt.DEBUG) cwt.assert(!this.types.hasOwnProperty(type));

    this.types[type] = new cwt.TileVariantInfo(desc, connection);
  },

  /**
   *
   */
  updateTileSprites: function () {
    var x;
    var y;
    var xe = cwt.Map.width;
    var ye = cwt.Map.height;
    var mapData = cwt.Map.data;

    for (x = 0; x < xe; x++) {
      for (y = 0; y < ye; y++) {

        var tile = mapData[x][y];

        // tile has variants
        if (this.types[tile.type.ID]) {
          tile.variant = this.types[this.type.ID].getVariant(

            // N
            (y > 0) ? mapData[x][y - 1].type.ID : "",

            // NE
            (y > 0 && x < cwt.Map.width - 1) ? mapData[x + 1][y - 1].type.ID : "",

            // E
            (x < cwt.Map.width - 1) ? mapData[x + 1][y].type.ID : "",

            // SE
            (y < cwt.Map.height - 1 && x < cwt.Map.width - 1) ? mapData[x + 1][y + 1].type.ID : "",

            // S
            (y < cwt.Map.height - 1) ? mapData[x][y + 1].type.ID : "",

            // SW
            (y < cwt.Map.height - 1 && x > 0) ? mapData[x - 1][y + 1].type.ID : "",

            // W
            (x > 0) ? mapData[x - 1][y].type.ID : "",

            // NW
            (y > 0 && x > 0) ? mapData[x - 1][y - 1].type.ID : ""
          );
        } else {
          tile.variant = 0;
        }
      }
    }
  }
};