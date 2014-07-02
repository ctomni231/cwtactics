/**
 * Class that contains a static algorithm to register and return instances by a key. This class implements the multiton
 * pattern by a string based identifier. Usable by inheritance.
 *
 * @template T
 */
cwt.IdMultiton = {

  /**
   * @return {Array} Names that are registered in the multiton.
   */
  getInstanceKeyList: function () {
    return this.classNames_;
  },

  /**
   *
   * @param obj
   * @return {string}
   */
  getInstanceKey: function (obj) {
    if (cwt.DEBUG) cwt.assert(!!this.classInstances_);
    if (cwt.DEBUG) cwt.assert(obj instanceof this);

    for (var i = 0, e = this.classNames_.length; i < e; i++) {
      if (this.classInstances_[this.classNames_[i]] === obj) {
        return this.classNames_[i];
      }
    }

    return null;
  },

  /**
   *
   * @param {string} key
   * @param obj
   */
  registerInstance: function (key, obj) {
    if (cwt.DEBUG) cwt.assert(obj instanceof this);

    if (!this.classInstances_) {
      this.classInstances_ = {};
      this.classNames_ = [];
    }

    if (cwt.DEBUG) cwt.assert(this.MULTITON_NAMES.indexOf(key) != -1);
    if (cwt.DEBUG) cwt.assert(!this.classInstances_.hasOwnProperty(key));

    this.classInstances_[key] = obj;
  },

  /**
   * Returns an instance of the IndexMultiton.
   *
   * @param {String} key
   * @param {Boolean=} nullReturn if true then null will be returned when no object for the given key exists
   * @return {T}
   */
  getInstance: function (key) {

    var obj = this.classInstances_[key];
    this.classNames_.push(key);

    // create instance
    if (!obj) {
      throw Error("key "+key+" is not registered in the id multiton");
    }

    return obj;
  }
};