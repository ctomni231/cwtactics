meow.sys.reqModule(["MeowClass","MeowDictionary"])

/**
 * MapObject class used in the tileMap class.
 * 
 * @class
 */
meow.tileMap.MapObject = meow.Class.$extend( /** @lends meow.tileMap.MapObject# */ {
	clean : meow.EMPTY_FUNCTION
})

/**
 * @class
 */
meow.tileMap.Map = meow.Class.$extend( /** @lends meow.tileMap.Map# */ {
	tiles : null,
	
	// describes inernal matrix sizes
	ct_h : 0,
	ct_w : 0,
	
	// describes active game sizes
	width : 0,
	height : 0,
	
	__init__ : function( w, h , TileClass )
	{
		isNum(w)
		isNum(h)
		
		this.ct_w = w
		this.ct_h = h
		
		this.tiles = new Array( w*h )
		
		// create map objects
		for( var i = 0; i < this.tiles.length ; i++ )
			this.tiles[i] = new TileClass()
	},
	
	setActiveArea : function( w, h )
	{
		isNum(w)
		isNum(h)
		
		this.width = w
		this.height = h
	},
	
	tileAt : function( x,y )
	{
		isNum(x)
		isNum(y)
		
		if( x < 0 || x >= this.width || y < 0 || y >= this.height )
			throw "Invalid coordinates"
		
		var pos = y*this.ct_w + x
		
		return this.tiles[pos]
	}
})