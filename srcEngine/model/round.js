controller.defineGameConfig("round_dayLimit",0,999,0);

// Represents the current action day in the game. The day attribute increases
// everytime if the first player starts its turn.
//
model.round_day = 0;

// Holds the identical number of the current turn owner.
//
model.round_turnOwner = -1;

// Returns true if the given player id is the current turn owner.
//
model.round_isTurnOwner = function( pid ){
  return model.round_turnOwner === pid;
};

// Converts a number of days into turns.
//
model.round_daysToTurns = function( v ){
  return model.player_data.length*v;
};
