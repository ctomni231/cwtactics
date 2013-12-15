//
//
model.event_on( "explode_check",function(  uid ){
  if( !model.bombs_isSuicideUnit( uid ) ) return false;
});

(function(){

  function explDam( x,y, damage ){
    var unit = model.unit_posData[x][y];
    if( unit ) model.events.damageUnit(model.unit_extractId(unit),damage,9);
  }

  //
  //
  model.event_on( "explode_invoked",function( tx, ty, range, damage, owner ){
    model.map_doInRange(tx, ty, range, explDam, damage);
  });

})();
