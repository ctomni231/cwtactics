neko.module "neko.tbs.zone", ( require, exports ) ->
  
  module_map = require "neko.tbs.map"
  
  exports.addZoneAbility = ( map ) ->
    throw "IllegalArgument" unless map instanceof module_map.Map
        
    # append parameter to each tile
    map.eachTile ( x, y, tile ) -> 
      throw "PropertyAlreadySet; 'zone'" if tile.zone?
      tile.zone = -1  # zone property shows in what zone a tile is