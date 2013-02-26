view.registerCommandHook({

  key: "RVIS",

  prepare: function( x,y, range ){
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
      }
    }
  },

  render: function(){},
  update: function(){},

  isDone: function(){
    return true;
  }

});