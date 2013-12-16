model.event_on("damageUnit",function( uid ){
  controller.updateUnitStatus( uid );
});

model.event_on("healUnit",function( uid ){
  controller.updateUnitStatus( uid );
});

/*
model.event_on("battle_mainAttack",function( auid,duid,dmg,mainWeap ){
  var type = model.unit_data[auid].type;
  var sound = (mainWeap)? type.assets.pri_att_sound : type.assets.sec_att_sound;
  if( sound ) controller.audio_playSound( sound );
});

model.event_on("battle_counterAttack",function( auid,duid,dmg,mainWeap ){
  var type = model.unit_data[auid].type;
  var sound = (mainWeap)? type.assets.pri_att_sound : type.assets.sec_att_sound;
  if( sound ) controller.audio_playSound( sound );
});
*/

model.event_on("attack_invoked",function( auid,duid ){
  controller.updateSimpleTileInformation();
  controller.updateUnitStatus( auid );
  controller.updateUnitStatus( duid );
});

model.event_on("buildUnit_invoked",function(){
  controller.updateSimpleTileInformation();
});


model.event_on("createUnit",function( id ){
  controller.updateUnitStatus( id );
});

model.event_on("loadUnit_invoked",function( uid, tid ){
  controller.updateUnitStatus( tid );
});

model.event_on("unloadUnit_invoked",function( transportId, trsx, trsy, loadId, tx,ty ){
  controller.updateUnitStatus( transportId );
});

model.event_on("joinUnits_invoked",function( uid, tid ){
  controller.updateUnitStatus( tid );
});

model.event_on("supply_refillResources",function( uid ){
  if( typeof uid.x === "number" ) uid = model.unit_extractId(uid);
  controller.updateUnitStatus( uid );
});

model.event_on("clearUnitPosition",function( uid ){
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

model.event_on("setUnitPosition",function( uid ){
  controller.updateUnitStatus( uid );
});

model.event_on("unitHide_invoked",function( uid ){
  controller.updateUnitStatus( uid );
});

model.event_on("unitUnhide_invoked",function( uid ){
  controller.updateUnitStatus( uid );
});
