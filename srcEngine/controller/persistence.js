util.scoped(function(){
  var persistence = [];
  
  controller.persistenceHandler = function(load,save){
    persistence.push(load,save);
  };
  
  // Saves the current game model to a JSON string.
  controller.saveCompactModel = function(){
    var dom = {};
    
    var obj;
    for( var i=1,e=persistence.length; i<e; i+=2 ){
      persistence[i].call( obj[0], dom );
    }
    
    return JSON.stringify(dom);
  };
  
  // Loads a given JSON string into the model. 
  controller.loadCompactModel = function( data ){
    var dom = JSON.parse(data);
    var obj;
    
    try{
      for( var i=0,e=persistence.length; i<e; i+=2 ){
        persistence[i].call( obj[0], dom );
      }
    }
    catch( e ){
      
      // unknown errors are possible here as well as 
      // known errors with error ID and error data ID
      if( typeof e.errorID === "undefined" ){
        e = util.createCwtErrorObject( 
          constants.error.UNKNOWN, 
          constants.error.UNKNOWN, 
          null
        );
      }
      
      return e;
    }
  };
});