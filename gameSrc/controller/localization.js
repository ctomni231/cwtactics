/**
 * Localization module to grab localized strings from a given key. The language can be registered by registerLang.
 *
 * @namespace
 */
cwt.Localization = {

  /**
   * @private
   */
  lang_ : null,

  /**
   * Registers a language object. The properties of the object will be the keys and its values the localized
   * string for the key.
   *
   * @param obj
   */
  registerLang: function (obj) {
    if (cwt.DEBUG) cwt.assert(!this.lang_);

    this.lang_ = obj;
  },

  /**
   * Returns the localized string of a given identifier.
   *
   * @param {String} key identifier
   * @return {String|String[]}
   */
  forKey: function (key) {
    if (cwt.DEBUG) cwt.assert(this.lang_);

    var str = this.lang_[key];
    return (str) ? str : key;
  }
};