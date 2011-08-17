neko.module ( require, exports ) -> 

    #
    # Unit represents an unit on the map.
    #
    exports.Unit = class Unit
    
        clean: ( @type ) ->
            throw new Error "InvalidType, type must be UnitType" unless @sheet()?
            
            @hp     = 0
            @ammo   = @type.maxAmmo
            @fuel   = @type.maxFuel
            @rank   = 0
            @exp    = 0
            @canAct = no
            
        sheet: () -> db.unit( @type )
    
    
    #
    # Tile class represents a tile on the game map.
    #
    exports.Tile = class Tile
        
        clean: ( @type ) ->    
            throw new Error "InvalidType, type must be TileType" unless @sheet()?
            
            @capturePoints  = type.capturePoints ? 0
            
        
        sheet: () -> db.tile( @type )
    
    
    #
    # Player class represents a single player instance in a game round.
    #
    exports.Player = class Player
        
        constructor: () ->
            @units      = []
            @properties = []
        
        clean: ( @name, @team ) ->
            @units.clear()
            @properties.clear()
    
    
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