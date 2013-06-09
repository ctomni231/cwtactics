model.modifyVisionAt.listenCommand(
function( x,y, pid, range, value ){
    range = 10; // TAKE THE MAXIMUM RANGE
  
    var lX;
    var hX;
    var lY = y-range;
    var hY = y+range;
    if( lY < 0 ) lY = 0;
    if( hY >= model.mapHeight ) hY = model.mapHeight-1;
    for( ; lY<=hY; lY++ ){

      var disY = Math.abs( lY-y );
      lX = x-range+disY;
      hX = x+range-disY;
      if( lX < 0 ) lX = 0;
      if( hX >= model.mapWidth ) hX = model.mapWidth-1;
      for( ; lX<=hX; lX++ ){
        view.markForRedraw( lX,lY );
        
        var unit = model.unitPosMap[lX][lY];
        if( unit !== null && unit.hidden ){
          controller.updateUnitStatus( model.extractUnitId( unit ) );
        }
      }
    }
});

model.recalculateFogMap.listenCommand(
function(range){
  view.completeRedraw();
});