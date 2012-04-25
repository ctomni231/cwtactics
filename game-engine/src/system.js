// ======================================================================================================
// main message context is used to do all internal game mechanic logic.

// main message context
var messageContext = jsMessage();

// filters
var logicNode = jsMessage.filter.switchFilter( 'cmd', true );
var logicValidator = jsMessage.filter.amandaKeyBasedValidator( 'cmd', false );
messageContext.addFilter( jsMessage.filter.simpleLogger({ header:'CWT Log' }), jsMessage.Priority.HEAD );
messageContext.addFilter( logicValidator, jsMessage.Priority.TAIL);
messageContext.addFilter( logicNode, jsMessage.Priority.TAIL );

// a command node is the main interpreter for an incoming command message
// it defines the acting logic and the validator for the message
var commandNode = function( command, logic, validator ){
  logicNode.bind( command, logic );
  logicValidator.bind( command, validator );
};

// a reacting node is a simple listener that listen on an incoming message and does some stuff
var reactOn = function( event, fn ){
  // script
}

// ======================================================================================================
// network message context saves all incoming messages from the network connection and makes it available
// for the main message context.

// network message context
networkContext = jsMessage();

// filters
networkContext.storage = jsMessage.filter.ringStorage({ size:200 });
networkContext.addFilter( jsMessage.filter.simpleLogger({ header:'networkMessage Logger' }), jsMessage.Priority.HEAD  );
networkContext.addFilter( networkContext.storage, jsMessage.Priority.TAIL );

// activates next command from storage
networkContext.tryNextCommand = function(){
  if( !networkContext.storage.isEmpty() ){
    // send command to command context
    var msg = networkContext.storage.pop();
  }
};

// ======================================================================================================

var __validator__ = amanda('json');
var validate = function( obj, schema ){
  __validator__.validate( obj, schema, function( e ){
    if(e) {
      console.log( e );
      throw Error(e);
    } else {
      // Do something else...
    }
  });
};

// ======================================================================================================
// storage
//
//var storage = {
//
//  /**
//   * Saves one element in storage.
//   *
//   * @example
//   *  function is asynchron
//   *
//   * @param object
//   * @param key
//   * @param callback
//   */
//  save: function( object, key, callback ){
//    Lawnchair(function(){
//      this.save({
//        key: key,
//        data: object
//      });
//
//      if( callback ) callback();
//    });
//  },
//
//  /**
//   * Loads one element from storage.
//   *
//   * @example
//   *  function is asynchron
//   *
//   * @param key
//   * @param callback
//   */
//  load: function( key, callback ){
//    Lawnchair(function() {
//
//      if( callback ) callback();
//    });
//  },
//
//  /**
//   * Deletes one key and value from the storage.
//   *
//   * @example
//   *  function is asynchron
//   *
//   * @param key
//   * @param callback
//   */
//  delete: function( key, callback ){
//    Lawnchair(function() {
//
//      if( callback ) callback();
//    });
//  },
//
//  /**
//   * Clears the complete storage.
//   *
//   * @example
//   *  function is asynchron
//   *
//   * @param key
//   * @param callback
//   */
//  nuke: function( key, callback ){
//    Lawnchair(function() {
//      this.nuke();
//
//      if( callback ) callback();
//    });
//  }
//};