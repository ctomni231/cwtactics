// TODO: rename from model.xxx to events.xxx

// This module defines the event system API. This API basically defines the define function
// which is only used by the engine itself and the `onEvent` function.
//

// Holds all name of event indexes.
//
model.event_eventName = [];

// Holds the index of event names.
//
model.event_eventIndex = {};

model.event_eventFirst    = {};
model.event_eventCallback = {};

// Holds all known game events.
//
model.events = {};

// Defines an event node.
//
model.event_define = function(ev){
  assertStr(ev);
  assertUndef( model.event_eventIndex[ev] );

  var index = model.event_eventName.length;
  var list  = [];
  model.event_eventName[index] = ev;
  model.event_eventIndex[ev]   = index;
  event_eventCallback[ev]      = list

  // define event handler
  model.events[ev] = function(){
    if( model.event_eventFirst[ev] ) model.event_eventFirst[ev].apply(null,arguments);
    for (var i = 0, e = list.length; i < e; i++) {
      if( list[i].apply(null,arguments) === false ) return;
    };
  };
};

// Registers a callback as first listener in an event node.
//
model.event_firstOn = function( ev, cb ){
  assertStr(ev);
  assertFn(cb);

  if( !model.event_eventCallback[ev] ) model.event_define(ev);

  model.event_eventFirst[ev] = cb;
};

// Registers a callback in an event node.
//
model.event_on = function( ev, cb ){
  if( Array.isArray(ev) ){
    for( var i = 0,e = ev.length; i<e; i++ ) model.event_on(ev[i],cb,mod);
    return;
  }

  assertStr(ev);
  assertFn(cb);

  if( !model.event_eventCallback[ev] ) model.event_define(ev);
  model.event_callbacks[ev].push(cb);
};
