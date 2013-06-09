(function(){
  
  var listeners = {};
  
  /**
   * @param {String} action name
   * @param {Function} cb callback
   */
  controller.listenCommand = function( name, cb ){
    if( typeof model[name].__actionId__ === "undefined" ){
      util.raiseError(name+" isn't a valid command able action");
    }
    
    // IF NO LISTENER IS REGISTERD
    if( listeners[name] ){
      util.raiseError("listener for",name,"is already registered");
    }
    
    var propValue = model[name];
    
    // REGISTER NEW FUNCTION THAT INVOKES THE LISTENER AUTOMATICALLY
    model[name] = function(){
        
      // INVOKE ACTION
      var res = propValue.apply(model,arguments);
        
      // INVOKE LISTENER
      cb.apply(null,arguments);
      
      return res;
    };
    
    // SHORTCUTS
    model[name].callAsCommand = function(){
      propValue.callAsCommand.apply(propValue,arguments);
    };
    model[name].callToList = function(){
      propValue.callToList.apply(propValue,arguments);
    };
        
    listeners[name] = true;
  };
  
})();