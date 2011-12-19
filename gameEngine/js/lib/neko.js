/**
 * NekoJS
 * 
 * Neko is a small javascript library for CustomWars tactics, which brings 
 * several functionalities without being bloated like high level frameworks
 * (jQuery,Prototype).
 * 
 * @requires log4javascript
 * @author BlackCat
 * @since 17.12.2011
 * @version 1.0
 */
define(["lib/log4javascript","json!cwt/config"],function( log4j, cfg ){
    
  // events
  var events = {};
  
  // logger
  var logger = log4javascript.getLogger();
      logger.addAppender( new log4javascript.PopUpAppender() );
	var levels = log4javascript.Level;
  var level;
  
  /**
   * throws an error and logs it before it will thrown (if the corresponding
   * flag has been activated in the configurations ).
   * 
   * @param type type of the error
   * @param msg reason of the error
   */
  function throwError( type, msg )
  { 
    var res = type+": "+msg;
    
    // log if LOG_ERRORS is on
    if( cfg.NEKO_LOG_ERRORS ) 
      API.log.error()
    
    throw new Error(res);
  }
  
  var API = {
    
    /**
     * Logging namespace.
     */
    log:{
      
      /**
       * Sets the level of the neko logger
       *
       * @param newLevel 
       */
      setLevel: function( newLevel )
      {
        if( levels.indexOf( newLevel ) == -1 )
          API.error.illegalArguments(newLevel+" level is not a correct level");
        
        logger.setLevel( newLevel );
        level = newLevel;
      },
      
      isInfoEnabled: function()
      {
        return level.level <= levels.INFO.level;
      },
      
      isWarnEnabled: function()
      {
        return level.level <= levels.WARN.level;
      },
      
      isErrorEnabled: function()
      {
        return level.level <= levels.ERROR.level;
      },
      
      isFatalEnabled: function()
      {
        return level.level <= levels.FATAL.level;  
      },
      
      info:function()
      {
        logger.log( levels.INFO, arguments );
      },
      
      warn:function()
      {
        logger.log( levels.WARN, arguments );
      },
      
      error:function()
      { 
        logger.log( levels.ERROR, arguments );
      },
      
      fatal:function()
      {
        logger.log( levels.FATAL, arguments );
      }
    },
    
    /**
     * Event namespace.
     */
    event:{
      
      /**
       * Connects a handler function to an event.
       *
       * @param eventName
       * @param handler
       */
      onEvent: function( eventName, handler )
      {
        if( typeof handler !== 'function' )
          this.error("onEvent handler has to be a function");
          
        if( !events[eventName] ) events[eventName] = [];
        
        events[eventName].push( handler );
      },
            
      /**
       * Invokes an event.
       * 
       * @param eventName
       */
      invoke: function( eventName )
      {
        arguments.splice(0,1);
       
        if( cfg.NEKO_LOG_EVENTS ) 
          API.log.info("invoking event "+eventName+
                       " with arguments ["+arguments+"]");
        
        var events = events[eventName];
        if( !events ) return; // no handlers registered
        
        // call all handlers
        for( var handler in events ) 
          handler.apply(null, arguments );
      }
    },
    
    stateMachine:{
      
      create: function(){
        
        var states = {};
        var activeState = null;
        
        return{
          
          /**
           * Adds a state, plus its implementation to the state machine.
           */
          addState: function( stateName, stateImpl )
          {
            if( states[stateName] )
              API.error.illegalArguments(stateName+" state already registered");

            API.event.invoke("stateRegistered",stateName);
            states[stateName] = stateImpl;
          },

          /**
           * Changes the active state.
           */
          changeState: function( stateName )
          {
            if( !states[stateName] )
              neko.error.illegalArguments(stateName+" state does not exists");

            neko.event.invoke("stateChanges",activeState,stateName);
            activeState = stateName;
          },
          
          /**
           * Updates the state machine by invoking the single state 
           * implementation.
           */
          update: function()
          {
            
          }
        }
      }
    },
    
    /**
     * Error namespace.
     */
    error:{
            
      illegalArguments: function(msg)
      {
        throwError("IllegalArguments", msg);
      },
      
      runtimeError: function(msg)
      {
        throwError("RuntimeError", msg);
      },
      
      systemFault: function(msg)
      {
        throwError("SystemFault", msg);
      }
    }
  }
  
  //TODO use config file for level
  API.log.setLevel( levels.ALL );
  
  return API;
});