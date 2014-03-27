cwt.IdMultiton = my.Class({
  STATIC: {

    classInstances_: {},

    addByKey: function (key,obj) {
      if (cwt.DEBUG) cwt.assert(!this.classInstances_.hasOwnProperty(key));
      if (cwt.DEBUG) cwt.assert(obj instanceof this);

      this.classInstances_[key] = obj;
    },

    getByKey: function (key) {
      return this.classInstances_[key];
    }
  }
});