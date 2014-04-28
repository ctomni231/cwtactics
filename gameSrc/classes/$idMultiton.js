/**
 * Class that contains a static algorithm to register and return instances by a key. This class implements the multiton
 * pattern by a string based identifier. Usable by inheritance.
 *
 * @template T
 */
cwt.IdMultiton = my.Class({

  STATIC: {

    /**
     * @private
     */
    classInstances_: {},

    /**
     * Returns an instance of the IndexMultiton.
     *
     * @param {String} key
     * @param {Boolean=} nullReturn if true then null will be returned when no object for the given key exists
     * @return {T}
     */
    getInstance: function (key, nullReturn) {
      var obj = this.classInstances_[key];

      // create instance
      if (!obj) {
        if (nullReturn) {
          return null;
        }

        if (cwt.DEBUG) {
          cwt.log("creating instance with key " + key);
        }

        obj = new this();
        this.classInstances_[key] = obj;
      }

      return obj;
    }
  }
});