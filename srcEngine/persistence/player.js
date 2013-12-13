model.event_on("prepare_game",function( dom ){
  assert( util.intRange(dom.player,2,MAX_PLAYER) );
  
  var player, i, e;
  for( i=0,e=MAX_PLAYER; i<e; i++ ){
    
    player      = model.player_data[i];
    player.name = null;
    player.gold = 0;
    player.team = (i <= dom.player-1)? i : DESELECT_ID;
  }
});

model.event_on("load_game",function( dom ){
  var data, player, i, e;
  for( i=0,e=dom.players.length; i<e; i++ ){
    data = dom.players[i];
    
    // check data
    assert( util.intRange(data[0],0,MAX_PLAYER-1) );
    assert( util.isString(data[1]) );
    assert( util.intRange(data[2],0,999999) );
    assert( util.intRange(data[3],0,MAX_PLAYER-1) );
    
    // set player data
    player      = model.player_data[data[0]];
    player.name = data[1];
    player.gold = data[2];
    player.team = data[3];
  }
});

//model.event_on("save_game",function( dom ){});