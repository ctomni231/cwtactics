(function(){
	
	var _isTrue = meowEngine.assert.isTrue;
	var _typeSheet = cwt.sheets.TypeSheet;
	
	var _typeObject = meowEngine.Class({

		setType : function( type ){
			
			_isTrue( type instanceof _typeSheet );
			
			this.type = type;
		}
	});
        Object.seal( _typeObject );


   	/*
     * Classes 
     */

    var Unit = meowEngine.Class( _typeObject, {

        constructor : function(){

            this.clean();
        },

        clean : function(){

            this.hp = 99;
            this.ammo = 0;
            this.fuel = 0;
            
        }
    });

    var Tile = meowEngine.Class({

        constructor : function(){

            this.clean();
        },

        clean : function(){

        }
    });

    var Player = meowEngine.Class({

        constructor : function(){

            this.name = "PLAYER";
            this.gold = 0;
            this.numberOfUnits = 0;
            this.numberOfProperties = 0;
        }
    });











    
    var unitList = [];
    var tiles = [];
    var playerList = [];
    var unitTileRelationships = {};
    var i,e;

    // map data
    var map_w = 0;
    var map_h = 0;


    // fill unit lists
    ///////////////////

    for( i = 0, e = 8*50; i < e; i++ ){
        unitList[i] = new Unit();
    }

    for( i = 0, e = 8; i < e; i++ ){
        playerList[i] = new Player();
    }

    for( i = 0, e = 1000*1000; i < e; i++ ){
        tiles[i] = new Tile();
    }

    // custom functions
    ////////////////////

    var setUnitReleation = function( unit, oldTile, newTile ){

        var index;

        // clear old
        if( oldTile instanceof Tile ){
            index = tiles.indexOf( oldTile );
            delete unitTileRelationships[ index ];
        }

        // set new 
        if( newTile instanceof Tile ){
            index = tiles.indexOf( newTile );
            unitTileRelationships[ index ] = unit;
        }
    };

    var tileAt = function( x, y ){

        // illegal arguments (INSERT ASSERT LATER)
        if( x >= map_w || x < 0 || y >= map_h || y < 0 ) return null;

        // convert 2D to 1D value
        x = x + ( y * map_w );

        return tiles[x];
    };

    var tileOccupied = function(){

        var t;
        // argument is tile
        if( arguments.length === 1 ){
            t = unitTileRelationships[ tiles.indexOf(arguments[0])];
            return t instanceof Tile;
        }
        // arguments are x,y
        else if( arguments.length === 2 ){
            t = unitTileRelationships[ tileAt(arguments[0],arguments[1]) ];
            return t instanceof Tile;
        }
        // illegal args
        else{
            return null;
        }
    }
})();