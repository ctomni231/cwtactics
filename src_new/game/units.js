var units;
var positions;
var types;

function get_free_unit_id() {
  var neutral_owner_id;

  neutral_owner_id = cwt.players_get_neutral_id();
  for (var i = 0; i < units.length; i += 1) {
    if (units[i].owner === neutral_owner_id) {
      return i;
    }
  }

  cwt.assert_true(false, "no free unit slot left");
}

function get_position_code(x, y) {
  return (x * 1000) + y;
}

cwt.units_initialize = function() {
  units = cwt.list_created_filled_list_with_provider(MAX_PLAYERS * MAX_UNITS, function() {
    return {
      owner: cwt.players_get_neutral_id(),
      x: 0,
      y: 0
    };
  });

  types = {};
  positions = {};
};

cwt.units_remove_all_from_map = function() {
  cwt.list_for_each(units, function(unit) {
    unit.owner = cwt.players_get_neutral_id();
  });
};

cwt.units_create_unit_at = function(type, owner_id, x, y) {
  var unit_id = get_free_unit_id();
  cwt.units_set_unit_owner(unit_id, owner_id);
  cwt.units_set_unit_position(unit_id, x, y);
};

cwt.units_get_unit_by_id = function(id) {
  return units[cwt.require_integer(id)];
};

cwt.units_get_unit_by_position = function(x, y) {
  var unit_id = positions[get_position_code(x, y)];
  if (!cwt.type_is_nothing(unit_id)) {
    return units[unit_id];
  }
  cwt.assert_true(false, "no unit at {" + x + ", " + y + "}");
};

cwt.units_set_unit_owner = function(id, owner_id) {
  cwt.assert_true(cwt.players_is_player_id(owner_id));
  var unit = cwt.units_get_unit_by_id(id);
  unit.owner = owner_id;
};

cwt.units_set_unit_position = function(id, x, y) {
  cwt.require_nothing(positions[get_position_code(x, y)]);

  var unit = cwt.units_get_unit_by_id(id);
  delete positions[get_position_code(unit.x, unit.y)];

  unit.x = cwt.require_integer(x);
  unit.y = cwt.require_integer(y);

  cwt.assert_true(unit.x >= 0 && unit.y >= 0);
  positions[get_position_code(x, y)] = id;

  cwt.game_event_unit_placed_at_position(id, x, y);
};

cwt.units_get_type = function(id) {
  return cwt.require_something(types[id]);
};

cwt.units_register_type = function(data) {
  var sheets = cwt.sheets_register_base_type(data, types);
};