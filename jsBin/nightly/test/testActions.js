module( "game actions" , { setup:loadTestMap } );

// USER ACTIONS

test( "wait", function(){
  simpleUnitAction( 2,2,2,2, "WTUN" );
  unitByPosCannotAct( 2,2 );
});

test( "attack", function(){
  var unit = model.unitPosMap[8][8];
  var oldHp = unit.hp;
  simpleUnitAction( 4,8,7,8, "ATUN", model.PRIMARY_WEAPON_TAG, 8,8 );
  
  unitByPosCannotAct( 7,8 );
  lt( unit.hp, oldHp, "defender should take damage" );
  
  if( unit.hp < 0 ){
    isNull( model.unitPosMap[8][8], "unit died in battle, so the cell must be free");
  }
});

test( "build Unit", function(){
  var unit = model.unitPosMap[2][4];
  isNull( unit, "factory tile is not occupied");
  
  var fowner = model.players[ model.propertyPosMap[2][4].owner ];
  var moneyOld = fowner.gold;
  
  simplePropertyAction( 2,4, "BDUN", "INFT" );
  
  unit = model.unitPosMap[2][4];
  notNull( unit, "factory tile is occupied after production");
  
  is( fowner.gold, moneyOld-model.sheets.unitSheets["INFT"].cost, "factory owners gold depot is lowered" );
});
