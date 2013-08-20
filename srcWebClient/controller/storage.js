controller.loadStorageController = util.singleLazyCall(function( err, baton ){
  if( err ){
    if( constants.DEBUG ) util.log("break at init storage system due error from previous inits"); 
    return err;
  }
  
  baton.take();
  
  if( constants.DEBUG ) util.log("initializing storage system"); 
  
  var browser = Browser;
  
  if( constants.DEBUG ) util.log("using lawnchair storage system with",((browser.mobile)? 'webkit-sqlite':'indexed-db'),"adapter"); 
  
  var store = new Lawnchair({
    adaptor: (browser.mobile)? 'webkit-sqlite':'indexed-db',
    maxSize: 45*1024+1024,
    name:'cwt'
  },function(){
    
    var get,has,clear,remove,set,keys;
    
    get = function( key, cb ){
      store.get(key,cb);
    };
    
    has = function( key, cb ){
      store.exists( key, cb );
    };
    
    clear = function( cb ){
      store.nuke(cb);
    };
    
    keys = function( cb ){
      store.keys(cb);
    };
    
    remove = function( key, cb, isMod ){
      store.get(key,obj,cb);
    };
    
    set = function( key, value, cb, isMod ){
      store.save({key:key, value:value},cb);
    };    
    
    /**
   * Storage controller.
   * 
   * @namespace
   */
    controller.storage = {
      get: get,
      has: has,
      set: set,
      keys: keys,
      clear: clear,
      remove: remove
    };
    
    baton.pass( false ); 
  });
});