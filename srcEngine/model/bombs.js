// # Bomb Module 
//

// ### Meta Data

controller.registerInvokableCommand("doExplosionAt");
controller.registerInvokableCommand("fireSilo");
controller.registerInvokableCommand("siloRegeneratesIn");

controller.defineEvent("doExplosionAt");
controller.defineEvent("startFireSilo");

model.unitTypeParser.addHandler(function(sheet){
  if( util.expectObject(sheet, "suicide", false) === util.expectMode.DEFINED ){
    
    var sub = sheet.suicide;
    if( !util.expectNumber(sub, "damage", true, true, 1, 9) ) return false;
    if( !util.expectNumber(sub, "range", true, true, 1, constants.MAX_SELECTION_RANGE) ) return false;

    if( util.expectObject(sub, "nodamage", false) === util.expectMode.DEFINED ){
      
      var list = sub.nodamage;
      for( var i1 = 0, e1 = list.length; i1 < e1; i1++){
        if( !util.expectString(list, i1, true) ) return false;
      }
    }
  }
});

// ---

// ### Logic

util.scoped(function(){

  // inflicts damage to all units in a given range
  // at a given position (x,y)
  function doDamage(x, y, damage){
    var unit = model.unitPosMap[x][y];

    // inflict damage 
    if(unit)model.damageUnit(model.extractUnitId(unit), damage, 9);
  }

  // fires a bomb at a given position (x,y) and inflicts damage
  // to all units in a range around the position.
  //
  model.doExplosionAt = function(tx, ty, range, damage, owner){
    model.doInRange(tx, ty, range, doDamage, damage);

    // Invoke event
    controller.events.doExplosionAt(uid);
  };
});

// fires a rocket to a given position (x,y) and inflicts damage
// to all units in a range around the position.
//
model.fireSilo = function( x,y , tx, ty, range, damage, owner){
  var silo = model.propertyPosMap[x][y];
  var siloId = model.extractPropertyId(silo);
  
  // SET EMPTY TYPE
  var type = silo.type;
  model.changePropertyType(siloId, model.tileTypes[type.changeTo]);

  // Invoke event
  controller.events.startFireSilo( x,y, siloId, tx,ty, range, damage, owner );
  
  model.doExplosionAt(tx, ty, range, damage, owner);
  
  model.pushTimedEvent( 
    model.daysToTurns(turns), 
    controller.getInvokementArguments("changePropertyType",[siloId, type])
  );
    
  // Invoke change event
  var evCb = controller.events.siloRegeneratesIn;
  if(evCb)evCb( siloId, turns, type );
  
};