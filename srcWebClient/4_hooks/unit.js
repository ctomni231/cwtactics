controller.onEvent("damageUnit",function( uid ){
  controller.updateUnitStatus( uid );
});

controller.onEvent("healUnit",function( uid ){
  controller.updateUnitStatus( uid );
});

controller.onEvent("battleBetween",function( auid,duid ){
  controller.renderPlayerInfo();
  controller.updateUnitStatus( auid );
  controller.updateUnitStatus( duid );
});

controller.onEvent("buildUnit",function(){
  controller.renderPlayerInfo();
});

controller.onEvent("loadUnitInto",function( uid, tid ){
  controller.updateUnitStatus( tid );
});

controller.onEvent("unloadUnitFrom",function( transportId, trsx, trsy, loadId, tx,ty ){
  controller.updateUnitStatus( transportId );
});

controller.onEvent("joinUnits",function( uid, tid ){
  controller.updateUnitStatus( tid );
});

controller.onEvent("refillResources",function( uid ){
  if( typeof uid.x === "number" ) uid = model.extractUnitId(uid);
  controller.updateUnitStatus( uid );
});

controller.onEvent("clearUnitPosition",function( uid ){
  var unit = model.units[uid];
  var x = -unit.x;
  var y = -unit.y;
  
  // CHECK HIDDEN, BUT VISIBLE NEIGHBOURS
  if( model.isValidPosition(x-1,y) && model.unitPosMap[x-1][y] ) controller.updateUnitStatus( model.extractUnitId(model.unitPosMap[x-1][y]) );
  if( model.isValidPosition(x+1,y) && model.unitPosMap[x+1][y] ) controller.updateUnitStatus( model.extractUnitId(model.unitPosMap[x+1][y]) );
  if( model.isValidPosition(x,y+1) && model.unitPosMap[x][y+1] ) controller.updateUnitStatus( model.extractUnitId(model.unitPosMap[x][y+1]) );
  if( model.isValidPosition(x,y-1) && model.unitPosMap[x][y-1] ) controller.updateUnitStatus( model.extractUnitId(model.unitPosMap[x][y-1]) );
});

controller.onEvent("setUnitPosition",function( uid ){
  controller.updateUnitStatus( uid );
});

controller.onEvent("hideUnit",function( uid ){
  controller.updateUnitStatus( uid );
});

controller.onEvent("unhideUnit",function( uid ){
  controller.updateUnitStatus( uid );
});