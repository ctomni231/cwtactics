(function(){

	// local variables
	var keys = [];
	var actions = {};
	
	var input = /** @lends meow.input# */
	{
		/**
		 * Binds a key to the given action.
		 *
		 * @param keyCode integer code of the key ( not ascii )
		 * @param action action name
		 */
		bindKey : function( keyCode , action )
		{
			if( typeof actions[action] === 'undefined' )
			{
				actions[action] = new Array();
			}

			actions[action].push( keyCode );
		},

		/**
		 * Unbinds a key from the given action.
		 *
		 * @param keyCode integer code of the key ( not ascii )
		 * @param action action name
		 */
		unbindKey : function( keyCode , action )
		{
			actions[action].remove( keyCode );

			// free memory, if the action is no longer used
			if( actions[action].length == 0 )
			{
				delete actions[action];
			}
		},

		/**
		 * Checks the status of an action. Returns true if the action
		 * is activated by at least one of the connected keys, else false.
		 *
		 * @param action action name
		 */
		isPressed : function( action )
		{
			var array = actions[action];
			for( var i = 0 ; i < array.length ; i++ )
			{
				if( keys.contains( array[i] ) )
				{
					return true;
				}
			}

			// no key from the action map is pressed
			return false;
		},

		/**
		 * Registers a key down event in the key map.
		 *
		 * @param keyCode integer code of the key ( not ascii )
		 */
		keyDown : function( keyCode )
		{
			keys.push( keyCode )
		},

		/**
		 * Registers a key up event in the key map.
		 *
		 * @param keyCode integer code of the key ( not ascii )
		 */
		keyUp : function( keyCode )
		{
			keys.remove( keyCode )
		}
	}

	/**
	 * MeowEngine input controller object. It can be used to define actions and
	 * binding keys to them.
	 *
	 * @author Tapsi
	 * @since 13.05.2011
	 *
	 * @namespace
	 */
	meow.input = input;
})();