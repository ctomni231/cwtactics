// ========================================================================
commandNode( Msg.END_TURN,

  function( msg ){

    // clear all old actors
    for( var i = 0; i<MAX_UNITS; i++ ) map.leftActors[i] = null;

    // search next player
    var old = map.currentPlayer;
    while( true ){

      // tick
      map.currentPlayer++;
      if( map.currentPlayer === map.players.length ) map.currentPlayer = 0;

      // if player alive then break iteration ==> found next player
      if( map.players[ map.currentPlayer ].team !== -1 ) break;

      // illegal state
      if( map.currentPlayer === old ) throw Error('new player is old player');
    }

    // new day
    if( map.currentPlayer < old ) messageContext.message({ cmd: Msg.NEXT_DAY, day: map.currentDay, local:true });

    // put new actors
    var nPlayer = map.players[map.currentPlayer];
    for( var i=0,e=nPlayer.units.length; i<e; i++ ) map.leftActors[i] = nPlayer.units[i];

    // start turn for next
    messageContext.message({ cmd: Msg.START_TURN, pId: map.currentPlayer, local:true });
  },

  // validator
  { properties:{
    pId : map.playerIdValidator
  }}
);

// ========================================================================
commandNode( Msg.NEXT_DAY, function(){
  map.currentDay++;
});

// ========================================================================
commandNode( Msg.START_TURN, function(msg){
  var player = map.players[ msg.pId ];

  var prop;
  for( var i=0,e=map.properties.length; i<e; i++ ){
    prop = map.properties[i];

    if( prop.owner === player ){
      // TODO give funds

      // TODO repair unit
    }
  }
});