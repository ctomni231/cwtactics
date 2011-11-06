##
# This module holds the functionality of commander instances in the game.
# Custom Wars Tactics allows AWDS 1/2 style COs and AWDoR style commanders. 
#
neko.define "cwt.CO", ( require, exports, base ) ->
  
  ##
  # PRIVATE
  ##
  
  # storage object, for saving the CO data for players
  p_data = []
    
  p_indexOf = ( player ) ->
    switch p_mode 
      when p_CO then 1+player.ID()*3
      when p_TCO then 1+player.ID()*4
      when p_COMM then 1+player.ID()*4
      else base.error.illegalArgs("unknown CO mode")
    
    
  ##
  # PUBLIC API
  ##
  
  exports.MODE_CO         = p_CO   = 0
  exports.MODE_TAG_CO     = p_TCO  = 1
  exports.MODE_COMMANDER  = p_COMM = 2
  exports.IDLE = 0
  exports.COP  = 1
  exports.SCOP = 2
  exports.TCOP = 3
  
  ##
  # @restriction CO mode has to be MODE_COMMANDER
  #
  exports.attachedTo = ( player ) ->
    unless p_data[0] is p_COMM 
      base.error.notAllowed("CO module isn't in the commander mode")
      
    return p_indexOf( player )+3
  
  ##
  # @returns {Integer} the power of the CO of a player.
  #
  exports.coPower = ( player ) ->
    return p_indexOf( player )+2
  
  ##
  # Sets the CO power of a player to a given value.
  #
  exports.setCoPower = ( player, value ) ->
    p_data[ p_indexOf( player )+2 ] = value
  
  ##
  # Changes the power of the CO of a player.
  # @param value {Integer} value that will be added to the current value 
  # 
  exports.changeCoPower = ( player, value ) ->
    p_data[ p_indexOf( player )+2 ] += value
  
  ##
  # @return {Integer} status number of the CO of a player
  #
  exports.coStatus = ( player ) ->
    return p_indexOf( player )+1
    
  ##
  # Sets the CO status of a player.
  #
  exports.setCoStatus = ( player, status ) ->
    base.isOneOf status, exports.IDLE, exports.COP, exports.SCOP, exports.TCOP
    p_data[ p_indexOf( player )+1 ] = status
  
  ##
  # @return {String} CO type name
  # 
  exports.coName = ( player ) ->
    return p_indexOf( player )
  
  ##
  # Sets the CO type name of a player.
  # 
  exports.setCoName = ( player, name ) ->
    p_data[ p_indexOf( player ) ] = name
  
  ##
  # Returns the current mode of the CO module.
  #
  exports.mode = () -> p_data[0]
    
  
  ##        
  # SYSTEM FUNCTIONS
  ##                
  
  exports.saveStatus = ( block ) ->
    block["data"] = base.toJSON p_data
    return
     
  exports.loadStatus = ( data ) ->
    block     = base.fromJSON data
    p_data    = block.data
    block     = null
    return