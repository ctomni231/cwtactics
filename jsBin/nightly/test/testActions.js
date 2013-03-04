module( "game actions" , { setup:loadTestMap } );

// USER ACTIONS

test( "wait", function(){
  simpleUnitAction( 2,2,2,2, "WTUN" );
  unitByPosCannotAct( 2,2 );
});