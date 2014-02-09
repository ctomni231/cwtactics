/**
 * Defines functionality to store objects in the static part
 * of the class. Useful for data sheet holders.
 */
cwt.IdHolder = my.Class({

  STATIC: {
  
    registeredTypes_: {},
  
    registerType: function ( id, object ) {
      if( DEBUG ) assert( !this.registeredTypes_.hasOwnProperty(id) );
      this.registeredTypes_[id] = object;
    },
    
    hasType: function ( id ) {
      return this.registeredTypes_.hasOwnProperty(id);
    },
    
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
