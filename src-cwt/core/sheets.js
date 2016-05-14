var sheetDB = {

  getRandomSheet() {
    return this.sheets[this.names[parseInt(Math.random() * this.names.length, 10)]];
  },

  getSheet(id) {
    return this.requireNonNull(this.sheets[id]);
  }
};

cwt.produceSheetDB = function(sheets, validator) {
  var sheetsMap = {};
  sheets.forEach(value => sheetsMap[value.id] = value);

  return Object.assign(Object.create(sheetDB), {
    sheets: sheetsMap,
    names: Object.keys(sheetsMap),
    requireNonNull: cwt.produceTypeAsserter().isSomething
  });
};