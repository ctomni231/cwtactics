util.scoped(function(){
  var loaders = [];
  var savers  = [];

  // Registers a persistence handler that defines `load` and `save` function. This functions will
  // be invoked during map/save loading or saving process. The order is defined by the time the
  // functions get registered in relation to other persistence handlers.
  //
  controller.persistence_defineHandler = function(load,save){
    loaders.push(load);
    savers.push(save);
  };

  // Converts the current game model into a JSON compatible string by invoking all registered
  // `save` functions of the persistence handlers.
  //
  controller.persistence_saveModel = function(){
    var i = 0;
    try{
      var dom = {};

      while( i < savers.length ){
        savers[i].call(model, dom );
        i++;
      }

      return JSON.stringify(dom);

    } catch( e ){
      if( DEBUG ) util.log("error during the map saving process (saver id",i,")");

      assert(false, "MAP_SAVING" );
      return e;
    }
  };
  
  // Loads a given JSON compatible string and calls all `load`functions of the persistence
  // handlers with this object as argument.
  //
  controller.persistence_loadModel = function( data ){
    var i = 0;
    try{

      while( i < loaders.length ){
        loaders[i].call(model, data );
        i++;
      }

    } catch( e ){
      if( DEBUG ) util.log("error during the map loading process (loader id",i,")");

      assert(false, "MAP_LOADING" );
      return e;
    }
  };
});
