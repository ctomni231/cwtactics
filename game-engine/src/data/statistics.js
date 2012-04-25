var statistic = [];

reactOn( Msg.UNIT_DESTROYED, function( msg ){
  //statistic[ msg.aId ].destroyedUnits++;
});

reactOn( Msg.CAPTURE, function( msg ){
  //statistic[ msg.cId ].capturedBuildings++;
});

reactOn( Msg.GAME_INIT, function(){
  // reset all statistic values
  for( var i=0; i<MAX_PLAYER; i++ ){
    statistic[i].capturedBuildings = 0;
    statistic[i].destroyedUnits = 0;
  }
});