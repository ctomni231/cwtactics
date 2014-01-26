/**
 * @class
 */
cwt.Player = my.Class({

  STATIC: {

    /**
     * Different relationships between two objects.
     */
    RELATION_MODES: {
      SAME_OBJECT: -1,
      NONE: 0,
      OWN: 1,
      ALLIED: 2,
      TEAM: 3,
      ENEMY: 4,
      NULL: 5
    }
  },

  initialize: function () {
    this.units = cwt.List.generateList(MAX_UNITS_PER_PLAYER, null);
    this.gold = 0;
    this.power = 0;
    this.powerUsed = 0;
    this.manpower = Math.POSITIVE_INFINITY;
    this.coA = null;
  },

  /**
   * Returns true, when the player has at least one free slot left,
   * else false.
   */
  hasFreeUnitSlot: function () {
    var e = MAX_UNITS_PER_PLAYER;
    for (; i < e; i++) {
      if (!this.units[i]) return true;
    }
    return false;
  },

  /**
   * Returns the index of the next free unit slot.
   */
  getFreeUnitSlot: function () {
    var e = MAX_UNITS_PER_PLAYER;
    for (; i < e; i++) {
      if (this.units[i]) return i;
    }
    throw Error("no free slot found");
  },
  
  

// Returns `true` when at least two opposite teams are left, else `false`.
//
model.player_areEnemyTeamsLeft = function(){
  var player;
  var foundTeam  = -1;
  var i          = 0;
  var e          = model.player_data.length;

  for( ; i<e; i++ ){
    player = model.player_data[i];

    if( player.team !== -1 ){

      // found alive player
      if( foundTeam === -1 ) foundTeam = player.team;
      else if( foundTeam !== player.team ){
        foundTeam = -1;
        break;
      }
    }
  }

  return (foundTeam === -1);
};

// Returns true if there is an unit with a given relationship on a tile at a given position (x,y).
//
model.player_getRelationship = function( pidA, pidB ){

  // none
  if( pidA === null || pidB === null ) return model.player_RELATION_MODES.NULL;
  if( pidA === -1   || pidB === -1   ) return model.player_RELATION_MODES.NONE;
  if( model.player_data[pidA].team === -1 ||
      model.player_data[pidB].team === -1 ) return model.player_RELATION_MODES.NONE;

  // own
  if( pidA === pidB ) return model.player_RELATION_MODES.OWN;

  var teamA = model.player_data[pidA].team;
  var teamB = model.player_data[pidB].team;
  if( teamA === -1 || teamB === -1 ) return model.player_RELATION_MODES.NONE;

  // allied
  if( teamA === teamB ) return model.player_RELATION_MODES.ALLIED;

  // enemy
  if( teamA !== teamB ) return model.player_RELATION_MODES.ENEMY;

  return model.player_RELATION_MODES.NONE;
};

// Returns true if there is an unit with a given relationship in one of the neighbour
// tiles at a given position (x,y).
//
// @example
//       x
//     x o x
//       x
//
model.player_getRelationshipUnitNeighbours = function( pid, x,y , mode ){
  assert( model.property_isValidPropId(pid) );
  assert( model.map_isValidPosition(x,y) );

  var check = model.player_getRelationship;

  var ownCheck = ( mode === model.player_RELATION_MODES.OWN );
  var i = 0;
  var e = model.unit_data.length;

  // enhance lookup when only
  // own units are checked
  if( ownCheck ){
    i = model.unit_firstUnitId(pid);
    e = model.unit_lastUnitId(pid);
  }

  // check all
  for( ; i<e; i++ ){

    // true when neighbor is given and mode is correct
    if( model.unit_getDistance( sid, i ) === 1 ){
      if( ownCheck || check( pid, model.unit_data[i].owner ) === mode ) return true;
    }
  }

  return false;
};


});