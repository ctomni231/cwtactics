model.event_on("modifyVisionAt", function( x,y, pid, range, value ){
    range = 10; // TAKE THE MAXIMUM RANGE

    var lX;
    var hX;
    var lY = y-range;
    var hY = y+range;
    if( lY < 0 ) lY = 0;
    if( hY >= model.map_height ) hY = model.map_height-1;
    for( ; lY<=hY; lY++ ){

      var disY = Math.abs( lY-y );
      lX = x-range+disY;
      hX = x+range-disY;
      if( lX < 0 ) lX = 0;
      if( hX >= model.map_width ) hX = model.map_width-1;
      for( ; lX<=hX; lX++ ){
        view.redraw_markPos( lX,lY );

        var unit = model.unit_posData[lX][lY];
        if( unit !== null && unit.hidden ){
          controller.updateUnitStatus( model.unit_extractId( unit ) );
        }
      }
    }
});

model.event_on("recalculateFogMap",function(range){
  view.redraw_markAll();
});
