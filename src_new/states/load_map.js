cwt.game_state_add_state("load_map", {

  on_enter: function() {
    cwt.log_info("loading fake map");

    cwt.sheets_register_tile_type({
      id: "PLIN"
    });

    cwt.map_loader_load_map({
      name: "development fake map",
      height: 10,
      width: 10,
      fill_type: "PLIN"
    });
  }
});