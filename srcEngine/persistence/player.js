controller.persistence_defineHandler(
	
	// load
	function(dom){
		var data, player, i, e;

		// reset player data
		for( i=0,e=MAX_PLAYER; i<e; i++ ){
			player      = model.player_data[i];
			player.name = null;
			player.gold = 0;
			player.team = INACTIVE_ID;
		}
		
		// set player data from save
		if( !util.isUndefined(dom.players) ){
			for( i=0,e=dom.players.length; i<e; i++ ){
				data = dom.players[i];
				
				// check data
        assert( util.intRange(data[0],0,MAX_PLAYER-1) );
        assert( util.isInt(   data[1]) );
        assert( util.intRange(data[2],0,999999) );
        assert( util.intRange(data[3],0,MAX_PLAYER-1) );
				
				// set player data
				player      = model.player_data[data[0]];
				player.name = data[1];
				player.gold = data[2];
				player.team = data[3];
			}
		}
	},
	
	// save
	function(dom){

  }
);