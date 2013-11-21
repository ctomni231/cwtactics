// This module defines the event system API. This API basically defines the define function
// which is only used by the engine itself and the `onEvent` function. Only one handler is
// allowed to be defined for an event type. If an observer pattern is needed for an event
// type then the handler function should be defined as observer object which controls the data
// flow between the invoking model function and the listeners which are connected to the
// observer event handler.
//

// Holds all known game events.
//
controller.events = {};

util.scoped(function(){
  
  var emptyFn = function(){};

  // Defines a listenable event name.
  //
  controller.event_define = function( ev ){
    controller.events[ev] = emptyFn;
  };

  // Registers an event handler callback that will be invoked when the event name (`ev`)
  // is triggered by the engine. Only one listener can be connected to an event. If more
  // listeners are needed to react on a given event type, then the root event listener
  // should act as observer.
  //
  controller.event_on = function( ev, cb ){
    assert(controller.events.hasOwnProperty(ev));
    assert(controller.events[ev] === emptyFn);
    
    controller.events[ev] = cb;
  };
});