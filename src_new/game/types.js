function assert_valid_id(id) {
  cwt.assert_true(id.length === 4);
}

function register_type(data, sheet_map) {
  var sheet = {};

  sheet.id = cwt.require_string(data.id);
  assert_valid_id(data.id);
  cwt.require_nothing(tiles[data.id]);

  sheet_map[data.id] = sheet;

  return sheet;
}

var tiles = {};

cwt.sheets_register_tile_type = function(data) {
  var sheet;

  sheet = register_type(data, tiles);
};

cwt.sheets_get_tile_type = function(id) {
  return cwt.require_something(tiles[id]);
};