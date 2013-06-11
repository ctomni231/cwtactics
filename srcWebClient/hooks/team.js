model.transferMoney.listenCommand(function(){
  controller.renderPlayerInfo();
});

model.transferUnit.listenCommand(function( suid ){
  var unit = model.units[suid];
  var x = -unit.x;
  var y = -unit.y;
  
  // CHECK NEW UNIT
  controller.updateUnitStatus( model.extractUnitId( model.unitPosMap[x][y] ) );
});