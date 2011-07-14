(function(){

    var _isIn = meowEngine.checks.hasAttribute;
    var _isTrue = meowEngine.assert.isTrue;
    var _parseNum = meowEngine.parseNumber;
    
    var units = {};
    var tiles = {};

    cwt.database = {
        units : units,
        tiles : tiles
    }

    var MapObjectType = meowEngine.Class({

        constructor : function( jsonObj ){
            
            this.ID = jsonObj.ID;

            this.vision       = _parseNum( jsonObj.vision, 0, 0, 15 );
        }
    });

    var UnitType = meowEngine.Class({
        
        constructor : function( jsonObj ){

            this.ID = jsonObj.ID;

            // check
            _isTrue( !_isIn( units, this.ID ), "unitSheet with ID "+this.ID+
                                               " already exists");

            this.maxAmmo      = _parseNum( jsonObj.maxAmmo, -1, -1, 99 );
            this.maxFuel      = _parseNum( jsonObj.maxFuel, 0, 0, 99 );
            this.weight       = _parseNum( jsonObj.weight, 1, 1, 1000 );
            this.captureRate  = _parseNum( jsonObj.captureRate, 0, 0, 100 );

            this.moveRange    = _parseNum( jsonObj.moveRange, 0, 0, 15 );
        }
    });

    var MoveType = meowEngine.Class({

        constructor : function( jsonObj ){

            this.ID = jsonObj.ID;
            this.moveMap = {};
        }
    });

    var TileSheet = meowEngine.Class({

        constructor : function( jsonObj ){

            this.ID = jsonObj.ID;

            this.vision = -1;
        }
    });

    var PropertySheet = meowEngine.Class( TileSheet, {

        constructor : function( jsonObj ){

            this.Super.constructor.call( jsonObj );

            this.capturePoints =
                _parseNum( jsonObj.capturePoints, 20, 5, 1000 );
            
            this.vision       = _parseNum( jsonObj.vision, 0, 0, 15 );
        }
    });

    var WeatherSheet = meowEngine.Class({

        constructor : function( jsonObj ){

            this.ID = jsonObj.ID;

            this.chance = _parseNum( jsonObj.chance, 1, 1, 1000 );
        }
    });

})();