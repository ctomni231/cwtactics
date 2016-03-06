cwt.game_event_entered_state = function(state_id) {};

cwt.game_event_error = function(error) {};

cwt.game_event_unit_attacks = function(attacker_id, attacker_x, attacker_y, defender_id, defender_x, defender_y) {};

cwt.game_event_unit_will_be_attacked = function(unit_id, unit_x, unit_y) {};

cwt.game_event_unit_lost_health = function(unit_id, x, y, lost_health, current_health) {};

cwt.game_event_unit_destroyed = function(unit_id, x, y) {};

cwt.game_event_unit_builded = function(factory_id, unit_type, owner_id, x, y) {};

cwt.game_event_unit_leveled_up = function(unit_id, level) {};

cwt.game_event_units_joined = function(source_unit_id, target_unit_id, target_x, target_y) {};

cwt.game_event_unit_moved = function(unit_id, start_x, start_y, end_x, end_y, way) {};

cwt.game_event_unit_placed_at_position = function(unit_id, x, y) {};

cwt.game_event_turn_changed = function(day, turn_owner_id) {};

cwt.game_event_weather_changes = function(weather_id, duration) {};

cwt.game_event_modified_player_power = function(player_id, change, new_value) {};

cwt.game_event_player_activates_power = function(player_id, power_level) {};

cwt.game_event_fire_rocket = function(silo_id, unit_id, silo_x, silo_y, target_x, target_y) {};

cwt.game_event_load_unit = function(transporter_id, load_id, transporter_x, transporter_y) {};

cwt.game_event_unload_unit = function(transporter_id, load_id, transporter_x, transporter_y, unload_direction) {};

cwt.game_event_unit_captures = function(property_id, capturer_id) {};

cwt.game_event_property_captured = function(property_id, new_owner_id, capturer_id) {};

cwt.game_event_tile_is_visible = function(tile_x, tile_y) {};

cwt.game_event_tile_is_not_visible = function(tile_x, tile_y) {};

cwt.game_event_tile_got_type = function(x, y, type) {};

cwt.client_event_player_joins_battle = function(player_id, player_type, name) {};

cwt.client_event_player_leaves_battle = function() {};

cwt.client_event_prepare_battle = function(map) {};

cwt.client_event_start_battle = function() {};