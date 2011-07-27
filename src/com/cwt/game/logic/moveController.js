(function(){

    var moveWay = new Array(15);
    var pointer = 0;
    var leftPoints = 0;
    var mover = null;

    var i,e;
    for( i=0, e=15; i<e; i++ ){
        moveWay[i] = null;
    }

    $cwt("move", {

        pushTile : function( tile ){
            
            var r = $cwt("map").isNeighbourOf( tile, moveWay[pointer], 1 );
            


            if( r === true ){
                // direct push
            }
            else{
                // generate way between them, or complete new way
            }
        }
    });
})();