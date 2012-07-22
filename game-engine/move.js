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
		var c = movetype.costs[ tiletype ];
    // console.log( "MOVECOST "+tiletype+" -> "+c );
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
		var mType = cwt.db.movetype( type.moveType );

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
		map.moveMap = {};
		map.way = [];

		// decrease range if not enough fuel is available
		if( unit.fuel < map.r ) map.r = unit.fuel;

		// build move map
		var tile,
				cost,
				rest;
		var needsCheck = [ [ x, y, map.r ] ];
		while( needsCheck.length > 0 ){

      // get next tile
			tile = needsCheck[ needsCheck.length-1 ];
			needsCheck.splice(0,1);

      console.log("check tile - "+JSON.stringify( tile )+ " rest is "+JSON.stringify(needsCheck) );

			// UP
			if( tile[1] > 0 )
				this._checkMove( tile[0], tile[1]-1, tile[2], mType, map.moveMap, needsCheck );

			// RIGHT
			if( tile[0] < cwt.map._width-1 )
				this._checkMove( tile[0]-1, tile[1], tile[2], mType, map.moveMap, needsCheck );

			// DOWN
			if( tile[1] < cwt.map._height-1 )
				this._checkMove( tile[0], tile[1]+1, tile[2], mType, map.moveMap, needsCheck );

			// LEFT
			if( tile[0] > 0 )
				this._checkMove( tile[0]+1, tile[1], tile[2], mType, map.moveMap, needsCheck );
		}

    console.log("result move card- "+JSON.stringify( map ));

		return map;
	},

	_checkMove: function( tx, ty, mvp, mType, movemap, checkMap ){

    console.log("check move to - ("+tx+","+ty+")");
		var cost = this.moveCosts( mType, cwt.map._map[ tx ][ ty ] );
		if( cost != -1 ){

			var rest = mvp-cost;
      console.log("rest mvp "+rest);
			if( rest >= 0 ){

				if( !movemap.hasOwnProperty( tx ) ){
          movemap[ tx ] = {};
				}

        if( movemap[ tx ].hasOwnProperty( ty ) ){
          console.log("move already exists");

          if( movemap[ tx ][ ty ] < rest ){
            console.log("new move is cheaper");
          }
        }

				if( !movemap[ tx ].hasOwnProperty( ty ) ||
          movemap[ tx ][ ty ] < rest ){

            console.log("add move to - ("+tx+","+ty+")");

						// add to to check map
						checkMap.push( [ tx, ty, rest ] );

						// add to move map
						movemap[ tx ][ ty ] = cost;
				}
			}
		}
	},

	/**
	 * Makes a move by a given move card object.
	 *
	 * @param card
	 */
	move: function( card ){

		var cX = card.x,
				cY = card.y;
		var way = card.way;
		var unit = cwt.map.unit( card.uid );
		var uType = cwt.db.unit( unit.type );
		var mType = cwt.db.movetype( uType.moveType );

		// check move way end
		var lastIndex = way.length-1;
		var fuelUsed = 0;
		for( var i=0,e=way.length; i<e; i++ ){

			// get new current position
			switch( way[i] ){

				case this.CODE_UP:
					if( cY === 0 ) throw Error("cannot do move command UP because current position is at the border");
					cY--;
          break;

				case this.CODE_RIGHT:
					if( cX === cwt.map._width-1 ){
						throw Error("cannot do move command UP because current position is at the border");
					}
					cX++;
          break;

				case this.CODE_DOWN:
					if( cY === cwt.map._height-1 ){
						throw Error("cannot do move command DOWN because current position is at the border");
					}
					cY++;
          break;

				case this.CODE_LEFT:
					if( cX === 0 ) throw Error("cannot do move command LEFT because current position is at the border");
					cX--;
          break;

				default: throw Error("unknown command "+way[i]);
			}

			// is way blocked ?
			if( this._wayBlocked( cX, cY, unit.owner, i == e-1 ) ){

				lastIndex = i-1;

				if( lastIndex == -1 ){

					// that is a fault
					throw Error("unit is blocked by an enemy, but the enemy stands beside the start tile, that is a logic fault!");
				}

				break;
			}

			// increase fuel usage
			fuelUsed += this.moveCosts( mType, cwt.map._map[cX][cY] );
		}

		// update meta data
		unit.x = cX;
		unit.y = cY;
		unit.fuel -= fuelUsed;
	},

	/**
	 * Is a way blocked if an unit of an owner want to move to a given position?
	 *
	 * @param x
	 * @param y
	 * @param owner
	 */
	_wayBlocked: function( x,y, owner, lastTile ){

		// check current position
		var unit = cwt.map.unitByPos(x,y);
		if( unit !== null ){

			if( unit.owner === owner ){

				if( lastTile ){
					// that is a fault
					throw Error("cannot move onto a tile that is occupied by an own unit");
				}
				// else move through it :P
			}
			else if( cwt.map.player(unit.owner).team === cwt.map.player(owner).team ){

				if( lastTile ){

					// that is a fault
					throw Error("cannot move onto a tile that is occupied by an allied unit");
				}
				// else move through it :P
			}
			else{

				// enemy unit
				return true;
			}
		}

		return false;
	}
};