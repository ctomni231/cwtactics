meow.sys.reqModule("MeowClass")

meow.Dictionary = meow.Class.$extend({
	data : {},
	
	remove : function( key )
	{
		delete this.data[ key ]
	},
	
	removeValue : function( val )
	{
		for( i in this.data )
			if( this.data[i] == val )
			{
				this.remove( i )
			}
	},
	
	put : function( key, val )
	{
		this.data[key] = val
	},
	
	get : function( key )
	{
		return this.data[key]
	},
	
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