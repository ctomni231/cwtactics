/**
 * @namespace
 */
meow =
/** @lends meow# */
{
	/**
	 * Empty function object.
	 *
	 * @constant
	 * @field
	 */
	EMPTY_FUNCTION : function(){}
}

/**
 * MeowSystem 
 * @class
 */
meow.sys =
{	
	/**
	 * Returns the root object. Useful in a java rhino evironment, where
	 * the window keyword does not exists.
	 */
	getGlobal : function()
	{
		return (function(){return this;}).call(null);
	},
	
	/**
	 * Returns the name of a function object.
	 */
	getFunctionName : function( func )
	{
		var str = ((func.toString()).match(/( \w+)/)[0])
		str = str.slice( 1 , str.length )
	
		return str
	},

	/**
	 * Structure:
	 *  void loadJS( String path ) => loads a local javascript file, compiles and runs it  
	 */
	compContext : null,
	
	/** 
	 * Holds all loaded modules 
	 * @private 
	 */
	loadedModules : new Array(),
	
	/**
	 * Loads a module, if it isn't loaded before.
	 *
	 * Current support only for js modules, future version 
	 * will allow lazy loading of data objects as well ( maybe :P )
	 */
	reqModule : function( file )
	{
		// is array ?
		//if( file.length )
		//	for( var i = 0 ; i < file.length ; i++ )
		//		this.reqModule( file[i] )
		
		if( this.compContext == null )
		{
			//out.critical("compiler context is not set")
			return
		}
		
		if( !this.loadedModules.contains(file) )
		{
			this.compContext.loadJS( file+".js" )
			
			this.loadedModules.push(file)
		}
	},
	
	evaluate : function( str )
	{
		eval( str )
	},

	setObjectValue : function( namespace , value )
	{
		var p = namespace.lastIndexOf(".")
		var attr = namespace.slice( p+1 )
		namespace = namespace.slice( 0 , p )

		this.getObjectValue( namespace )[attr] = value
	},

	getObjectValue : function( namespace )
	{
		namespace = namespace.split(".")
		var obj = meow.sys.getGlobal()

		for( var i = 0 ; i < namespace.length ; i++ )
			obj = obj[ namespace[i] ]

		return obj
	}

}

	
/* ARRAY PROTOTYPE FUNCTIONS 
 *****************************/
 
	// by John Resig (MIT Licensed)
	Array.prototype.removeRange = function(from, to) 
	{
	  var rest = this.slice((to || from) + 1 || this.length)
	  
	  this.length = from < 0 ? this.length + from : from
	
	  return this.push.apply(this, rest)
	}
	
	Array.prototype.removeIndex = function( index )
	{
		if( index >= 0 && index < this.length )
			this.splice(index, 1)
	}
	
	Array.prototype.remove = function( obj )
	{
		var i = this.indexOf( obj )
	
		if(i != -1)
			this.splice(i, 1)
	}
	
	Array.prototype.contains = function( obj )
	{
		return this.indexOf( obj ) != -1
	}

