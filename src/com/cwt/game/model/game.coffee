neko.module "model.game", ( require, exports ) ->
    
  properties  = require("properties")
  
  $c = require("checks")
  $a = require("assert")
    
  # get some necessary constants
  DEBUG       = properties.getProperty("DEBUG") is true;
  LOGGER      = properties.getProperty("LOGGER");

  MAX_VISION  = properties.getProperty("MAX_VISION");
  maxW        = properties.getProperty("MAX_MAP_WIDTH");
  maxH        = properties.getProperty("MAX_MAP_HEIGHT");
  maxUnits    = properties.getProperty("MAX_UNITS_PER_PLAYER");
  maxPlayer   = properties.getProperty("MAX_PLAYER");
   
  # module variables
  players = []
  units		= []
  map     = []
  mapH    = 0
  mapW    = 0

  # fill map with 
  mapArrL = maxW * maxH
  ( map.push( new Tile ) ) for i in [ 0..mapArrL ]
    
    
  exports.mapHeight = () -> return mapH
    
  exports.mapWidth = () -> return mapW
    
  #
  # returns the amount of units in the game round
  #
  # @return {Number} amount of units
  #
  exports.activeUnits = () -> 
    n = 0
    (n += player.units.length) for player in players
    return n
    
    
  exports.playerExists = ( playerID ) ->
    throw new Error "playerExists; invalid ID" unless ( playerID >= 0 and 
                           					   									playerID < maxPlayer )
		return players[ playerID ] is not null
  
	
  #
  # Returns a tile object from a given position
  #
  exports.getTile = getTile = ( x,y ) -> 
    throw new Error "getTile; invalid parameter(s)" unless x >= 0 and x < mapW and y >= 0 and y < mapH
    
    return map[ (y*mapW)+x ]
 
  
  #
  # Returns the unit of a given position. Returns null, if
  # the position is not occupied by an unit.  
  #
  exports.getUnit = ( x,y ) ->	
    tile = getTile( x,y )
    return tile.unit ? null
  
  #
  # Moves an unit virtually on map from (xS,yS) to (xD,yD)
  #
  exports.moveUnit = ( xS, yS, xD, yD ) ->
  	sTile = getTile( xS,yS )
  	dTile = getTile( xD,yD )
  	unit = sTile.unit 
  	
  	# check positions
  	throw new Error "moveUnit; source position contains no unit" unless unit?
  	throw new Error "moveUnit; destination position contains an unit" if dTile.unit?
  	
  	# change position
  	delete sTile.unit
  	dTile.unit = unit
  	return
  
  #
  # Destroys an unit and deletes it position
  #
  exports.destroyUnit = ( x,y ) ->
    tile = getTile( x,y )
    unit = tile.unit
    
    throw new Error "destroyUnit; tile #{tile} contains no unit" unless unit?
    
    # delete unit from map
    delete tile.unit
    unit.owner = null		# mark unit.owner as null, means that it does not exists virtually 
        
  #
  # simple testing function, to define a basic map in memory
  #
  exports.testInit = () ->
    
    plain = require("database").tiles["PLAIN"]
        
    # set all 
    ( tile.type = plain ) for tile in map 
        
    return