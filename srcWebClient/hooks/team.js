controller.onEvent("transferMoney",function(){
  controller.renderPlayerInfo();
});

controller.onEvent("transferUnit",function( suid ){
  var unit = model.units[suid];
  var x = -unit.x;
  var y = -unit.y;
  
  // CHECK NEW UNIT
  controller.updateUnitStatus( model.extractUnitId( model.unitPosMap[x][y] ) );
});