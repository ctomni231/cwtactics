cwt.client_event_initialize_model = function() {
  cwt.map_initialize();
  cwt.players_initialize();
  cwt.units_initialize();
};

cwt.client_event_register_object_type = function(type, sheet) {
  switch (type) {

    case "tile":
      cwt.tiles_register_type(sheet);
      return;

    case "unit":
      cwt.units_register_type(sheet);
      return;

    case "movetype":
      cwt.move_register_type(sheet);
      return;

    case "weather":
      cwt.weather_register_type(sheet);
      return;

    default:
      cwt.assert_true(false, "unknown game object type " + type);
  }
};

cwt.client_event_load_map = function(map) {
  cwt.map_loader_load_map(map);
};

cwt.client_event_push_command = function(data) {
  cwt.commands_push_command(data.key, data.p1, data.p2, data.p3, data.p4, data.p5);
};

setInterval(function() {
  if (cwt.commands_has_buffered_commands()) {
    cwt.commands_evaluate_next();
  }
}, 50);