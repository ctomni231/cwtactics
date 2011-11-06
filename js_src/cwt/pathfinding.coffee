neko.module "neko.pathfinding", ( require, exports, base ) -> 

  exports.findPath = ( xS, yS, xD, yD ) ->
    return no
    
  exports.A_STAR        = A_STAR        = 0
  exports.DETERMINISTIC = DETERMINISTIC = 1
    
  exports.setAlgorithm = ( type ) ->
    switch type
      when A_START
        #...
      when DETERMINISTIC
        #...
    return