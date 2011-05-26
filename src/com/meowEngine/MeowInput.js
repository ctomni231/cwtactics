/**
 * MeowEngine input controller object. It can be used to define actions and
 * binding keys to them.
 *
 * @author Tapsi
 * @since 13.05.2011
 * 
 * @namespace
 */
meow.input = /** @lends meow.input# */ 
{
	/** @private */
	keys : new Array(),

	/** @private */
	actions : {},

	/**
	 * Binds a key to the given action.
	 *
	 * @param keyCode integer code of the key ( not ascii )
	 * @param action action name
	 */
	bindKey : function( keyCode , action )
	{
		$: out.info( keyCode+" will be connected to "+action )
		
		if( typeof this.actions[action] === 'undefined' )
			this.actions[action] = new Array();

		this.actions[action].push( keyCode )

		$: out.info( action+" action has now "+this.actions[action].length+" keys connected" )
	},
	
	/**
	 * Unbinds a key from the given action.
	 *
	 * @param keyCode integer code of the key ( not ascii )
	 * @param action action name
	 */
	unbindKey : function( keyCode , action )
	{
		$: out.info( keyCode+" will be disconnected from "+action )

		this.actions[action].remove( keyCode )

		// free memory, if the action is no longer used
		if( this.actions[action].length == 0 )
		{
			$: out.info( action+" is empty, will deleted as action" )
			delete this.actions[action]
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
		$: out.info( "Checking status for action \""+action+"\"" )

		var array = this.actions[action];
		for( var i = 0 ; i < array.length ; i++ )
			if( this.keys.contains( array[i] ) )
				return true

		// no key from the action map is pressed
		return false
	},

	/**
	 * Not used at the moment in MeowEngine
	 */
	keyPressed : function( keyCode ){},
	
	/**
	 * Registers a key down event in the key map.
	 *
	 * @param keyCode integer code of the key ( not ascii )
	 */
	keyDown : function( keyCode )
	{
		this.keys.push( keyCode )
	},

	/**
	 * Registers a key up event in the key map.
	 *
	 * @param keyCode integer code of the key ( not ascii )
	 */
	keyUp : function( keyCode )
	{
		this.keys.remove( keyCode )
	}
}

// connect meow input listeners to the global key events
sys.getGlobal().onKeyUp = function( key ){ meow.input.keyUp( key ) }
sys.getGlobal().onKeyDown = function( key ){ meow.input.keyDown( key ) }