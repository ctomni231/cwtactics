controller.registerInvokableCommand("doExplosionAt");
controller.registerInvokableCommand("fireSilo");

controller.defineEvent("doExplosionAt");
controller.defineEvent("startFireSilo");

util.scoped(function(){
  
  // inflicts damage to all units in a given range
  // at a given position (x,y)
  function doDamage( x,y, damage ){
    var unit = model.unitPosMap[x][y];
    
    // inflict damage 
    if( unit ) model.damageUnit( model.extractUnitId(unit),damage,9);
  }
  
  // fires a bomb at a given position (x,y) and inflicts damage
  // to all units in a range around the position.
  //
  model.doExplosionAt = function( tx,ty, range, damage, owner ){
    model.doInRange( tx,ty,range, doDamage, damage );
    
    // Invoke event
    var evCb = controller.events.doExplosionAt;
    if( evCb ) evCb( uid );
  };
});

// fires a rocket to a given position (x,y) and inflicts damage
// to all units in a range around the position.
//
model.fireSilo = function( siloId, tx,ty, range, damage, owner ){                          
  
  // SET EMPTY TYPE
  var type = model.properties[siloId].type;
  model.changePropertyType(siloId, model.tileTypes[type.changeTo] );
  
  // Invoke event
  var evCb = controller.events.startFireSilo;
  if( evCb ) evCb( uid );
  
  // TIMER
  model.pushTimedEvent( model.daysToTurns(5), model.changePropertyType.callToList( siloId, type.ID ) );
  
  model.doExplosionAt( tx,ty, range, damage, owner );
};