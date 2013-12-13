// TODO: rename from model.xxx to events.xxx

// This module defines the event system API. This API basically defines the define function
// which is only used by the engine itself and the `onEvent` function.
//

// Holds all callbacks of the game events.
//
model.event_callbacks = {};

// Holds all known game events.
//
model.events = {};

// Defines an event node.
//
model.event_define = function(ev){
  assertStr(ev);
  assertUndef( model.event_callbacks[ev] );

  model.event_callbacks[ev] = [];
  model.events[ev]          = function(){

    var list = model.event_callbacks[ev];
    for (var i = 0, e = list.length; i < e; i++) {
      list[i].apply(null,arguments);

    };
  };
};

// Registers a callback in an event node.
//
model.event_on = function( ev, cb ){
  assertStr(ev);
  assertFn(cb);
  if( !model.event_callbacks[ev] ) model.event_define(ev);

  model.event_callbacks[ev].push(cb);
};
