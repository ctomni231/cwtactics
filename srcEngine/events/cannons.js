
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
  model.events.damageUnit(
    model.unit_extractId(target),
    model.unit_convertPointsToHealth(type.cannon.damage),
    9
  );
});

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
          model.events.property_createProperty( prop.owner, x, y, "PROP_INV" );
        }

        // place actor
        if( x === ax && y === ay ){
          if( DEBUG ) util.log("creating cannon unit at",x,",",y);
          model.events.createUnit( model.unit_getFreeSlot(prop.owner),prop.owner,
                                   x, y, "CANNON_UNIT_INV" );
        }

      }
    }
  }

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
            model.events.createUnit( model.unit_getFreeSlot(prop.owner),prop.owner,
                                     x, y, "CANNON_UNIT_INV" );
          }
            else if(prop.type.laser){
              if( DEBUG ) util.log("creating laser unit at",x,",",y);
              model.events.createUnit( model.unit_getFreeSlot(prop.owner),prop.owner,
                                       x, y, "LASER_UNIT_INV" );
            }

        }
      }
    }
  });

})();

