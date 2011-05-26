meow.sys.reqModule( "MeowClass" )

/**
 * Trigger controller holds all events and all connected childs of an
 * event.
 *
 * @author Tapsi
 * @version 05.05.2011
 * @namespace 
 */
meow.event = 
/** @lends meow.event# */ 
{
	/**
	 * Holds all observers.
	 *
	 * @private
	 */
	observers : {},

	/**
	 * Creates an event and adds it to the trigger stack
	 *
	 * @param {String} eventName Name of the event, that will be defined
	 */
	create : function( eventName )
	{
		var obs = new this.Observer()
		this.observers[eventName] = obs
	},

	/**
	 * Erases an event from the trigger stack
	 *
 	 * @param {String} eventName Name of the event, that will be removed from
	 *				   event stack
	 */
	erase : function( eventName )
	{
		// disconnect listeners before delete
		this.observers[ eventName ].removeListeners()

		delete this.observers[ eventName ]
	},

	/**
	 * Pushes a function to an event
	 *
	 * @param {String} eventName Name of the event, that gets the function
	 *				   object conntected
	 * @param {Function} func Function object, that represents the listener
	 *					 function
	 */
	connect : function( eventName , func )
	{
		this.observers[eventName].addListener( func )
	},

	/**
	 * Pops a function from an event
	 *
	 * @param {String} eventName Name of the event, that gets the function
	 *				   object disconntected
	 * @param {Function} func Function object, that represents the listener
	 *					 function
	 */
	disconnect : function( eventName , func )
	{
		this.observers[eventName].removeListener( func )
	},

	/**
	 * Invokes all connected handlers from an event
	 *
	 * @param {String} eventName Name of the event, that gets the function
	 *				   object conntected
	 * @param {Array} argArray Object, that represents the arguments
	 */
	invoke : function( eventName, argArray )
	{
		meow.assert.isArray(argArray)

		this.observers[eventName].notifyListeners( argArray )
	},

	/**
	 * Observer class can be used as stack to connect more
	 * than one listener to an event. Used by meow's event stack, but
	 * can be used by other context as well.
	 *
	 * @example
	 * var obs = new meow.event.Observer()
	 * onKeyUp = obs.notifyListeners
	 *
	 * @lastModified 13.05.2011
	 * @author Tapsi
	 * @class
	 * @name Observer
	 * @memberOf meow.event
	 */
	Observer : Class.$extend( /** @lends meow.event.Observer# */ {

		/** @private */
		stack : new Array(),

		/**
		 * Adds a listener function to the observer class.
		 *
		 * @param func function object
		 */
		addListener : function( func )
		{
			this.stack.push( func )
		},

		/**
		 * Removes a function object from the observer class.
		 *
		 * @param func function object
		 */
		removeListener : function( func )
		{
			this.stack.remove( func )
		},

		/**
		 * Removes all connected listeners from the observer class.
		 */
		removeListeners : function()
		{
			this.stack.splice( 0, this.stack.length )
		},

		/**
		 * Invokes all listener functions. This function calls the listeners
		 * with the same arguments as this function will be invoked.
		 */
		notifyListeners : function()
		{
			var e = this.stack.length
			for( var i = 0 ; i < e; i++ )
				this.stack[ i ].apply( null , arguments )
		}
	})

}