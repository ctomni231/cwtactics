model.fogData = util.matrix( CWT_MAX_MAP_WIDTH, CWT_MAX_MAP_HEIGHT, 0 );

model.resetFogData = function( value ){
  if( arguments.length === 0 ) value = 0;
  var x = 0;
  var xe = model.mapWidth;
  var y;
  var ye = model.mapHeight;

  for( ;x<xe; x++ ){
    for( y=0 ;y<ye; y++ ){
      model.fogData[x][y] = value;
    }
  }
};

model.fogOn = true;

model.generateFogMap = function( pid ){
  if( model.fogOn === false ){
    model.resetFogData(1);
    return;
  }

  var addV = model.setVisioner;
  var x = 0;
  var xe = model.mapWidth;
  var y;
  var ye = model.mapHeight;
  var tid = model.players[pid].team;

  model.resetFogData();

  for( ;x<xe; x++ ){
    for( y=0 ;y<ye; y++ ){

      // ---------------------------------------------------------------

      var unit = model.unitPosMap[x][y];
      if( unit !== null ){
        var sid = unit.owner;
        if( pid === sid || model.players[sid].team === tid ){
          var vision = model.sheets.unitSheets[unit.type].vision;
          addV( x,y, vision );
        }
      }

      // ---------------------------------------------------------------

      var property = model.propertyPosMap[x][y];
      if( property !== null ){
        var sid = property.owner;
        if( pid === sid || model.players[sid].team === tid ){
          var vision = model.sheets.tileSheets[property.type].vision;
          addV( x,y, vision );
        }
      }

      // ---------------------------------------------------------------

    }
  }
};

model.setVisioner = function( x,y, range ){
  if( model.fogOn === false ){
    return;
  }

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

      model.fogData[lX][lY]++;
    }
  }
};

model.removeVisioner = function( x,y, range ){
  if( model.fogOn === false ){
    return;
  }

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
      model.fogData[lX][lY]--;
    }
  }
};