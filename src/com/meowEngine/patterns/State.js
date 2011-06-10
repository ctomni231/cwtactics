(function(){

	var state = meow.Class( /** @lends meow.StateMachine# */ {

		constructor : function(){
			this._active = null;
		},

		/**
		 * Sets the active state of the state machine.
		 *
		 * @param {Object} state state, that will be set in the state machine
		 */
		setState : function( state ){
			var f;

			if( this._active != null ){

				// clean state functions, setState and inSate are in the
				// prototype of the state class.
				for( f in this )
					delete this[f];
			}

			this._active = state;

			// set functions
			for( f in this )
			{
				if( typeof f === 'function' )
				{
					this[f] = function(){
						state[f]();
					}
				}
			}
		},

		/**
		 * @param {Object} state statem that will be checked
		 * @return true, if the state parameter is the current active state of
		 *		   the state machine. Else, false is returned.
		 */
		isInState : function( state )
		{
			return this._active === state;
		}
	});

	/**
	 * State machine repressents a class, that is able to hold a given state.
	 *
	 * @example
	 * To define a shape that all states must implement:
	 *
	 * var myStateCtr = meow.Singleton(meow.StateMachine,{
	 *		action : meow.NEED_TO_BE_IMPLEMENTED,
	 *		cancel : meow.NEED_TO_BE_IMPLEMENTED
	 * });
	 *
	 * var wrongImp = {};
	 * var correctImp = {
	 *		action : function(){
	 *			// logic stuff
	 *		},
	 *
	 *		cancel : function(){
	 *			// logic stuff
	 *		}
	 * }
	 *
	 * myStateCtr.setState( correctImp );
	 * myStateCtr.action(); // works
	 *
	 * myStateCtr.setState( wrongImp );
	 * myStateCtr.action(); // fails, Error: This function is a place holder
	 *										 and must not be called!
	 *
	 * @class
	 * @author Radom, Alexander [blackcat.myako@googlemail.com]
	 * @since 07.06.2011
	 */
	meow.StateMachine = state;

	var stateCtr = meow.Class( /** @lends meow.StateController# */ {
		
		constructor : function( stateMachine ){
			this._stateM = stateMachine;
			this._states = {};
		},

		/**
		 * Adds a state to the controller.
		 *
		 * @param {String} key identical string of the controller
		 * @param {Object} state state object
		 */
		addState : function( key , state ){
			this._states[key] = state;
		},

		/**
		 * Removes a state from the controller.
		 *
		 * @param {String} key identical string of the controller
		 */
		removeState : function( key ){
			delete this._states[key];
		},

		/**
		 * Sets a state to the active state in the state machine of the state
		 * controller.
		 *
		 * @param {String} key identical string of the controller
		 */
		setState : function( key ){
			this._stateM.setState( this._states[key] );
		},

		/**
		 * Checks that a state is active or not.
		 *
		 * @param {String} key identical string for the controller
		 * @return {Boolean} true if active, else false
		 */
		isInState : function( key ){
			return this._stateM.isInState( this._states[key] );
		}
	});

	/**
	 * Simple controller class for the state machine of meow. It allows a more
	 * control able add and removement of states at the fly.
	 *
	 * @class
	 * @author Radom, Alexander [blackcat.myako@googlemail.com]
	 * @since 08.06.2011
	 */
	meow.StateController = stateCtr;
})();