meow.sys.reqModule("MeowAssert")

/**
 * Storage system for the MeowEngine.
 *
 * @author tapsi
 * @since 26.05.2011
 * @namespace
 */
meow.storage =
/** @lends meow.storage# */
{
	OPERATION_NOT_SUPPORTED : -1,
	
	/**
	 *
	 * @example
	 * Structure:
	 *
	 * void setItem( String key , Object value )
	 * void getItem( String key )
	 * removeItem( String key )
	 * List<String> keySet()
	 * void clear()
	 * int size()
	 * int leftSpace()
	 */
	module : null,

	/**
	 * Sets the value for a given key.
	 */
	setItem : function( key, value )
	{
		this.module.setItem( key, value )
	},

	/**
	 * Returns the value associated with a given key.
	 */
	getItem : function( key )
	{
		this.module.getItem( key )
	},

	/**
	 * Removes a key with the shared value from the storage object.
	 */
	removeItem : function( key )
	{
		return this.module.removeItem( key )
	},

	/**
	 * Returns a list with the keys, stored in the storage object.
	 *
	 * @param {Function} restr restriction function, that can filter the keys
	 *						   out. Called in this way function( String key )
	 *						   and should be return true, key will be added to
	 *						   list or false, key will not pushed to the list.
	 */
	keySet : function( restr )
	{
		var keys = this.module.keySet()
		var c = (restr != null)
		if( c && !meow.assert.isFunction(restr) )
			throw "restriction parameter is not a function, but should be!"
		
		for( var i = keys.length - 1; i >= 0 ; i++ )
		{
			if( c && !restr( keys[i] ) ) 
				keys.removeIndex( i )
		}
		
		return keySet
	},

	/**
	 * Clears the storage object.
	 */
	clear : function()
	{
		this.module.clear()
	},

	/**
	 * Returns number of keys in the storage object.
	 */
	size : function()
	{
		return this.module.size()
	},

	/**
	 * Returns left space in the storage object.
	 */
	leftSpace : function()
	{
		var f = this.module.leftSpace
		if( typeof f !== 'undefined' )
			return OPERATION_NOT_SUPPORTED
		else
			return f()
	}
}

// register globally, if no noConflict is set
if( !MEOW_NOCONFLICT ) storage = meow.storage