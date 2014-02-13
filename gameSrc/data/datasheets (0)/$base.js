/**
 *
 */
cwt.SheetDatabase = my.Class({

  /**
   * Registers a sheet in the database.
   */
  registerSheet: function (sheet) {
    this.sheets[sheet.ID] = sheet;
    this.types.push(sheet.ID);
  },

  checkDatabase: function () {
    for( var i= 0, e=this.types.length; i<e; i++ ){
      this.impl.check( this.sheets[this.types[i]] );
    }
  },

  isValidSheet: function ( sheet) {
    for( var i= 0, e=this.types.length; i<e; i++ ){
      if( this.sheets[this.types[i]] === sheet ) return true;
    }

    return false;
  },

  constructor: function ( impl ) {
    assert(impl);

    /**
     * Implementation for checker. Has at least the check function.
     *
     * @type {*}
     */
    this.impl = impl;

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

    if( impl.afterConstruct ) impl.afterConstruct( this );
  }
});