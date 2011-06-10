(function(){

	var stateM = meow.Singleton( meow.StateMachine , {
		action : meow.EMPTY_FUNCTION,
		cancel : meow.EMPTY_FUNCTION,
		up : meow.EMPTY_FUNCTION,
		down : meow.EMPTY_FUNCTION,
		left : meow.EMPTY_FUNCTION,
		right : meow.EMPTY_FUNCTION
	});

	var stateC = new meow.StateController( stateM );

	/**
	 * State controller that holds the state machine.
	 *
	 * @example
	 * Basic support of actions along all states, if a state hasn't all of these
	 * actions, an empty fallback function will be called.
	 * 
	 * action,cancel,up,down,left,right
	 *
	 * @see meow.StateController
	 * @namespace
	 */
	cwt.stateCtr = stateC;

})();