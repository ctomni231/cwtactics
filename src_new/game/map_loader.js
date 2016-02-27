cwt.map_loader_load_map = function(map) {
  cwt.log_info(cwt.require_string(map.name));

  cwt.map_set_size(cwt.require_integer(map.width), cwt.require_integer(map.height));
  cwt.map_fill_with_tiles(cwt.require_string(map.fill_type));

  cwt.units_remove_all_from_map();
  cwt.list_for_each(map.units, function(data, unit_id) {
    cwt.units_create_unit_at(data.type, data.owner, data.x, data.y);
  });
};