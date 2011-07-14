(function(){

    var Unit = meowEngine.Class({

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

})();