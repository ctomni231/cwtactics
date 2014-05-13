/**
 *
 */
cwt.SheetDatabase = my.Class({

  /**
   * Registers a sheet in the database.
   */
  registerSheet: function (sheet) {

    // validate it
    this.validator_.validate("constr", sheet);

    // add it
    this.sheets[sheet.ID] = sheet;
    this.types.push(sheet.ID);

    if (this.check_) {
      this.check_(sheet);
    }
  },

  /**
   *
   * @param sheet
   * @return {boolean}
   */
  isValidSheet: function (sheet) {
    for (var i = 0, e = this.types.length; i < e; i++) {
      if (this.sheets[this.types[i]] === sheet) return true;
    }

    return false;
  },

  constructor: function (impl) {
    cwt.assert(impl);

    /**
     *
     * @type {jjv}
     */
    this.validator_ = new jjv();

    /**
     * Holds all type sheet objects.
     *
     * @type {Object}
     */
    this.sheets = {};

    /**
     * Holds all type names.
     *
     * @type {Array}
     */
    this.types = [];

    /**
     *
     * @type {afterCheck}
     */
    this.check_ = impl.afterCheck;

    // register schema
    this.validator_.addSchema("constr", impl.schema);

    // add id check
    var that = this;
    this.validator_.addCheck('isID', function (v, p) {
      if (p) {
        return !that.sheets.hasOwnProperty(v);
      } else {
        return true;
      }
    });

    // add custom checks
    if (impl.checks) {
      for (key in impl.checks) {
        if (impl.checks.hasOwnProperty(key)) {
          this.validator_.addCheck(key, impl.checks[key]);
        }
      }
    }
  }
});