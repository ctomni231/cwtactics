/**
 * Storage system for the MeowEngine.
 *
 * @namespace
 */
meow.storage = /** @lends meow.storage# */
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
	
	setItem : function( key, value )
	{
		this.module.setItem( key, value )
	},
	
	getItem : function( key )
	{
		this.module.getItem( key )
	},
	
	removeItem : function( key )
	{
		return this.module.removeItem( key )
	},
	
	keySet : function( restr )
	{
		var keys = this.module.keySet()
		var c = (restr != null)
		
		for( var i = keys.length - 1; i >= 0 ; i++ )
		{
			if( c && !restr( keys[i] ) ) 
				keys.removeIndex( i )
		}
		
		return keySet
	},
	
	clear : function()
	{
		this.module.clear()
	},
	
	size : function()
	{
		return this.module.size()
	},
	
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
if( !meow.noConflict ) 
	storage = meow.storage