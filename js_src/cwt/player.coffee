neko.define "cwt.player", ( require, exports, base ) ->
  
  exports.AI    = 0
  exports.HUMAN = 1
  
  exports.Player = class Player 
    initialize: ( @name, type ) ->
      
      base.notEmpty @name
      base.isOneOf type, exports.HUMAN, exports.AI
      
      # properties
      unless @properties? then @properties = []
      @properties.clear()
      
      # units
      unless @units? then @units = []
      @units.clear()
      