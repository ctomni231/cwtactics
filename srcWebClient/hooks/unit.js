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

model.clearUnitPosition.listenCommand(function( uid ){
  var unit = model.units[uid];
  var x = -unit.x;
  var y = -unit.y;
  
  // CHECK HIDDEN, BUT VISIBLE NEIGHBOURS
  if( model.isValidPosition(x-1,y) && model.unitPosMap[x-1][y] ) controller.updateUnitStatus( model.extractUnitId(model.unitPosMap[x-1][y]) );
  if( model.isValidPosition(x+1,y) && model.unitPosMap[x+1][y] ) controller.updateUnitStatus( model.extractUnitId(model.unitPosMap[x+1][y]) );
  if( model.isValidPosition(x,y+1) && model.unitPosMap[x][y+1] ) controller.updateUnitStatus( model.extractUnitId(model.unitPosMap[x][y+1]) );
  if( model.isValidPosition(x,y-1) && model.unitPosMap[x][y-1] ) controller.updateUnitStatus( model.extractUnitId(model.unitPosMap[x][y-1]) );
});

model.setUnitPosition.listenCommand(function( uid ){
  controller.updateUnitStatus( uid );
});

model.hideUnit.listenCommand(function( uid ){
  controller.updateUnitStatus( uid );
});

model.unhideUnit.listenCommand(function( uid ){
  controller.updateUnitStatus( uid );
});