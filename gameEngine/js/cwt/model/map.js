define(["json!cwt/config","cwt/logic/properties"],function(cfg,properties){
  
  /*************
   * VARIABLES *
   *************/
  
  var _mapData = [];
  var _mapW = 0;
  var _mapH = 0;
  
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
      if( mapData.width > cfg.MAX_MAP_WIDTH || 
          mapData.height > cfg.MAX_MAP_HEIGHT ) 
          throw new Error("map is to big");
    },
    
    getData: function()
    {
      return _mapData
    },
    
    onNeighbors: function( x,y,callback, range )
    {
      var _list = [];
      
      callback.call(null,_list);
      
      _list.slice(0, _list.length-1);
      delete _list;
    },
    
    /**
     * @return distance in tiles between the two units.
     */
    unitDistance: function( u1, u2 )
    {
      var index1 = u1.__index__;
      var index2 = u2.__index__;
      
      var t1 = index1%_mapH;
      var t2 = index2%_mapH;
      
      // check that
      var distance = Math.abs( t1+t2 )+
                     Math.abs( (index1-t1)/_mapH+(index2-t2)/_mapH );
                   
      return distance;
    },
    
    /**
     * @return distance in tiles between the two positions.
     */
    distance: function( sX,sY,dX,dY )
    {
      return Math.abs(sX-dX)+Math.abs(sY-dY)
    },
    
    isNeighborOf: function( sX,sY,dX,dY, range )
    {
      // zero is also an invalid range
      if( !range || range < 0 ) range = 1;
      
      return range === this.distance(sX,sY,dX,dY);
    },
    
    width: function()
    {
      return _mapW;
    },
    
    height: function()
    {
      return _mapH;
    }
  }
})