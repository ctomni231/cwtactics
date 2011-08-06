/*
 * PROTOTYPE NEKO DEFINE WITH DEPENDENCY INJECTION INTO
 */
neko.define( "model/object", 
        ["data/database","properties","assert","check","arrayHelper"],
        function( db, properties, assert, chk, arrayHlp ){
            
    var DEBUG = properties.getProperty("DEBUG") === true;
    var LOGGER = properties.getProperty("LOGGER");
    var MAX_VISION = properties.getProperty("MAX_VISION");
    var d = MAX_VISION+MAX_VISION+1;
    var n = d*d;
    var MAX_NUM_VIS_TILES = ((n-1)/2) +1;
    var map = [];
    var unitMapRel = {};

    var gameH = 0;
    var gameW = 0;
    var maxW = properties.getProperty("MAX_MAP_WIDTH");
    var maxH = properties.getProperty("MAX_MAP_HEIGHT");
    var maxUnits = properties.getProperty("MAX_UNITS_PER_PLAYER");
    var maxPlayer = properties.getProperty("MAX_PLAYER");


    // check properties
    assert.ok( chk.isNumber(maxW) && maxW >= 5, "invalid MAX_MAP_WIDTH value");
    assert.ok( chk.isNumber(maxH) && maxH >= 5, "invalid MAX_MAP_HEIGHT value");
    assert.ok( chk.isNumber(maxUnits) && maxUnits >= 1,
               "invalid MAX_UNITS_PER_PLAYER value");
    assert.ok( chk.isNumber(maxPlayer) && maxPlayer >= 2,
               "invalid MAX_PLAYER value");


    var Unit = neko.Class({

        constructor : function(){
            
        },

        setType : function( typeID ){

            this._type  = typeID;
            var sheet   = this.typeSheet();

            this.hp     = 99;
            this.exp    = 0;
            this.rank   = 0;
            this.fuel   = sheet.maxFuel;
            this.ammo   = sheet.maxAmmo;
            this.canAct = false;
        },

        typeSheet : function(){
            return db.unit( this._type );
        }
    });

    var Tile = neko.Class({

        setType : function( typeID ){

            this._type = typeID;
            var sheet = this.typeSheet();

            this.capturePoints = 0;
        },

        typeSheet : function(){
            return db.tile( this._type );
        }
    });

    var Player = neko.Class({

        constructor : function(){

            this.name       = "";
            this.units      = [];
            this.properties = [];
            this.team       = -1;
        }
    });
    
    for( var i = 0, e = maxW*maxH; i < e; i++ ){ 
        map[i] = new Tile();
    }

    function setMapSize( w, h ){

        // check arguments
        assert.ok( chk.isNumber(w) && w >= 5 && w <= maxW &&
                   chk.isNumber(h) && h >= 5 && h <= maxH,
                   "invalid map size arguments" );

        //
        gameW = w;
        gameH = h;

        // setup tile types 
    }

    function getTile( x, y ){

        assert.ok( chk.isNumber(x) && x >= 0 && x < gameW &&
                   chk.isNumber(y) && y >= 0 && y < gameH,
                   "invalid coordinates" );

        return (y*gameW)+x;
    }

    // MAYBE ONLY ALLOW ONE KIND OF ARGUMENT FOR EASIER
    // API
    function getUnit(){

        var l = arguments.length;

        // argument is x and y
        if( l == 2 ){
            assert.ok( chk.isNumber(x) && x >= 0 && x < gameW &&
                   chk.isNumber(y) && y >= 0 && y < gameH,
                   "invalid coordinates" );

            var index = (y*gameW)+x;
            return unitMapRel[ index ];
        }
        // argument is a tile or an id
        else if( l == 1 ){

            var a = arguments[0];
            if( a instanceof Tile ){

                var index = map.indexOf(a); // check performance on bigger maps
                return unitMapRel[ index ];
            }
            else{

                assert.ok( chk.isNumber(a) && a >= 0 && a < gameH*gameW,
                           "invalid argument of getUnit" );
                           
                return unitMapRel[ a ];
            }
        }
    }




    /*
     * OBJECT DATABASE
     */


    // module API
    return{

        Unit    : Unit,
        Tile    : Tile,

        getTile : getTile,
        getUnit : getUnit,
        
        mapWidth : function(){return gameW;},
        mapHeight : function(){return gameH;}

    }
});