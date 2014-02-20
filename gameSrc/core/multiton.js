/**
 * Usable as super class to enable other classes to be used as
 * Multiton which allows to grab instances with Class.getInstance(id).
 * If the instance with the given id does not exists, then it will be
 * created.
 *
 * @class
 */
cwt.Multiton = my.Class({
  STATIC:{

    /**
     * Should be overwritten by the client class.
     */
    MULTITON_INSTANCES: 0,

    /**
     * Holds all created instances.
     */
    multiton_instances_:[],

    /**
     * Returns an instance of the Multiton.
     *
     * @param {Number} id
     * @param {Boolean=} nullReturn (optional)
     * @return {cwt.Multiton}
     */
    getInstance: function (id,nullReturn) {
      if( typeof id !== "number" || id < 0 || id >= this.MULTITON_INSTANCES ){
        throw Error("illegal id");
      }

      var l = this.multiton_instances_;
      if( !l[id] ){

        // allow null as result for some calls (like turn start actions
        // checks all units -> we won't want to create all units then)
        if( nullReturn ) return null;

        if( DEBUG ) console.log("creating instance with id "+id);
        l[id] = new this();
      }

      return l[id];
    }
  }
});