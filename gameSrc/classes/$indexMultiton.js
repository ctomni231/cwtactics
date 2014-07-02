/**
 * Usable as super class to enable other classes to be used as
 * Multiton which allows to grab instances with Class.getInstance(id).
 * If the instance with the given id does not exists, then it will be
 * created.
 *
 * @template T
 */
cwt.IndexMultiton = {

  /**
   * Gets the id of a multiton object. This object must be an instance of this class.
   *
   * @param obj
   * @return {*}
   */
  getInstanceId: function (obj) {
    if (cwt.DEBUG) cwt.assert(!!this.classInstances_);
    if (cwt.DEBUG) cwt.assert(obj instanceof this);

    for (var i = 0, e = this.classInstances_.length; i < e; i++) {
      if (this.classInstances_[i] === obj) return i;
    }

    return cwt.INACTIVE;
  },

  /**
   * Returns an instance of the IndexMultiton.
   *
   * @param {Number} id
   * @param {Boolean=} nullReturn (optional)
   * @return {T}
   */
  getInstance: function (id, nullReturn) {
    if (typeof id !== "number" || id < 0 || id >= this.MULTITON_INSTANCES) {
      throw Error("illegal id");
    }

    if (this.classInstances_ == void 0) {
      this.classInstances_ = [];

      // prevent array holes
      for (var i = 0, e = this.MULTITON_INSTANCES; i < e; i++) {
        this.classInstances_[i] = null;
      }

    }

    var l = this.classInstances_;
    if (!l[id]) {

      // allow null as result for some calls (like turn start actions
      // checks all units -> we won't want to create all units then)
      if (nullReturn) return null;

      if (cwt.DEBUG) {
        console.log("creating instance with id " + id);
      }

      l[id] = new this();
    }

    return l[id];
  }
};