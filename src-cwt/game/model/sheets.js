/**
 *
 * @param sheetList list<object>
 *          array of sheet objects
 * @param typeObjectFactory function(object): sheet
 *          function that takes the raw data object and converts it to a sheet object
 *          which means the results sheet is check and valid
 *
 * @return {
 *
 *   getRandomSheet(): sheet
 *          returns a random from the sheetList list
 *
 *   getSheet(id): sheet throws Error 
 *          returns a sheet with the given id or throws an error when no sheet with 
 *          the id exists in the sheet list
 *           
 * }
 */
cwt.produceSheetDB = function(sheetList, typeObjectFactory) {
  const sheets = cwt.listToObject(sheetList, data => data.id);
  const names = sheetList.map(value => value.id);
  const requireNonNull = cwt.produceTypeAsserter().isSomething;

  return {
    getRandomSheet() {
      return sheets[names[parseInt(Math.random() * names.length, 10)]];
    },

    getSheet(id) {
      return requireNonNull(sheets[id]);
    }
  };
};