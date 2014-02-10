/**
 * Movetype sheet holds the static data of an unit type.
 *
 * @class
 */
cwt.MovetypeSheet = new cwt.SheetDatabase({

  /**
   * Accepts key,value pairs where the key is a tile sheet id or *.
   * The value has to be a positive integer greater than 0 or -1.
   *
   * @param key
   * @param value
   * @private
   */
  typeCheck_: function (key, value) {
    if (key === "*") return;
    assert(cwt.TileSheet.sheets.hasOwnProperty(key));
    assert(value === -1 || value > 0);
  },

  check: function ( sheet ) {
    cwt.doObjectCheck( sheet.costs, this.typeCheck_ );
  }
});

/**
 * Registers a non movable move type.
 */
cwt.MovetypeSheet.registerSheet({
  "ID"    : "NO_MOVE",
  "sound" : null,
  "costs" : {
    "*" : -1
  }
});