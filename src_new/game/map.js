var map;
var height = 0;
var width = 0;

cwt.map_initialize = function() {
  map = [];
  for (var x = 0; x < MAX_MAP_WIDTH; x += 1) {
    map[x] = [];
  }
};

cwt.map_set_size = function(map_width, map_height) {
  cwt.assert_true(cwt.type_is_integer(map_width) && map_width > 0);
  cwt.assert_true(cwt.type_is_integer(map_height) && map_height > 0);

  width = map_width;
  height = map_height;
};

cwt.map_fill_with_tiles = function(type) {
  var tile_type;

  cwt.assert_true(width > 0 && height > 0);
  cwt.assert_true(width < MAX_MAP_WIDTH && height < MAX_MAP_HEIGHT);

  cwt.require_something(cwt.tiles_get_type(type));

  for (var x = 0; x < width; x += 1) {
    for (var y = 0; y < height; y += 1) {
      cwt.map_set_tile(x, y, type);
    }
  }
};

cwt.map_get_tile = function(x, y) {
  return map[x][y];
};

cwt.map_set_tile = function(x, y, type) {
  cwt.require_integer(y);
  cwt.require_integer(x);

  map[x][y] = type;
  cwt.game_event_tile_got_type(x, y, type);
};