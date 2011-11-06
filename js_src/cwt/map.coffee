neko.define "cwt.map", ( require, exports, base ) ->
  
  p_MIN_SIZE_LEN = 5
  p_init = no
  p_intMapW = 0
  p_intMapH = 0
  p_mapType = null
  
  # constants
  exports.TILE_LEVEL = 0
  exports.UNIT_LEVEL = 1
  exports.SQUARE_MAP = 0
  exports.HEXA_MAP   = 1
  
  exports.initialize = ( mapType, maxWidth, maxHeight ) ->
        
    # check map size
    unless p_MIN_SIZE_LEN <= maxWidth < base.property["CWT_MAP_MAX_WIDTH"] and
           p_MIN_SIZE_LEN <= maxHeight < base.property["CWT_MAP_MAX_HEIGHT"]
      base.error.ILLEGAL_ARGS()
    
    p_intMapW = mapWidth
    p_intMapH = mapHeight
          
    return
  
  exports.loadMap = ( mapData ) ->
    base.error.notImplementedYet()
  
  exports.objectAt = ( x, y, level=0 ) ->
    base.error.notImplementedYet()
    
  exports.isNeighborOf = ( xS, yS, xD ,yD ,range=1 ) ->
    base.error.notImplementedYet()
  
  exports.neighborsOf = ( x, y, callback, range=1 ) ->
    base.error.notImplementedYet()
  
  exports.distance = ( xS, yS, xD, yD ) ->
    base.error.notImplementedYet()
  

neko.test "cwt.map", ( require ) ->
  # later a test will be written here