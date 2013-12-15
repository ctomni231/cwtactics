// Holds the identical numbers of all objects that can act during the turn. After a unit has acted,
// it should be removed from this list with `model.actions_markUnitNonActable`.
//
model.actions_leftActors = util.list( MAX_UNITS_PER_PLAYER, false );

// Returns true if the selected uid can act in the current active turn, else false.
//
model.actions_canAct = function( uid ){
  assert( model.unit_isValidUnitId(uid) );

  var startIndex = model.round_turnOwner * MAX_UNITS_PER_PLAYER;
  if( uid >= startIndex + MAX_UNITS_PER_PLAYER || uid < startIndex ){
         return false;
  } else return ( model.actions_leftActors[ uid - startIndex ] === true );
};
