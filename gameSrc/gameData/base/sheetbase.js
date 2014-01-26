/**
 *
 */
cwt.SheetDatabase = my.Class({
  STATIC: {

    /**
     * Holds all sheet objects.
     */
    sheets: {},

    /**
     * Holds all sheet names.
     */
    types: [],

    /**
     * Registers a sheet in the database.
     */
    registerSheet: function (sheet) {
      this.sheets[sheet.ID] = sheet;
      this.types.push(sheet.ID);
    }

  }
});