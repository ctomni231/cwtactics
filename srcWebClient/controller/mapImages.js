/**
 * Map of used map images.
 */
view.mapImages = util.matrix( constants.MAX_MAP_WIDTH, constants.MAX_MAP_HEIGHT, null );

util.scoped(function(){
  
  function checkTileForConnection( x,y, index, data, cKeys ){
    if( x < 0 || y < 0 ||
       x >= model.mapWidth || y >= model.mapWidth ){
      
      data[index] = "_";
      return;
    }
    
    var short = cKeys[ model.map[x][y].ID ];
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
  
  /**
   *
   */
  view.updateMapImages = function(){
    var x;
    var y;
    var xe = model.mapWidth;
    var ye = model.mapHeight;
    var check = checkTileForConnection;
    var resultCheck = getTileTypeForConnection;
    var sdata = [];
    
    for( x=0 ;x<xe; x++ ){
      for( y=0 ;y<ye; y++ ){
        
        var lX = x;
        var lY = y;
        
        // DO MAGIC HERE
        var tile = model.map[lX][lY].ID;
        if( model.graphics.connected[tile] ){
          
          var cKeys = model.graphics.connectedKeys[tile];
          if( model.graphics.connected[tile][0].length === 5 ){
            
            // ----------------------------
            check( x,y-1, 0, sdata, cKeys );
            check( x+1,y, 1, sdata, cKeys );
            check( x,y+1, 2, sdata, cKeys );
            check( x-1,y, 3, sdata, cKeys );
            
            view.mapImages[x][y] = resultCheck( 
              model.graphics.connected[tile], 
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
              model.graphics.connected[tile], 
              sdata,
              false,
              tile
            );
          }
        }
        else view.mapImages[lX][lY] = tile;
      }
    }
  };
  
});