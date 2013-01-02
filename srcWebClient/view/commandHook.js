view._animCommands = {};

view.registerCommandHook = function( impl ){
  view._animCommands[ impl.key ] = impl;
  impl.isEnabled = true;
};

view.getCommandHook = function( key ){
  var obj = view._animCommands[key];
  return obj !== undefined ? obj: null;
};