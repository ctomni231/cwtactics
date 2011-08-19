#
# classes for map objects
#
neko.module "model.classes", ( require, exports ) -> 
  
    #
    # Unit represents an unit on the map.
    #
    exports.Unit = class Unit
    
        clean: ( @type ) ->
            throw new Error "InvalidType, must be UnitType" unless @sheet()?
            
            @hp     = 0
            @ammo   = @type.maxAmmo
            @fuel   = @type.maxFuel
            @rank   = 0
            @exp    = 0
            @canAct = no
            @owner  = null
            
        sheet: () -> db.unit( @type )
    
    
    #
    # Tile class represents a tile on the game map.
    #
    exports.Tile = class Tile
        
        clean: ( @type ) ->    
            throw new Error "InvalidType, must be TileType" unless @sheet()?
            
            @capturePoints  = type.capturePoints ? 0
            
        
        sheet: () -> db.tile( @type )
    
    
    #
    # Player class represents a single player instance in a game round.
    #
    exports.Player = class Player
        
      constructor: () ->
        #@units      = []
        #@properties = []
        
      clean: ( @name, @team ) ->
        #@units.clear()
        #@properties.clear()
            
            ###
      hasUnit: ( unit ) ->
        throw new Error "Player.hasUnit; invalid parameter" unless unit instanceof Unit
               		
        return @units.indexOf unit is not -1
      
      deleteUnit: ( unit ) ->
        throw new Error "Player.deleteUnit; invalid parameter" unless unit instanceof Unit
        
        index = @units.indexOf unit
        if index is not -1 
        	@units.splice index , 1 
        else 
        	throw new Error "Player.deleteUnit; player does not own unit #{unit}"
    		
    		return
    		###
    
    #
    # Loader class will be used as load container for a transport unit.
    # 
    exports.Loader = class Loader
    
        constructor: () ->
            @content = []
    
        addLoad: ( l ) ->
            @content.push( l ) if l instanceof Unit
            return
    
        remLoad: ( l ) ->
            i = @content.indexOf( l )
            @content.remove( i ) if l != -1
            return
    
        loadedWeigth: () ->
            n = 0
            n += u.type.weigth for u in @content
            return  