cwt.IdHolder = my.Class({

  STATIC: function () {
  
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
