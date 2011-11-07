neko.module "neko.fog", ( require, exports, base ) ->  

  Tile = require("cwt.model").Tile
  Unit = require("cwt.model").Unit
  map  = require("cwt.map")

  _fogData = {}       # fog storage
  _calculation = null # calculation function
  _fogCalcData = null # tempoary store for calculation function
  
  # constants
  exports.SIMPLE_FOG = SIMPLE_FOG = 0
  exports.LINE_FOG   = LINE_FOG   = 1
    
  ##
  # More complex version of the simple calculation. It allows the existence 
  # of blocking vision. This is a little bit more realistic and allows more
  # tactical movements.
  #
  _straightLineCalculation = () ->
    return
  
  ##
  # AWDS fog calculation function. Very basic, but allows hidden objects like
  # forests and stealth units.
  #
  _simpleFogCalculation = ( player ) ->
  
    
  
    # first the units
    
    # second the properties
  
    return
  
  ##
  # VisibleData class is used to store the fog data for a player.
  #
  class VisibleData 
    
    @NOT_VISIBLE = 0
    @VISIBLE = 1
    
    constructor: () -> 
      @visibleTiles = {}
      @hiddenUnits = {}
  
  ##
  # Initializes the fog system and prepares the cache data.
  #
  # @param type {Integer} can be SIMPLE_FOG or LINE_FOG
  # @trows IllegalArguments if the fog system is already initialized
  #
  exports.initialize = ( type ) ->
    if _calculation? 
      base.error.noAllowed("fog system is already initialized")
      
    switch type
      when SIMPLE_FOG 
        _calculation = _simpleFogCalculation
      
      when LINE_FOG
        base.error.notAllowed("not available in this version")
        _calculation = _straightLineCalculation
        
      else base.error.illegalArgs()
  
  ##
  # Checks the visibility of an object for a player.
  #
  # @param player {Player} player object
  # @param object {Tile|Unit} object that will be checked
  # @return {Boolean} yes if visible, else no
  #
  exports.isVisible = ( player, object ) ->
    if object instanceof Unit 
      base.error.notImplementedYet()
    else if object instanceof Tile
      base.error.notImplementedYet()
    else base.error.illegalArgs(()
  
  exports.processFog = ( ) ->
    # not sure how it will be atm
    base.error.notImplementedYet()


neko.test "cwt.fog" , ( require ) ->
  # later a test will be written here