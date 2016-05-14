var localization = Object.freeze({
  resolve(key) {
    var data = this.languages[this.activeLanguage][key];
    return this.types.isSomething(data) ? data : "???" + key + "???";
  },
  
  selectLanguage(key) {
    this.requires.isSomething(this.languages[key]);
    this.activeLanguage = key;
  }
}); 

cwt.produceLocalizationProvider = function(languages) {
  if (!tc.isMapOf(languages, partialRight(tc.isMapOf, tc.isString) )) {
    cwt.raiseError("IAE");
  }
  
  // languages: this.require(languages).toBe(mapOf(mapOf(string()))
  
  return Object.assign(Object.create(localization), {
    languages: languages,
    activeLanguage: Object.keys(languages)[0],
    types: cwt.produceTypeChecker(),
    requires: cwt.produceTypeAsserter()
  });
};