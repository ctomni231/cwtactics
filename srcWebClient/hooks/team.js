model.event_on("transferMoney_invoked",function(){
  controller.updateSimpleTileInformation();
});

model.event_on("transferUnit_invoked",function( suid ){
  var unit = model.unit_data[suid];
  var x = -unit.x;
  var y = -unit.y;

  // CHECK NEW UNIT
  controller.updateUnitStatus( model.unit_extractId( model.unit_posData[x][y] ) );
});
