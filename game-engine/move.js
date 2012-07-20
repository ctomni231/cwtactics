cwt.move = {
	
	// diferent move codes
	CODE_UP: 0,
	CODE_RIGHT: 1,
	CODE_DOWN: 2,
	CODE_LEFT: 3,
	
	/**
	 * Returns the costs for a movetype to move onto a tile type.
	 */
	moveCosts: function( movetype, tiletype ){
		var c;
		
		// search id
		var c = movetype.costs[ tiletype.id ];
		if( c !== undefined ) return c;
		
		// search tags (TODO)
		
		// fallback entry
		return movetype.costs["*"];
	},
	
	/**
	 * Creates a move map for a given unit. The position of the unit can be faked by a given second
	 * and third argument that indicates a possible position. If only the unit id is given, then
	 * the unit position will be used.
	 */
	createMoveCard: function( uid, x, y ){
		var map = {};
		var unit = cwt.model.unit( uid );
		var type = cwt.db.unit( unit.type );
		
		// if no position is given then use the unit position
		if( arguments.length === 1 ){
			x = unit.x;
			y = unit.y;
		}
		
		// meta data
		map.uid = uid;
		map.x = x;
		map.y = y;
		map.r = type.moveRange;
		map.moveMap = [];
		map.way = [];
		
		// decrease range if not enough fuel is available
		if( unit.fuel < map.r ) map.r = unit.fuel;
		
		// build move map
		var tile;
		var cost;
		var needsCheck = [ x, y, map.r ];
		needsCheck.size = 1;
		while( needsCheck.size > 0 ){
			tile = needsCheck[ needsCheck.size-1 ];
			needsCheck.size--;
			
			// check up
			if( tile[1] > 0 ){
				cost = this.moveCosts( type, cwt.map.tile( tile[0], tile[1]-1 ) );
			}
			
			// check right
			
			// check down
			
			// check left
		}
		needsCheck.splice(0);
		  
		return map;
	},
	
	move: function( card ){
		
		
	}
};