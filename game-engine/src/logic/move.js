commandNode( Msg.MOVE ,
  function( msg ){
    var unit = map.units[ msg.uid ];
    var x = msg.x;
    var y = msg.y;
    var lX = x;
    var lY = y;
    var way = msg.way;

    // clear old position
    delete map[x][y].unit;

    // check moveway
    for( var i=0,e=way.length; i<e; i++ ){

      // change current position
      var cmd = way[i];
      if( cmd === 0 ) y--;
      else if( cmd === 1 ) x++;
      else if( cmd === 2 ) y++;
      else x--;

      // if there is an unit in the way, break ( except own one )
      //TODO allies?
      if( typeof map[x][y].unit === 'number' && map.units[map[x][y].unit].owner !== unit.owner ) break;

      // update last tile
      lX = x;
      lY = y;
    }

    // set new position
    map[lX][lY].unit = msg.uid;
  },

  // validator
  {

  }
);

commandNode( Msg.GENERATE_MOVEWAY,
  function( msg ){

    messageContext.message( Msg.UNIT_MOVEMAP, {});
  },

  // validator
  {
    uId: map.unitIdValidator
  }
);