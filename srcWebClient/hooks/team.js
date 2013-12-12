model.event_on("team_transferMoney",function(){
  controller.renderPlayerInfo();
});

model.event_on("team_transferUnit",function( suid ){
  var unit = model.unit_data[suid];
  var x = -unit.x;
  var y = -unit.y;
  
  // CHECK NEW UNIT
  controller.updateUnitStatus( model.unit_extractId( model.unit_posData[x][y] ) );
});