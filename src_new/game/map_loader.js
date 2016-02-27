cwt.map_loader_load_map = function(map) {
  cwt.log_info(cwt.require_string(map.name));

  cwt.map_set_size(cwt.require_integer(map.width), cwt.require_integer(map.height));
  cwt.map_fill_with_tiles(cwt.require_string(map.fill_type));
};