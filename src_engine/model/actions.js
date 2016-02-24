// Holds the identical numbers of all objects that can act during the turn. After a unit has acted,
// it should be removed from this list with `model.actions_markUnitNonActable`.
//
model.actions_leftActors = util.list(MAX_UNITS_PER_PLAYER, false);

// Returns true if the selected uid can act in the current active turn, else false.
//
model.actions_canAct = function(uid) {
  assert(model.unit_isValidUnitId(uid));

  var startIndex = model.round_turnOwner * MAX_UNITS_PER_PLAYER;
  if (uid >= startIndex + MAX_UNITS_PER_PLAYER || uid < startIndex) {
    return false;
  } else return (model.actions_leftActors[uid - startIndex] === true);
};

cwt.usable_create_context = function() {
  return cwt.list_created_filled_list(MAX_UNITS_PER_PLAYER, false);
};

function usable_to_clean_index(turn_owner_id, unit_id) {
  unit_id -= turn_owner_id * MAX_UNITS_PER_PLAYER;
  cwt.assert_true(unit_id >= 0 && unit_id < MAX_UNITS_PER_PLAYER);
  return unit_id;
}

cwt.usable_make_all_usable = function(ctx) {
  cwt.list_for_each(ctx, function(el, index) {
    ctx[index] = true;
  });
};

cwt.usable_make_usable = function(ctx, turn_owner_id, unit_id) {
  ctx[usable_to_clean_index(turn_owner_id, unit_id)] = true;
};

cwt.usable_make_unusable = function(ctx, turn_owner_id, unit_id) {
  ctx[usable_to_clean_index(turn_owner_id, unit_id)] = false;
};

cwt.usable_is_usable = function(ctx, turn_owner_id, unit_id) {
  return ctx[usable_to_clean_index(turn_owner_id, unit_id)] === true;
};