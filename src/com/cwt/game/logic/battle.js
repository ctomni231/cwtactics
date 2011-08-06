neko.define("logic/battle", ["assert","model/object"], function(assert,objects){

    var attackAble = [];
    var lenght = 0;
    var focusPos = 0;
    var Unit = objects.Unit;

    function genTargets( unit ){

        assert.ok( unit instanceof Unit,
                   "battle controller, argument must be an unit" );

        //
        
    }

    // module API
    return{

        battle : null,

        generateAllTargets : null
    }
});