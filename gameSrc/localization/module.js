//
// Localization module to grab localized strings from a given key. The language can be registered by registerLang.
//
// @namespace
//
cwt.Localization = {

  // Holds all available languages.
  //
  lang_: {

  },

  // The current active language.
  //
  selected_: null,

  //
  // Registers a language object. The properties of the object will be the keys and its values the localized
  // string for the key.
  //
  // @param obj
  //
  registerLanguage: function(obj) {
    this.lang_[obj.key] = obj;
  },

  //
  //
  selectLanguage: function(key) {
    this.selected_ = this.lang_[key];
  },

  //
  // Returns the localized string of a given identifier.
  //
  // @param {String} key identifier
  // @return {String}
  //
  forKey: function(key) {
    if (cwt.DEBUG) cwt.assert(this.selected_);

    var str = this.selected_[key];
    return (str) ? str : key;
  }
};
