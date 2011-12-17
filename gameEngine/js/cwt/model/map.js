define(["cwt/properties"],function(props){
  
  /*************
   * VARIABLES *
   *************/
  
  var _mapData = [];
  var _mapW = 0;
  var _mapH = 0;
  var _objects = {};
  var _properties = {};
  
  /**
   * @param x {Integer} x coordinate
   * @param y {Integer} y coordinate
   * @return the index position of the a given coordinate in the mapData array
   * @private
   */
  var _toIndex = function( x,y )
  {
    return y*_mapW+x;
  }
  
  //TEST DATA
  //_mapW = 50;
  //_mapH = 37;
  _mapW = 25;
  _mapH = 18;
  for( var i = 0, e=_mapW*_mapH; i<e; i++ )
  {
    _mapData[i] = parseInt( (Math.random()*15).toString() );
  }
  
  
  /******************
   * IMPLEMENTATION *
   ******************/
  
  return {
    
    loadMap: function( mapData )
    {
      if( mapData.width > props.MAX_MAP_WIDTH || 
          mapData.height > props.MAX_MAP_HEIGHT ) 
          throw new Error("map is to big");
    },
    
    getData: function()
    {
      return _mapData
    },
    
    onNeighbours: function( x,y,callback, range )
    {
      //neko.numbers(x,y);
      //neko.functions(callback);
      //range= neko.defaultValue(range,1);
      
      var _list = [];
      //build list
      
      callback.call(null,_list);
      
      _list.slice(0, _list.length-1);
      delete _list;
    },
    
    /**
     * @return distance in tiles between the two tiles
     */
    distance: function( sX,sY,dX,dY )
    {
      return Math.abs(sX-dX)+Math.abs(sY-dY)
    },
    
    isNeighbourOf: function( sX,sY,dX,dY, range )
    {
      //range= neko.defaultValue(range,1);
      return range === this.distance(sX,sY,dX,dY);
    },
    
    width: function()
    {
      return _mapW;
    },
    
    height: function()
    {
      return _mapH;
    },
    
    __save__: function( block )
    {
      // save map data
      block.data = _mapData;
      block.width = _mapW;
      block.height = _mapH;
      
      // save map objects
    },
    
    __load__: function( block )
    {
      // load map data
      _mapData = block.data;
      _mapW = block.width;
      _mapH = block.height;
      
      // load map objects
    }
  }
})