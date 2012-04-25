commandNode( Msg.MOVE ,
  function( msg ){
    var unit = map.units[ msg.uId ];
    var sX = msg.x;
    var sY = msg.y;
    var way = msg.way;


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