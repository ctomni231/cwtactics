neko.define("data/database", ["assert","checks","properties"],
                          function( assert, check, properties ){

    var fire_DIRECT = "DIRECT";
    var fire_INDIRECT = "INDIRECT";
    var MOD_NAME = properties.getProperty("MOD_NAME");
    var MOD_PATH = properties.getProperty("MOD_PATH");


    // DATABASE FIELDS
    var tiles = {};
    var units = {};
    var weapons = {};
    var weathers = {};
    var moveTypes = {};

    
    var UnitSheet = neko.Class({

        constructor : function( jsonObj ){
            
            /* GET DATA FROM JSON OBJECT */

            var ID = jsonObj.ID;
            var maxAmmo = jsonObj.maxAmmo;
            var maxFuel = jsonObj.maxFuel;
            var vision = jsonObj.vision;
            var captureRate = jsonObj.captureRate;
            var weight = jsonObj.weight;
            var moveRange = jsonObj.moveRange;
            var moveType = jsonObj.moveType;
            var weapons = jsonObj.weapons;
            var cost = jsonObj.cost;
            var tags = jsonObj.tags;
            
            // transport
            var loads = jsonObj.loads;
            var loadAble = jsonObj.loadAble;


            /* CHECK PROPERTIES AND INJECT THEM */

            // ID check
            assert.ok( check.isString( ID ) && check.notEmpty( ID ),
                       "Invalid UnitSheet ID");
            assert.ok( !units.hasOwnProperty( ID ),
                       "ID "+ID+" already exists" );

            // ammo
            this.maxAmmo = 0;
            if( !check.isUndefined(maxAmmo) ){

                assert.ok( check.isNumber(maxAmmo) && maxAmmo >= 0 ,
                           "maxAmmo has to be a number greater equals zero");
                this.maxAmmo = maxAmmo;
            }

            // fuel
            assert.ok( check.isNumber(maxFuel) && maxFuel >= 0 ,
                       "maxFuel has to be a number greater equals zero");
            this.maxFuel = maxFuel;

            // vision
            assert.ok( check.isNumber(vision) && vision >= 0 && vision <= 15,
                       "vision has to be a number greater equals zero");
            this.vision = vision;

            // capture rate
            this.captureRate = 0;
            if( !check.isUndefined(captureRate) ){
                
                assert.ok( check.isNumber(captureRate) && captureRate > 0 ,
                           "captureRate has to be a number greater zero");
                this.captureRate = captureRate;
            }

            // weight
            assert.ok( check.isNumber(weight) && weight >= 1 ,
                       "weight has to be a number greater equals one");
            this.weight = weight;

            // move range
            assert.ok( check.isNumber(moveRange) &&
                       moveRange >= 0 && moveRange <= 15,
                       "moveRange has to be a number greater equals zero and "+
                       "lower equals fithteen");
            this.moveRange = moveRange;

            // cost
            assert.ok( check.isNumber(cost) && cost >= 1 ,
                       "cost has to be a number greater equals one");
            this.cost = cost;

            // movetype
            assert.ok( check.isString( moveType ),
                       "unknown move type "+moveType );
            this.moveType = moveType;

            // weapons
            this.weapons = [];
            if( !check.isUndefined( weapons ) ){
                
                assert.ok( check.isArrayOf( weapons , String),
                           "weapons needs to be an string array");
                this.weapons = weapons;
            }

            // tags
            if( !check.isUndefined( tags ) ){
                assert.ok( check.isArrayOf( tags , String ),
                           "tags has to be an array of Strings" );
                this.tags = tags;
            }
            else{
                this.tags = [];
            }


            /* SEAL AND REGISTER SHEET */
            
            Object.freeze( this );
            units[ ID ] = this;
        },

        canAttack : function( target ){
            if( target instanceof UnitSheet ){
                
            }
            else{
                throw "TypeError";
            }
        },
        
        canCapture : function(){return this.capturePoints != 0;}
    });

    
    var TileSheet = neko.Class({
        
        constructor : function( jsonObj ){
            
            /* GET DATA FROM JSON OBJECT */

            var ID = jsonObj.ID;
            var capturePoints = jsonObj.capturePoints;


            /* CHECK PROPERTIES AND INJECT THEM */
            
            // ID check
            assert.ok( check.isString( ID ) && check.notEmpty( ID ),
                       "Invalid UnitSheet ID");
            assert.ok( !tiles.hasOwnProperty( ID ),
                       "ID "+ID+" already exists" );

            // capture points
            this.capturePoints = 0;
            if( !check.isUndefined(capturePoints) ){
                
                assert.ok( check.isNumber(capturePoints) &&
                           capturePoints > 0 && capturePoints <= 1000,
                           "captureRate has to be a number greater zero and "+
                           "lower equals 1000");
                this.capturePoints = capturePoints;
            }


            /* SEAL AND REGISTER SHEET */
            
            Object.freeze( this );
            tiles[ ID ] = this;
        }
    });


    var WeaponSheet = neko.Class({
        
        constructor : function( jsonObj ){

            /* GET DATA FROM JSON OBJECT */

            var ID = jsonObj.ID;
            var damageMap = jsonObj.damageMap;
            var usesAmmo = jsonObj.usesAmmo;
            var fireType = jsonObj.fireType;

            /* CHECK PROPERTIES AND INJECT THEM */

            // ID check
            assert.ok( check.isString( ID ) && check.notEmpty( ID ),
                       "Invalid WeaponSheet ID");
            assert.ok( !weapons.hasOwnProperty( ID ),
                       "ID "+ID+" already exists" );

            // fire type
            assert.ok( check.isString(fireType) && 
                      (fireType === fire_INDIRECT || fireType === fire_DIRECT),
                       "fireType has to be DIRECT or INDIRECT");
            this.fireType = fireType;

            // uses ammo
            assert.ok( check.isNumber(usesAmmo) && usesAmmo >= 0 ,
                       "usesAmmo has to be a number greater equals zero");
            this.usesAmmo = usesAmmo;

            // damage map 
            assert.ok( !check.isUndefined(damageMap),
                       "move sheet needs property moveMap as object with key "+
                       "and value pairs {UNIT_ID,DAMAGE}");
            var val;
            for( var el in damageMap ){
                if( damageMap.hasOwnProperty(el) ){
                    val = damageMap[el];
                    assert.ok( check.isNumber(val) && val > 0 &&
                               units.hasOwnProperty( el ) ,
                               "a moveMap entry has to be {UNIT_ID,DAMAGE} "+
                               "with existing UNIT_ID and DAMAGE > 0");
                }
            }
            this.damageMap = damageMap;


            /* SEAL AND REGISTER SHEET */

            Object.freeze( damageMap );
            Object.freeze( this );
            weapons[ ID ] = this;
        }
    });


    var MoveSheet = neko.Class({

        constructor : function( jsonObj ){

            /* GET DATA FROM JSON OBJECT */

            var ID = jsonObj.ID;
            var moveMap = jsonObj.moveMap;


            /* CHECK PROPERTIES AND INJECT THEM */

            // ID check
            assert.ok( check.isString( ID ) && check.notEmpty( ID ),
                       "Invalid MoveTypeSheet ID");
            assert.ok( !moveTypes.hasOwnProperty( ID ),
                       "ID "+ID+" already exists" );

            // move map
            assert.ok( !check.isUndefined(moveMap),
                       "move sheet needs property moveMap as object with key "+
                       "and value pairs {TILE_ID,MOVECOST}");
            var val;
            for( var el in moveMap ){
                if( moveMap.hasOwnProperty(el) ){
                    val = moveMap[el];
                    assert.ok( check.isNumber(val) && val > 0 &&
                               tiles.hasOwnProperty( el ) ,
                               "a moveMap entry has to be {TILE_ID,MOVECOST} "+
                               "with existing TILE_ID and MOVECOST > 0");
                }
            }
            this.moveMap = moveMap;


            /* SEAL AND REGISTER SHEET */

            Object.freeze( moveMap );
            Object.freeze( this );
            moveTypes[ ID ] = this;
        }

    });


    var WeatherSheet = neko.Class({

        constructor : function( jsonObj ){

            /* GET DATA FROM JSON OBJECT */
            var ID = jsonObj.ID;
            var chance = jsonObj.chance;


            /* CHECK PROPERTIES AND INJECT THEM */

            // ID check
            assert.ok( check.isString( ID ) && check.notEmpty( ID ),
                       "Invalid WeatherSheet ID");
            assert.ok( !weathers.hasOwnProperty( ID ),
                       "ID "+ID+" already exists" );

            // chance
            assert.ok( check.isNumber(chance) && chance > 0,
                       "moveRange has to be a number greater zero" );
            this.chance = chance;
            

            /* SEAL AND REGISTER SHEET */

            Object.freeze( this );
            weathers[ ID ] = this;
        }
    });

    /* LOAD COMPLETE PATH INTO DATABASE */
    

    
    // return module API
    return {

        VERSION : 0.8, // REFACTOR PARSING ERROR MESSAGES

        // returns single sheets
        unit        : function( ID ){ return units[ID]; },
        tile        : function( ID ){ return tiles[ID]; },
        moveType    : function( ID ){ return moveTypes[ID]; },
        weapon      : function( ID ){ return weapons[ID]; },
        weather     : function( ID ){ return weathers[ID]; },

        // fire types
        DIRECT : fire_DIRECT,
        INDIRECT : fire_INDIRECT
    }
});