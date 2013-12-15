(function(){

  function explDam( x,y, damage ){
    var unit = model.unit_posData[x][y];
    if( unit ) model.events.unit_inflictDamage(model.unit_extractId(unit), damage, 9);
  };

  //
  //
  model.event_on( "explode_invoked",function( tx, ty, range, damage, owner ){
    model.map_doInRange(tx, ty, range, explDam, damage);
  });

})();

(function(){

  function placeCannonMetaData( x,y ){
    var prop   = model.property_posMap[x][y];
    var cannon = prop.type.cannon;
    var size   = prop.type.bigProperty;

    assert( x - size.x >= 0 );
    assert( y - size.y >= 0 );

    var ax = x - size.actor[0];
    var ay = y - size.actor[1];
    var ox = x;
    var oy = y;
    for( var xe = x-size.x; x>xe; x-- ){

      y = oy;
      for( var ye = y-size.y; y>ye; y-- ){

        // place blocker
        if( x !== ox || y !== oy ){
          if( DEBUG ) util.log("creating invisible property at",x,",",y);
          model.property_createProperty( prop.owner, x, y, "PROP_INV" );
        }

        // place actor
        if( x === ax && y === ay ){
          if( DEBUG ) util.log("creating cannon unit at",x,",",y);
          model.unit_create( prop.owner, x, y, "CANNON_UNIT_INV" );
        }

      }
    }
  };

  // // Places the necessary meta units for bigger properties.
  //
  model.event_on( "gameround_start",function( ){
    for(var x=0,xe=model.map_width; x<xe; x++){
      for(var y=0,ye=model.map_height; y<ye; y++){

        var prop = model.property_posMap[x][y];
        if( prop ){

          if( prop.type.bigProperty && prop.type.cannon ){
            placeCannonMetaData( x,y );
          }
          else if(prop.type.cannon){
            if( DEBUG ) util.log("creating cannon unit at",x,",",y);
            model.unit_create( prop.owner, x, y, "CANNON_UNIT_INV" );
          }
            else if(prop.type.laser){
              if( DEBUG ) util.log("creating laser unit at",x,",",y);
              model.unit_create( prop.owner, x, y, "LASER_UNIT_INV" );
            }

        }
      }
    }
  });

})();

//
//
model.event_on( "explode_check",function(  uid ){
  if( !model.bombs_isSuicideUnit( data.source.unitId ) ) return false;
});

//
//
model.event_on( "silofire_check", function( prid,uid ){
  if( !model.bombs_canBeFiredBy( prid,uid ) ) return false;
});

//
//
model.event_on( "silofire_validPos", function( x,y ){
  if(!model.map_isValidPosition(x,y) ) return false;
});

// fires a rocket to a given position (x,y) and inflicts damage to all units in a range around
// the position.
//
model.event_on( "silofire_invoked", function( x,y, tx, ty, owner){
  var silo    = model.property_posMap[x][y];
  var siloId  = model.property_extractId(silo);
  var type    = silo.type;
  var range   = type.rocketsilo.range;
  var damage  = model.unit_convertPointsToHealth(type.rocketsilo.damage);

  // SET EMPTY TYPE
  model.property_changeType(siloId, model.data_tileSheets[type.changeTo]);

  // Invoke event
  model.events.bombs_startFireSilo( x,y, siloId, tx,ty, range, damage, owner );

  model.bombs_explosionAt(tx, ty, range, damage, owner);

  model.dayEvents_push(
    model.round_daysToTurns(5),
    controller.action_convertToInvokeDataArray("property_changeType",[siloId, type])
  );

  // Invoke change event
  model.events.bombs_siloRegeneratesIn( siloId, 5, type );
});

//
//
model.event_on("fireCannon_check", function( uid,selection ){
  return (
      model.bombs_isCannon( uid ) &&
      model.bombs_markCannonTargets( uid, selection )
    );
});

//
//
model.event_on("fireCannon_fillTargets", function( uid,selection ){
  model.bombs_markCannonTargets( uid, selection );
});

// Fires a cannon at a given position.
//
model.event_on("fireCannon_invoked", function( ox,oy, x,y ){
  var prop    = model.property_posMap[x][y];
  var target  = model.unit_posData[x][y];
  var type    = model.bombs_grabPropTypeFromPos(ox,oy);

  var target = model.unit_posData[x][y];
  model.unit_inflictDamage(
    model.unit_extractId(target),
    model.unit_convertPointsToHealth(type.cannon.damage),
    9
  );

  // Invoke event
  model.events.bombs_fireCannon( ox,oy,x,y, type.ID );
});

model.event_on("fireLaser_check", function( uid ){
  if(!model.bombs_isLaser( util ) ) return false;
});

// Fires a laser at a given position.
//
model.event_on("fireLaser_invoked", function( x,y ){
  var prop = model.property_posMap[x][y];
  assert(prop);

  var ox   = x;
  var oy   = y;
  var pid  = prop.owner;

  model.events.bombs_fireLaser( ox,oy,prop.type.ID );

  // check all tiles on the map
  for( var x=0,xe=model.map_width; x<xe; x++ ){
    for( var y=0,ye=model.map_height; y<ye; y++ ){

      // every tile on the cross ( same y or x coordinate ) will be damaged
      if( ox === x || oy === y ){

        var unit = model.unit_posData[x][y];
        if( unit && unit.owner !== pid ){
          model.unit_inflictDamage(
            model.unit_extractId(unit),
            model.unit_convertPointsToHealth(prop.type.laser.damage),
            9
          );
        }
      }

    }
  }

});
