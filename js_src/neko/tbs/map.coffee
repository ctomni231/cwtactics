neko.module "neko.tbs.map" , ( require, exports ) -> 
  
  exports.Map = class Map 
    
    tileAt: ( x, y ) -> 
      ###
        Returns a tile at a given position
      ###
      return
    
    neighborsOf: ( x, y, callback ) -> 
      ###
        **@param {Function} callback** -> called on every neighbor
      ###
      return
    
    isNeighborOf: ( x, y, xS, yS, range ) ->
      ### 
        **@param {Integer}** range -> allowed distance between both, to be 
                                      neighbors
        **@return {Boolean}** true, if the positions are neighbors  
      ###
      return
      
    eachTile: ( callback ) ->
      return
      
    distance: ( x1, y1, x2, y2 ) ->
      ### 
        **@return {Integer}** the distance between two positions 
      ###
      return
          
  
  exports.SquareMap = class SquareMap extends Map
    
    constructor: () ->
      @tiles = []
    
    
    neighborsOf: ( x, y, callback, range = 1 ) -> 
      ### @see neko.module.Map.neighborsOf ###
      
      if 0 <= x < @mapWidth and 0 <= y < @mapHeight and range >= 1
        
        # get temp vars
        tY = y-range
        bY = y+range
        tmp = 0
        mod = 1
        
        # This is an enhanced algorithm, that based on my original algorithm
        # form MiniWars. But this algorithm not based on a recursive way, it
        # uses an iteration based way, that is faster and uses less resources.
        
        # walk from top to bottom
        for nY in [tY..bY] by 1
          lX = x-tmp
          rX = x+tmp
          
          # walk from left to right in dependency to the distance to the 
          # source position
          for nX in [lX..rX] by 1
            if 0 <= nX < @mapWidth and 0 <= nY < @mapHeight  
              callback @tiles[ @convertToIndex(nX,nY) ]
            
          tmp += mod
   
          # decrease tmp if you reach the y value of the source position
          if tmp is range then mod = -1
        
        return
      else throw "IllegalArguments"
       
    
    eachTile: ( callback ) ->
      throw "IllegalArgument" unless callback?
      
      e = (@mapWidth*@mapHeight) - 1
      for i in [0..e] by 1
        tile = @tiles[i] 
        
        # do we really need x,y ?
        # maybe outsourcing it into a function, that will be callable if 
        # needed... -> check it via performance checks
        y = Math.floor( i/@mapWidth )
        x = i%@mapWidth
        
        callback x, y, tile
      
      return
      
      
    tileAt: ( x, y ) ->
      ### @see neko.module.Map.tileAt ###
      
      if 0 <= x < @mapWidth and 0 <= y < @mapHeight
        return @tiles[ @convertToIndex(x,y) ]
      else throw "IllegalArguments"
        
        
    isNeighborOf: ( x, y, xS, yS, range = 1 ) -> 
      ### @see neko.module.Map.isNeighborOf ###
      
      return if 0 <= x < @mapWidth and 0 <= y < @mapHeight and range >= 1
          @distance( x, y, xS, yS ) is range 
        else throw "IllegalArguments"
      
      
    distance: ( x1, y1, x2, y2 ) -> 
      ### @see neko.module.Map.distance ###
      
      return if 0 <= x < @mapWidth and 0 <= y < @mapHeight
          Math.abs(x1-x2) + Math.abs(y1-y2)
        else -1
              
              
    convertToIndex: ( x, y ) -> 
      ### 
        **@return {Integer}** the index of a valid position in the data 
                              array. If the position is not valid, -1 will be
                              returned.
      ###
      
      return if 0 <= x < @mapWidth and 0 <= y < @mapHeight
          ( y*@mapWidth )+x
        else -1
    
    
  exports.HexaMap = class HexaMap extends Map
    
    constructor: () ->
      throw "NIY";
      
  exports.MapCreator =
    ###
      MapCreator allows to setup the map objects in an easy way.
    ###
 
    # uses the old array for the new data, leaves data if old array is longer
    # than the new one
    CACHE_ARRAY_AND_DATA : 0
    
    # uses the old array for the new data, removes data if old array is longer
    # than the new one
    CACHE_ARRAY_CUT_DATA : 1
    
    # deletes the old array and injects a new one into the map object
    REMOVE_ARRAY_AND_DATA : 2
    
    setMapData : ( map, mapData, mode = @CACHE_ARRAY_AND_DATA ) ->
      unless map instanceof Map
        throw "IllegalArgument; map isn't a neko.tbs.map.Map" 
      
      switch mode 
        when @CACHE_ARRAY_AND_DATA then
          #...
        when @CACHE_ARRAY_CUT_DATA then
          #...
        when @REMOVE_ARRAY_AND_DATA then 
          #...
        else throw "IllegalArgument; unknown mode parameter"
    