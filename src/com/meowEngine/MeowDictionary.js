meow.sys.reqModule("MeowClass")

/**
 * Dictionary class, that implements the java HashMap behaviour to the
 * Meow Engine.
 *
 * @author tapsi
 * @since 26.05.2011
 * 
 * @class
 * @name Dictionary
 * @memberOf meow
 */
meow.Dictionary = meow.Class.$extend( /** @lends meow.Dictionary# */
{
	/** @private */
	data : {},

	/**
	 * Removes a key from the dictionary.
	 */
	remove : function( key )
	{
		delete this.data[ key ]
	},

	/**
	 * Removes a value from the dictionary. Only the first key, that is
	 * associated with the value, will be deleted.
	 *
	 * @return {Boolean} true, if a key was deleted, else false
	 */
	removeValue : function( val )
	{
		for( i in this.data )
			if( this.data[i] == val )
			{
				this.remove( i )
				return true
			}

		return false
	},

	/**
	 * Sets the value, that will be associated with the key.
	 *
	 * @param {String} key
	 * @param val value
	 */
	put : function( key, val )
	{
		this.data[key] = val
	},

	/**
	 * Returns the value, that is associated with the key.
	 *
	 * @param {String} key
	 */
	get : function( key )
	{
		return this.data[key]
	},

	/**
	 * Removes all keys from the dictionary.
	 */
	clear : function()
	{
		var i
		var array = []
		for( i in this.data )
			array.push( i )
			
		for( i = 0 ; i < array.length ; i++ ) 
			delete this.data[ array[i] ]
	}
})