/**
 * Loads a map into the game model. The map can be a plain map or
 * sa save game.
 *
 * @param  {object} map map or save object
 */
cwt.map_loader_load_map = function(map) {
  cwt.log_info("load map '" + cwt.require_string(map.name) + "'");

  // --------------- DEV ---------------
  cwt.stress_simulate_a_lot_of_it(50);
  // --------------- DEV ---------------

  cwt.turn_set_day(cwt.type_is_something(map.day) ? map.day : 0);

  cwt.map_set_size(map.width, map.height);
  cwt.map_fill_with_tiles(cwt.require_string(map.fill_type));

  cwt.turn_set_owner(cwt.type_is_something(map.turn_owner) ? map.turn_owner : 0);

  cwt.players_deactivate_all();
  if (cwt.type_is_something(map.players)) {
    if (cwt.type_is_integer(map.players)) {
      for (var i = 0; i < map.players; i += 1) {
        cwt.players_set_team(i, i);
        cwt.players_set_name(i, "Player " + i);
      }

    } else {
      cwt.list_for_each(map.players, function(data, player_id) {
        cwt.players_set_team(player_id, cwt.type_is_something(data.team) ? data.team : player_id);
        cwt.players_set_name(player_id, cwt.type_is_something(data.name) ? data.name : "Player " + player_id);
      });
    }
  }

  cwt.units_remove_all_from_map();
  if (cwt.type_is_something(map.units)) {
    cwt.list_for_each(map.units, function(data, unit_id) {
      cwt.units_create_unit_at(data.type, data.owner, data.x, data.y);
    });
  }
};