"brackets-xunit: qunit";

module( "game actions" , { setup:loadTestMap } );

// USER ACTIONS

test( "wait", function(){
  simpleUnitAction( 2,2,2,2, "WTUN" );
  unitByPosCannotAct( 2,2 );
});

test( "attack without counter", function(){
  var att = model.unitPosMap[4][8];
  var def = model.unitPosMap[8][8];
    
  var defoldHp = def.hp;
  var attoldHp = att.hp;
  
  simpleUnitAction( 4,8,7,8, "ATUN", model.PRIMARY_WEAPON_TAG, 8,8 );
  
  unitByPosCannotAct( 7,8 );
  lt( def.hp, defoldHp, "defender should took damage" );
  is( att.hp, attoldHp, "attacker should not took any damage because defender died" );
  
  isNull( model.unitPosMap[8][8], "defender died in battle, so the cell must be free");
  notNull( model.unitPosMap[7][8], "attacker not died in battle, so the cell cannot be free");
});

test( "attack with counter attack", function(){
  var att = model.unitPosMap[4][8];
  var def = model.unitPosMap[8][8];
  def.hp = 99;
  
  var defoldHp = def.hp;
  var attoldHp = att.hp;
  
  simpleUnitAction( 4,8,7,8, "ATUN", model.PRIMARY_WEAPON_TAG, 8,8 );
  
  unitByPosCannotAct( 7,8 );
  lt( def.hp, defoldHp, "defender should took damage" );
  notNull( model.unitPosMap[8][8], "defender not died in battle, so the cell cannot be free");
  
  lt( att.hp, attoldHp, "attacker should took damage because defender survived" );
  notNull( model.unitPosMap[7][8], "attacker not died in battle, so the cell cannot be free");
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
