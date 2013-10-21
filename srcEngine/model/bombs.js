// # Bomb Module 
//

// ### Meta Data

controller.registerInvokableCommand("doExplosionAt");
controller.registerInvokableCommand("fireSilo");
controller.registerInvokableCommand("siloRegeneratesIn");
controller.registerInvokableCommand("fireCannon");
controller.registerInvokableCommand("fireLaser");

controller.defineEvent("doExplosionAt");
controller.defineEvent("startFireSilo");
controller.defineEvent("fireCannon");
controller.defineEvent("fireLaser");

model.unitTypeParser.addHandler(function(sheet){
  if( util.expectObject(sheet, "suicide", false) === util.expectMode.DEFINED ){
    
    var sub = sheet.suicide;
    if( !util.expectNumber(sub, "damage", true, true, 1, 9) ) return false;
    if( !util.expectNumber(sub, "range", true, true, 1, MAX_SELECTION_RANGE) ) return false;
    
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
    controller.events.doExplosionAt(tx, ty, range, damage, owner);
  };
});

// fires a rocket to a given position (x,y) and inflicts damage
// to all units in a range around the position.
//
model.fireSilo = function( x,y, tx, ty, owner){
  var silo = model.propertyPosMap[x][y];
  var siloId = model.extractPropertyId(silo);
  var type = silo.type;
  var range = type.rocketsilo.range;
  var damage = model.ptToHp(type.rocketsilo.damage);
  
  // SET EMPTY TYPE
  model.changePropertyType(siloId, model.tileTypes[type.changeTo]);
  
  // Invoke event
  controller.events.startFireSilo( x,y, siloId, tx,ty, range, damage, owner );
  
  model.doExplosionAt(tx, ty, range, damage, owner);
  
  model.pushTimedEvent( 
    model.daysToTurns(turns), 
    controller.getInvokementArguments("changePropertyType",[siloId, type])
  );
  
  // Invoke change event
  controller.events.siloRegeneratesIn( siloId, turns, type );
};

// Returns true if a unit is a suicide unit. A suicide unit has the ability 
// to blow itself up with an impact.
//
// @param {Number} uref
//
model.isSuicideUnit = function( uref ){
  // if( typeof uref === "number" ) 
  return model.units[uref].type.suicide;
};

// Returns true if a property id is a rocket silo. A rocket silo has the ability 
// to fire a rocket to a position with an impact.
//
// @param {Number} prid
//
model.isRocketSilo = function( prid, _fuid ){
  var type = model.properties[prid].type;
  
  if( !type.rocketsilo ) return false;
  if( arguments.length === 2 ){
    var fuidType = model.units[_fuid].type.ID;
    if( type.rocketsilo.fireable.indexOf(fuidType) === -1 ) return false;
  }
  
  return true;
};

// 
//
// @param {Number} prid
// @param {Number} fuid
//
model.isSiloFirableBy = model.isRocketSilo;

model.isCannon = function( uid ){
  return model.units[uid].type.cannon;
};

model.tryToMarkCannonTargets = function( pid, selection, ox,oy, otx,oty, sx,sy, tx,ty, range ){
  var tid = model.players[pid].team;
  var osy = sy;
  var result = false;
  for( ; sx<=tx; sx++ ){ 
    for( sy=osy; sy>=ty; sy-- ){
      if( !model.isValidPosition(sx,sy) ) continue;
      
      // range maybe don't match
      if( (Math.abs(sx-ox) + Math.abs(sy-oy)) > range ) continue;
      if( (Math.abs(sx-otx) + Math.abs(sy-oty)) > range ) continue;
      
      // in fog
      if( model.fogData[sx][sy] <= 0) continue;
      
      var unit = model.unitPosMap[sx][sy];
      if( unit ){
        if( unit.owner !== pid && model.players[unit.owner].team !== tid ){
          selection.setValueAt( sx,sy, 1 ); 
          result = true;
        }
      }
    } 
  } 
  
  return result;
};

model.markCannonTargets = function( uid, selection ){
  var result;
  
  var unit = model.units[uid];
  var type = unit.type;
  
  // no cannon
  if( !type.cannon ) return false;
  
  selection.setCenter( unit.x, unit.y, 0 );
  
  var max = type.cannon.range;
  switch( type.cannon.direction ){
      
    case "N": 
      result = model.tryToMarkCannonTargets( 
        unit.owner, 
        selection, 
        unit.x, unit.y, 
        unit.x, unit.y-max-1, 
        unit.x-max+1, unit.y-1, 
        unit.x+max-1, unit.y-max, 
        max 
      ); 
      break;
      
    case "E": 
      result = model.tryToMarkCannonTargets( 
        unit.owner, 
        selection, 
        unit.x, unit.y, 
        unit.x+max+1, unit.y, 
        unit.x+1, unit.y+max-1, 
        unit.x+max, unit.y-max+1, 
        max 
      ); 
      break;
      
    case "W": 
      result = model.tryToMarkCannonTargets( 
        unit.owner, 
        selection, 
        unit.x, unit.y, 
        unit.x-max-1, unit.y, 
        unit.x-max, unit.y+max-1, 
        unit.x-1, unit.y-max+1, 
        max
      ); 
      break;
      
    case "S": 
      result = model.tryToMarkCannonTargets( 
        unit.owner, 
        selection, 
        unit.x, unit.y, 
        unit.x, unit.y+max+1, 
        unit.x-max+1, unit.y+max, 
        unit.x+max-1, unit.y+1, 
        max 
      ); 
      break;
  }
  
  return result;
};

model.fireCannon = function( uid, x,y ){
  var unit = model.units[uid];
  var target = model.unitPosMap[x][y];
  var type = unit.type;
  
  var target = model.unitPosMap[x][y];
  model.damageUnit( model.extractUnitId(target), model.ptToHp(type.cannon.damage), 9);
  
  // Invoke event
  controller.events.fireCannon( uid, x,y );
};

model.isLaser = function( prid ){
  return model.properties[prid].type.laser;
};

model.fireLaser = function( pid, ox,oy ){

  controller.events.fireCannon( pid, ox,oy );

  for( var x=0,xe=model.mapWidth; x<xe; x++ ){
    for( var y=0,ye=model.mapHeight; y<ye; y++ ){

      // must be on the cross
      if( ox === x ||
          oy === y ){

        var unit = model.unitPosMap[x][y];
        if( unit ){

          if( unit.owner !== pid ){
            model.damageUnit(
              model.extractUnitId(target),
              model.ptToHp(type.laser.damage),
              9
            );
          }
        }
      }

    }
  }
};
