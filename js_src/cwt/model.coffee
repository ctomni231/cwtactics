##
# This module contains different object classes. It will be used as entities
# for the game. Heavily used by the map module.
#
neko.define "cwt.model", ( require, exports, base ) ->
  
  p_maxHP = base.property["CWT.MAX_HP"] ? 20
  
  db = require("cwt.database")
  
  ##
  # Unit class that represents usable units in the game.
  #
  exports.Unit = class Unit
    initialize: ( @typeID ) ->  
      p_sheet = @sheet()
      base.notNull( p_sheet )
      
      @hp     = p_maxHP
      @fuel   = p_sheet.fuel
      @ammo   = p_sheet.ammo
      @canAct = yes
      @exp    = 0
      @rank   = 0
    
    sheet: () ->
      return db.unitSheet( @type );
  
  ##
  # Tile class that represents a single tile object on the map.
  #
  exports.Tile = class Tile
    initialize: ( @typeID ) ->
      base.notNull( @sheet() )
      return

    sheet: () ->
      return db.tileSheet( @type );
   
  ##
  # Property class is an enhanced tile, that can be captured by capturing
  # units.
  #   
  exports.PropertyTrait = class Property
    initialize: () ->
      @owner  = null
      @points = p_sheet.capturePoints
      return
    
    isNeutral: ->
      return @owner?
      
    capture: ( unit ) ->
      #...
      return