cwt.game_state_add_state("load_map", {

  on_enter: function() {
    cwt.log_info("loading fake map");

    cwt.tiles_register_type({
      id: "PLIN"
    });

    cwt.map_loader_load_map({
      name: "development fake map",
      height: 10,
      width: 10,
      fill_type: "PLIN",
      players: 2,
      units: [{
        type: "INFT",
        x: 2,
        y: 2,
        owner: 0
      }, {
        type: "INFT",
        x: 3,
        y: 4,
        owner: 0
      }, {
        type: "INFT",
        x: 3,
        y: 3,
        owner: 1
      }]
    });
  }
});