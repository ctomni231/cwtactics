//
//
cwt.SheetDatabaseObject = my.Class({

  constructor: function(impl) {
    cwt.assert(impl);

    // Holds all type sheet objects.
    //
    this.sheets = {};

    // Holds all type names.
    //
    this.types = [];

    //
    //
    this.check_ = impl.afterCheck;

    //
    //
    this.validator_ = new jjv();

    // register schema
    this.validator_.addSchema("constr", impl.schema);

    // add id check
    var that = this;
    this.validator_.addCheck('isID', function(v, p) {
      if (p) {
        return !that.sheets.hasOwnProperty(v);
      } else {
        return true;
      }
    });

    // add custom checks
    if (impl.checks) {
      for (var key in impl.checks) {
        if (impl.checks.hasOwnProperty(key)) {
          this.validator_.addCheck(key, impl.checks[key]);
        }
      }
    }
  },

  //
  // Registers a sheet in the database.
  //
  registerSheet: function(sheet) {

    // validate it
    cwt.assert(!this.validator_.validate("constr", sheet));

    // add it
    this.sheets[sheet.ID] = sheet;
    this.types.push(sheet.ID);
  },

  //
  //
  getSheet: function(id) {
    if (cwt.DEBUG) cwt.assert(this.isValidId(id));

    return this.sheets[id];
  },

  isValidId: function(id) {
    return this.sheets.hasOwnProperty(id);
  },

  //
  //
  isValidSheet: function(sheet) {
    for (var i = 0, e = this.types.length; i < e; i++) {
      if (this.sheets[this.types[i]] === sheet) return true;
    }

    return false;
  }
});
