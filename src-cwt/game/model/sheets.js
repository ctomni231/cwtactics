var sheetDB = {
  getRandomSheet() {
    return this.sheets[this.names[parseInt(Math.random() * this.names.length, 10)]];
  },
  getSheet(id) {
    return this.requireNonNull(this.sheets[id]);
  }
};

/**
 *
 * @param sheets list<object>
 *          array of sheet objects
 * @param typeObjectFactory function(object): sheet
 *          function that takes the raw data object and converts it to a sheet object
 *          which means the results sheet is check and valid
 *
 * @return {
 *   getRandomSheet(): sheet
 *          returns a random from the sheets list
 *   getSheet(id): sheet throws Error 
 *          returns a sheet with the given id or throws an error when no sheet with 
 *          the id exists in the sheet list
 *           
 * }
 */
cwt.produceSheetDB = function(sheets, typeObjectFactory) {
  var sheetsMap = {};

  sheets.forEach(value => sheetsMap[value.id] = typeObjectFactory(value));

  return cwt.produceInstance(sheetDB, {
    sheets: sheetsMap,
    names: Object.keys(sheetsMap),
    requireNonNull: cwt.produceTypeAsserter().isSomething
  });
};