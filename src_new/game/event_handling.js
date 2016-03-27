cwt.client_event_initialize_model = function() {
};

cwt.client_event_register_object_type = function(type, sheet) {
  switch (type) {

    case "tile":
      cwt.GAME.tileDB.registerSheet(sheet);
      return;

    case "unit":
      cwt.GAME.unitDB.registerSheet(sheet);
      return;

    case "movetype":
      cwt.GAME.movetypeDB.registerSheet(sheet);
      return;

    case "weather":
      cwt.GAME.weatherDB.registerSheet(sheet);
      return;

    default:
      Require.isTrue(false, "unknown game object type " + type);
  }
};

cwt.client_event_load_map = function(map) {
  cwt.GAME.mapLoader.loadMap(map);
};

cwt.client_event_push_command = function(data) {
  cwt.GAME.commandInterpreter.pushCommand(data.key, data.p1, data.p2, data.p3, data.p4, data.p5);
};

/*
stInterval(function() {
  if (cwt.commands_has_buffered_commands()) {
    cwt.commands_evaluate_next();
  }
}, 50);*/
