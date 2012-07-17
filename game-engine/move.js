cwt.move = {

	calculateWay: function( uid, tx, ty ){
		var unit = map.unit(uid);
		var sx = unit.x;
		var sy = unit.y;
	},

	moveCosts: function( movetype, tiletype ){

		var c;

		// search id
		var c = movetype.costs[ tiletype.id ];
		if( c !== undefined ) return c;

		// search tags (TODO)

		// fallback entry
		return movetype.costs["*"];
	},

	generateMoveCard: function( uid ){

		var unit = map.unit(uid);
		var x = unit.x;
		var y = unit.y;

		// get the calculator function
		var getCost = this.generateCostCalculator(
			db.movetype( db.unit( unit.type ).movetype )
		);

		var card = {
			uid: uid,
			field: {

			},
			way: []
		};

		// build move way

		return card;
	},

	move: function( card ){
		cwt.util.publish("move/move", card);

		//TODO check card
		if(
			card.uid < 0 ||
				card.uid > map.units.length ||
				card.way.length === 0
			){
			this.events.emit("gameError",{
				source:"move",
				msg:"illegal card values",
				attached: card
			});
		}

		var unit = map.units[ card.uid ];
		var way = card.way;
		var x = unit.x;
		var y = unit.y;

		// check moveway
		for( var i=0,e=way.length; i<e; i++ ){

			// change current position
			var cmd = way[i];
			if( cmd === 0 ) y--;
			else if( cmd === 1 ) x++;
			else if( cmd === 2 ) y++;
			else if( cmd === 3 ) x--;
			else throw Error("illegal way code");

			// if there is an unit in the way, break ( except own one )
			//TODO allies?
			//		if( typeof map[x][y].unit === 'number' && map.units[map[x][y].unit].owner !== unit.owner ) break;

			// update last tile
			lX = x;
			lY = y;
		}

		// set new position
		//map[lX][lY].unit = msg.uid;
	}
};