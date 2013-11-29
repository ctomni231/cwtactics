controller.event_on("unit_inflictDamage",function( uid ){
  controller.updateUnitStatus( uid );
});

controller.event_on("unit_heal",function( uid ){
  controller.updateUnitStatus( uid );
});

controller.event_on("battle_mainAttack",function( auid,duid,dmg,mainWeap ){
  var type = model.data_unitSheets[ model.unit_data[auid].type ];
  controller.audio_playSound( (mainWeap)? type.assets.pri_att_sound : type.assets.sec_att_sound );
});

controller.event_on("battle_counterAttack",function( auid,duid,dmg,mainWeap ){
  var type = model.data_unitSheets[ model.unit_data[auid].type ];
  controller.audio_playSound( (mainWeap)? type.assets.pri_att_sound : type.assets.sec_att_sound );
});

controller.event_on("battle_invokeBattle",function( auid,duid ){
  controller.updateSimpleTileInformation();
  controller.updateUnitStatus( auid );
  controller.updateUnitStatus( duid );
});

controller.event_on("factory_produceUnit",function(){
  controller.updateSimpleTileInformation();
});

controller.event_on("transport_loadInto",function( uid, tid ){
  controller.updateUnitStatus( tid );
});

controller.event_on("transport_unloadFrom",function( transportId, trsx, trsy, loadId, tx,ty ){
  controller.updateUnitStatus( transportId );
});

controller.event_on("unit_join",function( uid, tid ){
  controller.updateUnitStatus( tid );
});

controller.event_on("supply_refillResources",function( uid ){
  if( typeof uid.x === "number" ) uid = model.unit_extractId(uid);
  controller.updateUnitStatus( uid );
});

controller.event_on("move_clearUnitPosition",function( uid ){
  var unit = model.unit_data[uid];
  var x = -unit.x;
  var y = -unit.y;
  
  // CHECK HIDDEN, BUT VISIBLE NEIGHBOURS
  if( model.map_isValidPosition(x-1,y) && model.unit_posData[x-1][y] ){
    controller.updateUnitStatus( model.unit_extractId(model.unit_posData[x-1][y]) );
  }
  if( model.map_isValidPosition(x+1,y) && model.unit_posData[x+1][y] ){
    controller.updateUnitStatus( model.unit_extractId(model.unit_posData[x+1][y]) );
  }
  if( model.map_isValidPosition(x,y+1) && model.unit_posData[x][y+1] ){
    controller.updateUnitStatus( model.unit_extractId(model.unit_posData[x][y+1]) );
  }
  if( model.map_isValidPosition(x,y-1) && model.unit_posData[x][y-1] ){
    controller.updateUnitStatus( model.unit_extractId(model.unit_posData[x][y-1]) );
  }
});

controller.event_on("move_setUnitPosition",function( uid ){
  controller.updateUnitStatus( uid );
});

controller.event_on("unit_hide",function( uid ){
  controller.updateUnitStatus( uid );
});

controller.event_on("unit_unhide",function( uid ){
  controller.updateUnitStatus( uid );
});