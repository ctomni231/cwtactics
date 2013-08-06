// # Event Module
//
// This module defines the event system API. This API basically defines the define function
// which is only used by the engine itself and the `onEvent` function. Only one handler is
// allowed to be defined for an event type. If an observer pattern is needed for an event
// type then the handler function should be defined as observer object which controls the 
// data flow between the invoking model function and the listeners which are connected to
// the observer event handler.

controller.events = {};

util.scoped(function(){
	
	var emptyFn = function(){};
	
	// Defines a listenable event name.
	//
	// @param {String} ev event name
	controller.defineEvent = function( ev ){
		controller.events[ev] = emptyFn;
	};
	
});

// Registers an event handler callback.
//
// @param {String} ev event name
// @param {Function} cb callback function
controller.onEvent = function( ev, cb ){
	var oldValue = controller.events[ev];
	
	// Only one handler is allowed to be connected to a model function.
	// If more event handlers are needed then the event handler should be
	// defined as observer.
	if( typeof oldValue === "function" ){
		model.criticalError(
			constants.error.CLIENT_BREAKS_CONTRACT,
			constants.error.EVENT_LISTENER_ALREADY_EXIST
		);
	}
	
	// Only `null` means a define able model function
	if( oldValue !== null ){
		model.criticalError(
			constants.error.CLIENT_BREAKS_CONTRACT,
			constants.error.EVENT_LISTENER_DOES_NOT_EXIST
		);
	}
	
	controller.events[ev] = cb;
};