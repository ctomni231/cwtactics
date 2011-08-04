neko.define( "model/object", ["data/database"], function( db ){

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

    // module API
    return{

    }
});