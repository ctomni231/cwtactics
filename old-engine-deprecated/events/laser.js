//
//
model.event_on("fireLaser_check", function( uid ){
  if(!model.bombs_isLaser(uid) ) return false;
});

// Fires a laser at a given position.
//
model.event_on("fireLaser_invoked", function( x,y ){
  var prop = model.property_posMap[x][y];
  assert(prop);

  var ox   = x;
  var oy   = y;
  var pid  = prop.owner;

  // check all tiles on the map
  for( x=0,xe=model.map_width; x<xe; x++ ){
    for( y=0,ye=model.map_height; y<ye; y++ ){

      // every tile on the cross ( same y or x coordinate ) will be damaged
      if( ox === x || oy === y ){

        var unit = model.unit_posData[x][y];
        if( unit && unit.owner !== pid ){
          model.events.damageUnit(
            model.unit_extractId(unit),
            model.unit_convertPointsToHealth(prop.type.laser.damage),
            9
          );
        }
      }

    }
  }

});
