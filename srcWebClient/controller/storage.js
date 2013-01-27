const STORAGE_SIZE = 25;

controller.storage = {

  get: function( key ){
    var o = localStorage.getItem( key );
    return o !== null ? JSON.parse(o) : null;
  },

  has: function( key ){
    return localStorage.getItem(key) !== null;
  },

  clear: function(){
    localStorage.clear();
  },

  remove: function( key ){
    localStorage.removeItem( key );
  },

  set: function( key, value ){
    localStorage.setItem( key, JSON.stringify(value) );
  }
};