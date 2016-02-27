var turn_owner_id;
var day;

cwt.turn_set_day = function(day_value) {
  day = cwt.require_integer(day_value);
};

cwt.turn_set_owner = function(owner_id) {
  cwt.assert_true(cwt.players_is_player_id(owner_id));
  turn_owner_id = owner_id;
  cwt.game_event_turn_changed(day, turn_owner_id);
};

cwt.turn_get_owner = function() {
  return turn_owner_id;
};

cwt.turn_pick_next_owner = function() {
  var current_owner_id, next_possible_owner_id;

  current_owner_id = cwt.turn_get_owner();
  next_possible_owner_id = current_owner_id;
  do {

    next_possible_owner_id += 1;
    if (next_possible_owner_id === cwt.players_get_neutral_id()) {
      next_possible_owner_id = 0;

      // if the next possible turn owner is player 0 then 
      // it means that means all players acted and the next
      // day starts
      cwt.turn_set_day(day + 1);
    }

    if (cwt.players_is_active_player(next_possible_owner_id)) {
      cwt.turn_set_owner(next_possible_owner_id);
      return next_possible_owner_id;
    }

  } while (current_owner_id != next_possible_owner_id);

  cwt.assert_true(false, "unable to pick a new turn owner");
};