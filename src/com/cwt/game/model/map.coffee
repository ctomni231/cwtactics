

neko.module ( require, exports ) ->
    
    properties  = require("properties")
    
    # get some necessary constants
    DEBUG       = properties.getProperty("DEBUG") is true;
    LOGGER      = properties.getProperty("LOGGER");

    MAX_VISION  = properties.getProperty("MAX_VISION");
    maxW        = properties.getProperty("MAX_MAP_WIDTH");
    maxH        = properties.getProperty("MAX_MAP_HEIGHT");
    maxUnits    = properties.getProperty("MAX_UNITS_PER_PLAYER");
    maxPlayer   = properties.getProperty("MAX_PLAYER");
   
    # module variables
    map  = []
    mapH = 0
    mapW = 0

    # fill map with 
    mapArrL = maxW * maxH
    map.push( new Tile ) for i in [ 0..mapArrL ]
    
    
    exports.mapHeight = () -> mapH
    
    exports.mapWidth = () -> mapW
    
    #
    # simple testing function, to define a basic map in memory
    #
    exports.testInit = () ->
    
        plain = require("database").tiles["PLAIN"]
        
        # set all 
        tile.type = plain for tile in map 
        
        return