util.scoped(function(){
  var persistence = [];
  
  // ### Controller.persistenceHandler
  // Registers a persistence handler that defines `load` and `save` function. This functions will be invoked during map/save loading or saving process. The order is defined by the time the functions get registered in relation to other persistence handlers.
  //
  controller.persistenceHandler = function(load,save){
    persistence.push(load,save);
  };
  
  // ### Controller.saveCompactModel
  // Converts the current game model into a JSON compatible string by invoking all registered `save` functions of the persistence handlers.
  //
  controller.saveCompactModel = function(){
    var dom = {};
    
    var obj;
    for( var i=1,e=persistence.length; i<e; i+=2 ){
      // TODO do checks
      persistence[i].call(model, dom );
    }
    
    return JSON.stringify(dom);
  };
  
  // ### Controller.loadCompactModel
  // Loads a given JSON compatible string and calls all `load`functions of the persistence handlers with this object as argument.
  //
  controller.loadCompactModel = function( data ){    
    try{
      for( var i=0,e=persistence.length; i<e; i+=2 ){
        // TODO do checks
        persistence[i].call(model, data );
      }
    }
    catch( e ){
      return e;
    }
  };
});
