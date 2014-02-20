/**
 * Defines functionality to store objects in the static part
 * of the class. Useful for data sheet holders.
 */
cwt.IdHolder = my.Class({

  STATIC: {

    /**
     *
     */
    registeredTypes_: {},

    /**
     *
     * @param id
     * @param object
     */
    registerType: function ( id, object ) {
      if( DEBUG ) assert( !this.registeredTypes_.hasOwnProperty(id) );
      this.registeredTypes_[id] = object;
    },

    /**
     *
     * @param id
     * @returns {boolean}
     */
    hasType: function ( id ) {
      return this.registeredTypes_.hasOwnProperty(id);
    },

    /**
     *
     * @param id
     * @returns {*}
     */
    getType: function ( id ) { 
      var obj = this.registeredTypes_[id];
      assert( obj );
      return obj;
    }
  
  },

  constructor: function () {
    throw Error("cannot construct trait");
  }

});
