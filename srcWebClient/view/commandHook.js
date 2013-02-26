view._animCommands = {};

view.registerCommandHook = function( impl ){
  view._animCommands[ impl.key ] = impl;
  impl.isEnabled = true;
};

view.getCommandHook = function( key ){
  var obj = view._animCommands[key];
  return obj !== undefined ? obj: null;
};

view._commandListeners = {};

view.registerCommandListener = function( key, listener ){
  if( !view._commandListeners.hasOwnProperty(key) ){
    view._commandListeners[key] = [];
  }
  
  view._commandListeners[key].push( listener );
};

view.invokeCommandListener = function( key, args ){
  var list = view._commandListeners[key];
  if( list ){
    for( var i=0,e=list.length; i<e; i++ ){
      list[i].apply( null, args );
    }
  }
};