/**
 * Trigger controller holds all events and all connected childs of an
 * event.
 *
 * @author Tapsi
 * @version 05.05.2011
 */
meow.triggerCtr = {

	/** @private */
	events : {},

	/**
	 * Pushes an event to the trigger stack
	 */
	pushEvent : function( eventName )
	{
		this.events[eventName] = new Array();
	},

	/**
	 * Pushes a function to an event
	 */
	pushHandler : function( eventName , func )
	{
		this.events[eventName][ this.events[eventName].length ] = func;
	},

	/**
	 * Pops a function from an event
	 */
	popHandler : function( eventName , func )
	{
		var list = this.events[eventName];
		for( var i = 0 ; i < list.length ; i++ )
		{
			if( list[i] == func )
			{
				list.splice(i,1);
				return;
			}
		}
	},

	/**
	 * Pops an event from the trigger stack
	 */
	popEvent : function( eventName )
	{
		delete this.events[ eventName ];
	},

	/**
	 * Invokes all connected handlers from an event
	 */
	invokeEvent : function( eventName , argObject )
	{
		var list = this.events[eventName];
		
		for( var i = 0 ; i < list.length ; i++ )
		{
			list[i]( argObject );
		}
	}
};