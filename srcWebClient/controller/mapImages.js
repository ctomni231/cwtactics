// Map of used map images.
//
view.mapImages = util.matrix( MAX_MAP_WIDTH, MAX_MAP_HEIGHT, null );

util.scoped(function(){
  
  function checkTileForConnection( x,y, index, data, cKeys ){
    if( x < 0 || y < 0 ||
       x >= model.map_width || y >= model.map_height ){
      
      //data[index] = "_";
      data[index] = "";
      return;
    }
    
    var short = cKeys[ model.map_data[x][y].ID ];
    if( short === undefined ) short = "";
    data[index] = short;
  };
  
  function getTileTypeForConnection( data, check, cross, type ){
    for( var i=0,e=data.length; i<e; i++ ){
      var toCheck = data[i];
      
      // CROSS
      if( toCheck[1] !== "" && toCheck[1] !== check[0] ) continue;
      if( toCheck[2] !== "" && toCheck[2] !== check[1] ) continue;
      if( toCheck[3] !== "" && toCheck[3] !== check[2] ) continue;
      if( toCheck[4] !== "" && toCheck[4] !== check[3] ) continue;
      
      // EDGES
      if( !cross ){
        if( toCheck[5] !== "" && toCheck[5] !== check[4] ) continue;
        if( toCheck[6] !== "" && toCheck[6] !== check[5] ) continue;
        if( toCheck[7] !== "" && toCheck[7] !== check[6] ) continue;
        if( toCheck[8] !== "" && toCheck[8] !== check[7] ) continue;
      }
      
      return toCheck[0];
    }
    
    return type;
  };
  
  // Updates all of the map images. If a tile has variants, then all surrounding
  // tiles will be checked to grab the best fitting tile variant.
  //
  view.updateMapImages = function(){
    var x;
    var y;
    var xe = model.map_width;
    var ye = model.map_height;
    var check = checkTileForConnection;
    var resultCheck = getTileTypeForConnection;
    var sdata = [];
    
    for( x=0 ;x<xe; x++ ){
      for( y=0 ;y<ye; y++ ){
        
        var lX = x;
        var lY = y;
        var tile = model.map_data[lX][lY].ID;
        var data = model.data_tileSheets[tile].assets.gfx_variants;

        if( !data ){
          view.mapImages[lX][lY] = tile;
        }
        else{
          
          var cKeys = data[0];
          if( data[1][0].length === 5 ){
            
            // ----------------------------
            check( x,y-1, 0, sdata, cKeys );
            check( x+1,y, 1, sdata, cKeys );
            check( x,y+1, 2, sdata, cKeys );
            check( x-1,y, 3, sdata, cKeys );
            
            view.mapImages[x][y] = resultCheck(
              data[1],
              sdata,
              true,
              tile
            );
          }
          else{
            
            // ----------------------------
            check( x  ,y-1, 0, sdata, cKeys );
            check( x+1,y-1, 1, sdata, cKeys );
            check( x+1,y  , 2, sdata, cKeys );
            check( x+1,y+1, 3, sdata, cKeys );
            check( x  ,y+1, 4, sdata, cKeys );
            check( x-1,y+1, 5, sdata, cKeys );
            check( x-1,y  , 6, sdata, cKeys );
            check( x-1,y-1, 7, sdata, cKeys );
            
            view.mapImages[x][y] = resultCheck(
              data[1],
              sdata,
              false,
              tile
            );
          }
        }
      }
    }
  };
  
});