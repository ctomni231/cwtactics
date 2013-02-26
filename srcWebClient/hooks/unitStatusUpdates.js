view.registerCommandListener("ATUN",function( aid, admg, aUseAmmo, did ){
  controller.updateUnitStatus( aid );
  controller.updateUnitStatus( did );
});

view.registerCommandListener("CTPR",function( cid ){
  controller.updateUnitStatus( cid );
});

view.registerCommandListener("CRUN",function( x,y ){
  controller.updateUnitStatus( model.extractUnitId( model.unitPosMap[x][y] ) );
});

view.registerCommandListener("DMUN",function( uid ){
  controller.updateUnitStatus( uid );
});

view.registerCommandListener("HEUN",function( uid ){
  controller.updateUnitStatus( uid );
});

view.registerCommandListener("GUTP",function( uid ){
  var old = model.units[uid];
  controller.updateUnitStatus( model.extractUnitId( model.unitPosMap[ old.x ][ old.y ]  ));
});

view.registerCommandListener("LODU",function( uid, tid ){
  controller.updateUnitStatus( tid );
});

view.registerCommandListener("JNUN",function( sid, tid ){
  controller.updateUnitStatus( tid );
});

view.registerCommandListener("MOVE",function( way, uid, x,y ){
  controller.updateUnitStatus( uid );
});

(function(){
  function dmgF( x,y ){
    if( model.isValidPosition(x,y) ){
      var unit = model.unitPosMap[x][y];
      if( unit !== null ){
        controller.updateUnitStatus( model.extractUnitId(unit) );
      }
    }
  }
  
  view.registerCommandListener("SLFR",function( uid, sx,sy, prid, tx,ty ){
    var x = tx;
    var y = ty;
    
    dmgF( x  ,y-2 );
    dmgF( x-1,y-1 );
    dmgF( x  ,y-1 );
    dmgF( x+1,y-1 );
    dmgF( x-2,y   );
    dmgF( x-1,y   );
    dmgF( x  ,y   );
    dmgF( x+1,y   );
    dmgF( x+2,y   );
    dmgF( x-1,y+1 );
    dmgF( x  ,y+1 );
    dmgF( x+1,y+1 );
    dmgF( x  ,y+2 );
  });
  
  view.registerCommandListener("SPPL",function( sid, x,y ){
    dmgF( x,y-1   );
    dmgF( x-1,y   );
    dmgF( x  ,y   );
    dmgF( x+1,y   );
    dmgF( x,y+1   );
  });
})();

view.registerCommandListener("UNUN",function( transportId, trsx, trsy, loadId, tx,ty ){
  controller.updateUnitStatus( transportId );
});

view.registerCommandListener("LDGM",function(){
  for( var i=0,e=model.units.length; i<e; i++ ){
    if( model.units[i].owner !== CWT_INACTIVE_ID ){
      controller.updateUnitStatus( i );
    }
  }
});

view.registerCommandListener("AVIS",function( x,y,range ){
  view.markForRedrawRange(x,y,range);
});

view.registerCommandListener("RVIS",function( x,y,range ){
  view.markForRedrawRange(x,y,range);
});
