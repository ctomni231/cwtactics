model.damageUnit.listenCommand(function( uid ){
  controller.updateUnitStatus( uid );
});

model.healUnit.listenCommand(function( uid ){
  controller.updateUnitStatus( uid );
});

model.battleBetween.listenCommand(function( auid,duid ){
  controller.renderPlayerInfo();
  controller.updateUnitStatus( auid );
  controller.updateUnitStatus( duid );
});

model.buildUnit.listenCommand(function(){
  controller.renderPlayerInfo();
});

model.loadUnitInto.listenCommand(function( uid, tid ){
  controller.updateUnitStatus( tid );
});

model.unloadUnitFrom.listenCommand(function( transportId, trsx, trsy, loadId, tx,ty ){
  controller.updateUnitStatus( transportId );
});

model.joinUnits.listenCommand(function( uid, tid ){
  controller.updateUnitStatus( tid );
});

model.refillResources.listenCommand(function( uid ){
  if( typeof uid.x === "number" ) uid = model.extractUnitId(uid);
  controller.updateUnitStatus( uid );
});

model.setUnitPosition.listenCommand(function( uid ){
  controller.updateUnitStatus( uid );
});