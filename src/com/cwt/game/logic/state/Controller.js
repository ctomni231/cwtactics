(function(){

    var _UNIT_CLICKED;
    var _TILE_CLICKED;
    var _PROPERTY_CLICKED;

    cwt.act = {

    };

    meowEngine.StateMachine.create({
        initial : "idle",
        events : [

            // idle
            { name:"unitClicked", from:"idle", to:"menu" },
            { name:"factoryClicked", from:"idle", to:"menu" },

            // menu
            { name:"targetSelect", from:"menu", to:"selectTarget" },
            { name:"unitTypeSelect", from:"menu", to:"buildUnit" },


            // misc
            { name:"targetSelected", from:"selectTarget", to:"idle" },
            { name:"unitTypeSelected", from:"buildUnit", to:"idle" }
        ]
    });
})();