commandNode( Msg.GENERATE_MOVEWAY,
  function( msg ){

    var uid = msg.uid;
    var x = msg.x;
    var y = msg.y;

    var mv_sheet = sheets.moveTypes[ sheets.units[ map.units[ uid ]]];

    // back message
    messageContext.message( Msg.UNIT_MOVEMAP, {});
  },

  // validator
  {
    uId: map.unitIdValidator
  }
);